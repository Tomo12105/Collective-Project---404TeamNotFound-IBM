import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarDays, Users, CheckSquare, Trash2 } from 'lucide-react';
import { Meeting } from '@/types';
import { ProcessingStatusBadge } from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';

interface Props { meeting: Meeting; onDelete: (meeting: Meeting) => void; }

export default function MeetingCard({ meeting, onDelete }: Props) {
  const navigate = useNavigate();
  return (
    <article
      onClick={() => navigate(`/meetings/${meeting.id}`)}
      className="group flex flex-col gap-3 p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] cursor-pointer transition-all duration-[180ms] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-text-faint)]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)] line-clamp-2 leading-snug">{meeting.title}</h3>
        <ProcessingStatusBadge status={meeting.processingStatus} />
      </div>
      {meeting.description && (
        <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] line-clamp-2">{meeting.description}</p>
      )}
      <div className="flex items-center gap-4 text-[var(--text-xs)] text-[var(--color-text-muted)]">
        <span className="flex items-center gap-1">
          <CalendarDays size={12} />
          {format(new Date(meeting.dateTime), 'MMM d, yyyy \u00b7 HH:mm')}
        </span>
        {meeting.attendeeCount !== undefined && (
          <span className="flex items-center gap-1"><Users size={12} />{meeting.attendeeCount}</span>
        )}
        {meeting.actionItemCount !== undefined && (
          <span className="flex items-center gap-1"><CheckSquare size={12} />{meeting.actionItemCount}</span>
        )}
      </div>
      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-[180ms] -mt-1">
        <Button variant="ghost" size="sm" leftIcon={<Trash2 size={13} />}
          onClick={(e) => { e.stopPropagation(); onDelete(meeting); }}
          className="text-[var(--color-error)] hover:bg-[var(--color-error-highlight)]">
          Delete
        </Button>
      </div>
    </article>
  );
}
