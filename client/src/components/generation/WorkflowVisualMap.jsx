import React, { useState } from 'react';
import Modal from '../common/Modal.jsx';
import { RiZoomInLine, RiZoomOutLine } from 'react-icons/ri';

const NODE_COLORS = {
  start: '#e91e8c',
  end: '#e91e8c',
  process: '#3b82d4',
  decision: '#f59e0b',
  default: '#6b7280',
};

export default function WorkflowVisualMap({ workflow, onClose, onApprove }) {
  const [zoom, setZoom] = useState(0.75);
  const nodes = workflow?.nodes || [];

  return (
    <Modal onClose={onClose} title={`Workflow Map: ${workflow?.name}`} size="lg">
      <div className="visual-map-toolbar">
        <button className="icon-btn" type="button" onClick={() => setZoom((z) => Math.min(z + 0.1, 2))}>
          <RiZoomInLine size={16} />
        </button>
        <span className="visual-map-zoom">{Math.round(zoom * 100)}%</span>
        <button className="icon-btn" type="button" onClick={() => setZoom((z) => Math.max(z - 0.1, 0.25))}>
          <RiZoomOutLine size={16} />
        </button>
      </div>

      <div className="visual-map-canvas-wrapper">
        <div
          className="visual-map-canvas"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
        >
          {nodes.length === 0 ? (
            <div className="visual-map-empty">
              <p>No visual map data available for this workflow.</p>
            </div>
          ) : (
            <svg
              width={800}
              height={Math.max(400, nodes.length * 80 + 100)}
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Render connections */}
              {nodes.map((node) =>
                (node.connections || []).map((targetId) => {
                  const target = nodes.find((n) => n.id === targetId);
                  if (!target) return null;
                  return (
                    <line
                      key={`${node.id}-${targetId}`}
                      x1={node.x + 60}
                      y1={node.y + 20}
                      x2={target.x + 60}
                      y2={target.y + 20}
                      stroke="#d1d5db"
                      strokeWidth={2}
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })
              )}
              {/* Arrow marker */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#d1d5db" />
                </marker>
              </defs>
              {/* Render nodes */}
              {nodes.map((node) => (
                <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
                  <rect
                    width={120}
                    height={40}
                    rx={node.type === 'decision' ? 0 : 6}
                    fill={NODE_COLORS[node.type] || NODE_COLORS.default}
                    opacity={0.9}
                  />
                  <text
                    x={60}
                    y={24}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={11}
                    fontFamily="Inter, sans-serif"
                  >
                    {node.label?.length > 18 ? node.label.slice(0, 17) + '…' : node.label}
                  </text>
                </g>
              ))}
            </svg>
          )}
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn btn--ghost" type="button" onClick={onClose}>Cancel</button>
        <button className="btn btn--primary" type="button" onClick={onApprove}>
          Approve &amp; Proceed
        </button>
      </div>
    </Modal>
  );
}
