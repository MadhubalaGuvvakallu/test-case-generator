import React, { useState, useRef } from 'react';
import { RiUploadCloud2Line, RiFileLine, RiCloseLine, RiAddLine } from 'react-icons/ri';
import { useProject } from '../../hooks/useProject.js';
import { useAppContext } from '../../context/AppContext.jsx';

const SOURCE_TILES = [
  { id: 'local', label: 'LOCAL FILES', icon: '📁' },
];

export default function AssociateContext() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [description, setDescription] = useState('');
  const [activeSource, setActiveSource] = useState('local');
  const fileInputRef = useRef(null);
  const { uploadContext } = useProject();
  const { project, loading } = useAppContext();

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleContinue = async () => {
    if (!project || loading) return;
    await uploadContext(project._id, selectedFiles, description);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="associate-context">
      {/* Instruction */}
      <div className="associate-section">
        <div className="associate-section-title">ADD REQUIREMENTS SOURCE</div>
        <p className="associate-section-hint">
          Upload your requirements document or paste a description below.
          Supported formats: TXT, PDF.
        </p>
      </div>

      {/* Source Tiles */}
      <div className="associate-tiles">
        {SOURCE_TILES.map(({ id, label, icon }) => (
          <button
            key={id}
            className={`source-tile${activeSource === id ? ' source-tile--active' : ''}`}
            type="button"
            onClick={() => {
              setActiveSource(id);
              if (id === 'local') fileInputRef.current?.click();
            }}
          >
            <span className="source-tile-icon">{icon}</span>
            <span className="source-tile-label">{label}</span>
          </button>
        ))}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Description */}
      <div className="associate-section">
        <textarea
          className="associate-description"
          placeholder="Describe the context for your test cases..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Selected Content */}
      {selectedFiles.length > 0 && (
        <div className="associate-section">
          <div className="associate-section-title">SELECTED CONTENT</div>
          <div className="selected-files">
            {selectedFiles.map((file, i) => (
              <div key={i} className="selected-file">
                <RiFileLine size={16} />
                <span className="selected-file-name">{file.name}</span>
                <span className="selected-file-size">{formatSize(file.size)}</span>
                <button
                  className="selected-file-remove"
                  type="button"
                  onClick={() => removeFile(i)}
                >
                  <RiCloseLine size={14} />
                </button>
              </div>
            ))}
          </div>
          <button
            className="btn btn--ghost"
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            <RiAddLine size={16} /> Add Additional Context
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="associate-actions">
        <button className="btn btn--ghost" type="button">
          Cancel
        </button>
        <button
          className="btn btn--primary"
          type="button"
          onClick={handleContinue}
          disabled={loading || (!selectedFiles.length && !description.trim())}
        >
          {loading ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
