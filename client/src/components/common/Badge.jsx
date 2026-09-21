import React from 'react';

const STATUS_MAP = {
  pending: 'badge--warning',
  approved: 'badge--success',
  rejected: 'badge--danger',
  active: 'badge--info',
  archived: 'badge--muted',
};

const TYPE_MAP = {
  positive: 'badge--success',
  negative: 'badge--danger',
  edge: 'badge--warning',
  validation: 'badge--info',
};

const PRIORITY_MAP = {
  high: 'badge--danger',
  medium: 'badge--warning',
  low: 'badge--muted',
};

const TAG_COLORS = {
  Pass: 'badge--success',
  Fail: 'badge--danger',
  Validation: 'badge--info',
  Edge: 'badge--warning',
};

export default function Badge({ status, label, variant = 'status' }) {
  const text = label || status || '';
  let cls = 'badge ';

  if (variant === 'status') {
    cls += STATUS_MAP[status] || 'badge--muted';
  } else if (variant === 'type') {
    cls += TYPE_MAP[label] || 'badge--info';
  } else if (variant === 'priority') {
    cls += PRIORITY_MAP[label] || 'badge--muted';
  } else if (variant === 'tag') {
    cls += TAG_COLORS[label] || 'badge--muted';
  } else {
    cls += 'badge--muted';
  }

  return <span className={cls}>{text}</span>;
}
