export const fmt = (s?: number) => {
  if (s === undefined || !isFinite(s)) return '—:—';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};
