export function formatDate(value) {
  if (!value) {
    return 'No date';
  }
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

export function isOverdue(value, status) {
  if (!value || status === 'DONE') {
    return false;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${value}T00:00:00`) < today;
}
