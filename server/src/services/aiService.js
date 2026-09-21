const OpenAI = require('openai');

let openaiClient = null;

const getClient = () => {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 90000,  // 90 s — prevents indefinite hangs before a retry
      maxRetries: 0,   // we handle retries ourselves below
      // Node 18+ has native fetch; force the SDK to use it instead of
      // the bundled node-fetch v2 which breaks on Node 18+ stream decompression
      fetch: globalThis.fetch,
    });
  }
  return openaiClient;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryable = (error) => {
  // HTTP-level: rate limit or server error
  if (error?.status === 429 || error?.status >= 500) return true;
  // Network-level: premature close, connection reset, timeout
  const msg = error?.message || '';
  return (
    msg.includes('Premature close') ||
    msg.includes('ECONNRESET') ||
    msg.includes('ETIMEDOUT') ||
    msg.includes('ENOTFOUND') ||
    msg.includes('network') ||
    error?.code === 'ECONNRESET' ||
    error?.code === 'ETIMEDOUT'
  );
};

const callWithRetry = async (fn, retries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (isRetryable(error) && attempt < retries) {
        const backoff = delay * Math.pow(2, attempt - 1);
        console.warn(
          `OpenAI attempt ${attempt} failed (${error?.status || error?.code || error?.message}). Retrying in ${backoff}ms...`
        );
        await sleep(backoff);
      } else {
        throw error;
      }
    }
  }
};

const GENERATION_SYSTEM_PROMPT = `You are an expert software quality assurance engineer specializing in test case design. 
Your task is to analyze software requirements and generate comprehensive test artifacts.
Always respond with valid JSON only — no markdown fences, no prose before or after.
Generate thorough test coverage including positive, negative, edge case, and validation scenarios.`;

const buildGenerationPrompt = (requirements, contextDescription, format, category, technique) => {
  const formatLabel =
    format === 'bdd' ? 'BDD (Gherkin)' : format === 'bdd2' ? 'BDD 2.0' : 'Standard';
  return `Analyze the following software requirements and generate a comprehensive set of test artifacts.

REQUIREMENTS:
${requirements}

${contextDescription ? `ADDITIONAL CONTEXT:\n${contextDescription}\n` : ''}
TEST FORMAT: ${formatLabel}
${category ? `DESIGN CATEGORY: ${category}` : ''}
${technique ? `DESIGN TECHNIQUE: ${technique}` : ''}

Generate 3 logical workflows from these requirements. For each workflow, produce:
- rules: business and functional rules (4-6 per workflow, mix of Pass/Fail/Validation tags)
- userStories: user stories in "As a ... I want ... So that ..." format (3-4 per workflow)
- testCases: test cases covering positive, negative, edge, and validation scenarios (4-6 per workflow)

Return ONLY the following JSON structure (no other text):
{
  "workflows": [
    {
      "name": "string",
      "description": "string",
      "nodes": [
        { "id": "n1", "type": "start", "label": "Start", "x": 100, "y": 200, "connections": ["n2"] }
      ],
      "rules": [
        { "text": "string", "tags": ["Pass"], "priority": "high" }
      ],
      "userStories": [
        {
          "title": "string",
          "description": "As a [user] I want [feature] so that [benefit]",
          "acceptanceCriteria": ["string"],
          "tags": ["string"]
        }
      ],
      "testCases": [
        {
          "title": "string",
          "description": "string",
          "type": "positive",
          "steps": [
            { "stepNumber": 1, "action": "string", "expectedResult": "string" }
          ],
          "preconditions": ["string"],
          "tags": ["string"],
          "priority": "medium"
        }
      ]
    }
  ]
}`;
};

const generateWorkflows = async (requirements, contextDescription, format, category, technique) => {
  const client = getClient();
  const prompt = buildGenerationPrompt(requirements, contextDescription, format, category, technique);

  const response = await callWithRetry(() =>
    client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: GENERATION_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    })
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');

  let parsed;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error('OpenAI returned invalid JSON');
  }

  if (!parsed.workflows || !Array.isArray(parsed.workflows)) {
    throw new Error('OpenAI response missing workflows array');
  }

  return parsed;
};

const generateTestCases = async (requirements, format, category, technique) => {
  const client = getClient();
  const formatLabel =
    format === 'bdd' ? 'BDD (Gherkin)' : format === 'bdd2' ? 'BDD 2.0' : 'Standard';

  const prompt = `Generate test cases for the following requirements in ${formatLabel} format.
${category ? `Design Category: ${category}` : ''}
${technique ? `Design Technique: ${technique}` : ''}

REQUIREMENTS:
${requirements}

Return ONLY JSON:
{
  "testCases": [
    {
      "title": "string",
      "description": "string",
      "type": "positive|negative|edge|validation",
      "steps": [{ "stepNumber": 1, "action": "string", "expectedResult": "string" }],
      "preconditions": ["string"],
      "tags": ["string"],
      "priority": "low|medium|high"
    }
  ]
}`;

  const response = await callWithRetry(() =>
    client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: GENERATION_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    })
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');

  return JSON.parse(content);
};

const regenerateTestCases = async (projectContext, feedback) => {
  const client = getClient();

  const prompt = `You previously generated test cases for the following project context.
The user has provided feedback to improve them.

PROJECT CONTEXT:
${JSON.stringify(projectContext, null, 2)}

USER FEEDBACK:
${feedback}

Regenerate improved test cases addressing the feedback. Return ONLY JSON with the same structure as before:
{
  "workflows": [ ... ]
}`;

  const response = await callWithRetry(() =>
    client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: GENERATION_SYSTEM_PROMPT },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 8000,
      response_format: { type: 'json_object' },
    })
  );

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from OpenAI');

  return JSON.parse(content);
};

module.exports = { generateWorkflows, generateTestCases, regenerateTestCases };
