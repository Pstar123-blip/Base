const pad = (value: number) => String(value).padStart(2, '0');

// dd/MM/yyyy, HH:mm:ss
export const formatDateTime = (date: Date) =>
  `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ` +
  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

export const formatPercent = (value: number) => `${value}%`;

// HH:mm
export const formatTime = (date: Date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;
