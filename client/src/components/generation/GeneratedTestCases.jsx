import React, { useState } from 'react';
import {
  RiArrowDownSLine, RiArrowRightSLine,
  RiCheckboxLine, RiCheckboxBlankLine,
  RiPencilLine, RiDeleteBin6Line,
} from 'react-icons/ri';
import Badge from '../common/Badge.jsx';
import ActionToolbar from '../common/ActionToolbar.jsx';
import { useGeneration } from '../../hooks/useGeneration.js';
import { useAppContext } from '../../context/AppContext.jsx';
import * as api from '../../services/api.js';

export default function GeneratedTestCases() {
  const { testCases, bulkApproveTestCases, bulkDeleteTestCases, approveAllTestCases } = useGeneration();
  const { loading, updateTestCase } = useAppContext();
  const [selected, setSelected] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const selectAll = () =>
    setSelected(selected.length === testCases.length ? [] : testCases.map((tc) => tc._id));

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const startEdit = (tc) => { setEditId(tc._id); setEditData({ title: tc.title, description: tc.description }); };
  const saveEdit = async () => {
    const updated = await api.updateTestCase(editId, editData);
    updateTestCase(updated);
    setEditId(null);
  };

  const handleApproveSelected = async () => {
    await bulkApproveTestCases(selected);
    setSelected([]);
  };

  const handleDeleteSelected = async () => {
    await bulkDeleteTestCases(selected);
    setSelected([]);
  };

  return (
    <div className="generated-panel">
      <div className="panel-header">
        <span className="panel-title">Generated Test Cases ({testCases.length})</span>
        <button
          className="btn btn--primary btn--sm"
          type="button"
          onClick={approveAllTestCases}
          disabled={loading}
        >
          Approve All &amp; Proceed
        </button>
      </div>

      <div className="panel-list">
        <div className="list-header-row">
          <button className="icon-btn" type="button" onClick={selectAll} title="Select all">
            {selected.length === testCases.length && testCases.length > 0
              ? <RiCheckboxLine size={16} />
              : <RiCheckboxBlankLine size={16} />}
          </button>
          <span className="list-col-main">Test Case</span>
          <span className="list-col-tags">Tags</span>
          <span className="list-col-actions">Actions</span>
        </div>

        {testCases.map((tc) => (
          <div key={tc._id} className={`list-row${selected.includes(tc._id) ? ' list-row--selected' : ''}`}>
            <div className="list-row-left">
              <button className="icon-btn" type="button" onClick={() => toggleSelect(tc._id)}>
                {selected.includes(tc._id) ? <RiCheckboxLine size={16} /> : <RiCheckboxBlankLine size={16} />}
              </button>
              <button className="icon-btn" type="button" onClick={() => toggleExpand(tc._id)}>
                {expanded[tc._id] ? <RiArrowDownSLine size={16} /> : <RiArrowRightSLine size={16} />}
              </button>
              <div className="list-row-content">
                {editId === tc._id ? (
                  <input
                    className="inline-edit-input"
                    value={editData.title}
                    onChange={(e) => setEditData((d) => ({ ...d, title: e.target.value }))}
                    onBlur={saveEdit}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    autoFocus
                  />
                ) : (
                  <span className="list-row-text">{tc.title}</span>
                )}
                {expanded[tc._id] && (
                  <div className="tc-detail">
                    <p className="tc-description">{tc.description}</p>
                    {tc.preconditions?.length > 0 && (
                      <div className="tc-section">
                        <strong>Preconditions:</strong>
                        <ul>{tc.preconditions.map((p, i) => <li key={i}>{p}</li>)}</ul>
                      </div>
                    )}
                    {tc.steps?.length > 0 && (
                      <div className="tc-section">
                        <strong>Steps:</strong>
                        <ol>
                          {tc.steps.map((s) => (
                            <li key={s.stepNumber}>
                              <span className="tc-action">{s.action}</span>
                              <span className="tc-expected"> → {s.expectedResult}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="list-row-tags">
              <Badge label={tc.type} variant="type" />
              <Badge label={tc.priority} variant="priority" />
              <Badge status={tc.status} />
            </div>

            <div className="list-row-actions">
              <button className="icon-btn" type="button" title="Edit" onClick={() => startEdit(tc)}>
                <RiPencilLine size={14} />
              </button>
              <button
                className="icon-btn icon-btn--danger"
                type="button"
                title="Delete"
                onClick={() => bulkDeleteTestCases([tc._id])}
              >
                <RiDeleteBin6Line size={14} />
              </button>
            </div>
          </div>
        ))}

        {testCases.length === 0 && <div className="panel-empty">No test cases found.</div>}
      </div>

      {selected.length > 0 && (
        <ActionToolbar
          count={selected.length}
          onApprove={handleApproveSelected}
          onDelete={handleDeleteSelected}
        />
      )}
    </div>
  );
}
