import React from 'react';
import {
  RiCheckboxCircleLine,
  RiDeleteBin6Line,
  RiCheckDoubleLine,
  RiDownload2Line,
} from 'react-icons/ri';

export default function ActionToolbar({
  count,
  onApprove,
  onDelete,
  extraActions,
  alwaysVisible = false,
}) {
  if (!alwaysVisible && count === 0) return null;

  return (
    <div className="action-toolbar">
      {count > 0 && (
        <span className="action-toolbar-count">{count} selected</span>
      )}
      <div className="action-toolbar-actions">
        {onApprove && (
          <button className="btn btn--sm btn--success" type="button" onClick={onApprove}>
            <RiCheckboxCircleLine size={15} />
            Approve
          </button>
        )}
        {onDelete && (
          <button className="btn btn--sm btn--danger" type="button" onClick={onDelete}>
            <RiDeleteBin6Line size={15} />
            Delete
          </button>
        )}
        {extraActions}
      </div>
    </div>
  );
}
