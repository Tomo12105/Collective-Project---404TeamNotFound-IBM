import { format, formatDistanceToNow, isPast } from 'date-fns';

export const formatDateTime = (iso: string) => format(new Date(iso), 'MMM d, yyyy \u00b7 HH:mm');
export const formatDateShort = (iso: string) => format(new Date(iso), 'MMM d, yyyy');
export const formatRelative  = (iso: string) => formatDistanceToNow(new Date(iso), { addSuffix: true });
export const isOverdue = (deadline: string | undefined, status: string) => {
  if (!deadline || status === 'DONE') return false;
  return isPast(new Date(deadline));
};
