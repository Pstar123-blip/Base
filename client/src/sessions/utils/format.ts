const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const formatDateTime = (date: Date) => dateTimeFormat.format(date);

export const formatPercent = (value: number) => `${value}%`;
