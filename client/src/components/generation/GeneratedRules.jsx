import React, { useState } from 'react';
import {
  RiCheckboxLine, RiCheckboxBlankLine, RiPencilLine,
  RiDeleteBin6Line, RiAddLine, RiArrowRightLine,
} from 'react-icons/ri';
import Badge from '../common/Badge.jsx';
import ActionToolbar from '../common/ActionToolbar.jsx';
import { useGeneration } from '../../hooks/useGeneration.js';
import { useAppContext } from '../../context/AppContext.jsx';
import * as api from '../../services/api.js';

export default function GeneratedRules() {
  const { rules, bulkApproveRules, bulkDeleteRules, approveAllRules } = useGeneration();
  const { loading, updateRule, setRules } = useAppContext();
  const [selected, setSelected] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const selectAll = () =>
    setSelected(selected.length === rules.length ? [] : rules.map((r) => r._id));

  const handleApproveSelected = async () => {
    await bulkApproveRules(selected);
    setSelected([]);
  };

  const handleDeleteSelected = async () => {
    await bulkDeleteRules(selected);
    setSelected([]);
  };

  const startEdit = (rule) => { setEditId(rule._id); setEditText(rule.text); };
  const saveEdit = async () => {
    const updated = await api.updateRule(editId, { text: editText });
    updateRule(updated);
    setEditId(null);
  };

  return (
    <div className="generated-panel">
      <div className="panel-header">
        <span className="panel-title">Generated Rules ({rules.length})</span>
        <button
          className="btn btn--primary btn--sm"
          type="button"
          onClick={approveAllRules}
          disabled={loading}
        >
          Approve All &amp; Proceed
        </button>
      </div>

      <div className="panel-list">
        <div className="list-header-row">
          <button className="icon-btn" type="button" onClick={selectAll} title="Select all">
            {selected.length === rules.length && rules.length > 0
              ? <RiCheckboxLine size={16} />
              : <RiCheckboxBlankLine size={16} />}
          </button>
          <span className="list-col-main">Rule</span>
          <span className="list-col-tags">Tags</span>
          <span className="list-col-actions">Actions</span>
        </div>

        {rules.map((rule) => (
          <div key={rule._id} className={`list-row${selected.includes(rule._id) ? ' list-row--selected' : ''}`}>
            <button className="icon-btn" type="button" onClick={() => toggleSelect(rule._id)}>
              {selected.includes(rule._id) ? <RiCheckboxLine size={16} /> : <RiCheckboxBlankLine size={16} />}
            </button>

            {editId === rule._id ? (
              <input
                className="inline-edit-input"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                autoFocus
              />
            ) : (
              <span className="list-row-text">{rule.text}</span>
            )}

            <div className="list-row-tags">
              {(rule.tags || []).map((tag) => <Badge key={tag} label={tag} variant="tag" />)}
              <Badge label={rule.priority} variant="priority" />
            </div>

            <div className="list-row-actions">
              <button className="icon-btn" type="button" title="Add tag">
                <RiAddLine size={14} />
              </button>
              <button className="icon-btn" type="button" title="Edit" onClick={() => startEdit(rule)}>
                <RiPencilLine size={14} />
              </button>
              <button
                className="icon-btn icon-btn--danger"
                type="button"
                title="Delete"
                onClick={async () => {
                  await api.deleteRule(rule._id);
                  const updated = await api.getRules(rule.projectId);
                  setRules(updated);
                }}
              >
                <RiDeleteBin6Line size={14} />
              </button>
              <button className="icon-btn" type="button" title="View details">
                <RiArrowRightLine size={14} />
              </button>
            </div>
          </div>
        ))}

        {rules.length === 0 && <div className="panel-empty">No rules found.</div>}
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
