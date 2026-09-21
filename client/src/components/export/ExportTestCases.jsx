import React, { useState } from 'react';
import {
  RiCheckboxLine, RiCheckboxBlankLine,
  RiDownload2Line, RiExternalLinkLine,
} from 'react-icons/ri';
import Badge from '../common/Badge.jsx';
import ActionToolbar from '../common/ActionToolbar.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import * as api from '../../services/api.js';

const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export default function ExportTestCases() {
  const { testCases, project } = useAppContext();
  const [selected, setSelected] = useState([]);
  const [exporting, setExporting] = useState(false);

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const selectAll = () =>
    setSelected(selected.length === testCases.length ? [] : testCases.map((tc) => tc._id));

  const handleExportJSON = async () => {
    if (!project) return;
    setExporting(true);
    try {
      const blob = await api.exportTestCasesJSON(project._id);
      downloadBlob(blob, `${project.name}_testcases.json`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportCSV = async () => {
    if (!project) return;
    setExporting(true);
    try {
      const blob = await api.exportTestCasesCSV(project._id);
      downloadBlob(blob, `${project.name}_testcases.csv`);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="generated-panel">
      <div className="panel-header">
        <span className="panel-title">Export Test Cases ({testCases.length})</span>
      </div>

      <div className="panel-list">
        <div className="list-header-row">
          <button className="icon-btn" type="button" onClick={selectAll} title="Select all">
            {selected.length === testCases.length && testCases.length > 0
              ? <RiCheckboxLine size={16} />
              : <RiCheckboxBlankLine size={16} />}
          </button>
          <span className="list-col-main">Test Case</span>
          <span className="list-col-tags">Status</span>
        </div>

        {testCases.map((tc) => (
          <div key={tc._id} className={`list-row${selected.includes(tc._id) ? ' list-row--selected' : ''}`}>
            <button className="icon-btn" type="button" onClick={() => toggleSelect(tc._id)}>
              {selected.includes(tc._id) ? <RiCheckboxLine size={16} /> : <RiCheckboxBlankLine size={16} />}
            </button>
            <div className="list-row-content">
              <span className="list-row-text">{tc.title}</span>
              <span className="list-row-sub">{tc.description}</span>
            </div>
            <div className="list-row-tags">
              <Badge label={tc.type} variant="type" />
              <Badge status={tc.status} />
            </div>
          </div>
        ))}

        {testCases.length === 0 && <div className="panel-empty">No test cases to export.</div>}
      </div>

      <ActionToolbar
        count={selected.length}
        onApprove={null}
        onDelete={null}
        extraActions={
          <>
            <button
              className="btn btn--outline btn--sm"
              type="button"
              onClick={handleExportJSON}
              disabled={exporting}
            >
              <RiDownload2Line size={15} />
              Export JSON
            </button>
            <button
              className="btn btn--outline btn--sm"
              type="button"
              onClick={handleExportCSV}
              disabled={exporting}
            >
              <RiDownload2Line size={15} />
              Export CSV
            </button>
            <button className="btn btn--primary btn--sm" type="button" disabled>
              <RiExternalLinkLine size={15} />
              Export to Jira
            </button>
          </>
        }
        alwaysVisible
      />
    </div>
  );
}
