import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CalendarDays } from 'lucide-react';
import { useMeetings } from '@/hooks/useMeetings';
import { useAppStore } from '@/store/useAppStore';
import { MeetingListItem } from '@/types';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import Select from '@/components/atoms/Select';
import Pagination from '@/components/molecules/Pagination';
import ConfirmDialog from '@/components/molecules/ConfirmDialog';
import { MeetingCardSkeleton } from '@/components/atoms/Skeleton';
import CreateMeetingModal from '@/components/organisms/CreateMeetingModal';
import { authService } from '@/services/auth';

const PAGE_SIZE = 8;

type SortKey = 'title-asc' | 'title-desc' | 'id-desc' | 'id-asc';

export default function MeetingsPage() {
  const navigate = useNavigate();
  const { fetchMeetings, deleteMeeting } = useMeetings();
  const meetings = useAppStore((s) => s.meetings);
  const loading = useAppStore((s) => s.loading);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('id-desc');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: '' });

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  useEffect(() => {
    setPage(1);
  }, [search, sort]);

  const filtered = useMemo(() => {
    let list = [...meetings];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.title.toLowerCase().includes(q));
    }

    switch (sort) {
      case 'title-asc':
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'id-asc':
        list.sort((a, b) => a.id - b.id);
        break;
      case 'id-desc':
        list.sort((a, b) => b.id - a.id);
        break;
    }

    return list;
  }, [meetings, search, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await deleteMeeting(deleteId);
      setDeleteId(null);
    } catch (error: any) {
      const message = String(error?.message || '');

      if (message.includes('403')) {
        setErrorModal({
          open: true,
          message: "You don't have permission to delete this meeting. Only the creator can delete it.",
        });
      } else {
        setErrorModal({
          open: true,
          message: 'Failed to delete meeting. Please try again.',
        });
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="px-4 md:px-6 py-6"
      style={{ maxWidth: 'var(--content-wide)', margin: '0 auto' }}
    >
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1
            className="text-[var(--text-xl)] font-bold text-[var(--color-text)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Meetings
          </h1>
          {!loading && (
            <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] mt-0.5">
              {filtered.length} meeting{filtered.length !== 1 ? 's' : ''}
              {search ? ' matching search' : ' total'}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => authService.logout()}>
            Sign out
          </Button>
          <Button leftIcon={<Plus size={15} />} onClick={() => setCreateOpen(true)}>
            New Meeting
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search meetings by title…"
          className="flex-1"
        />
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          options={[
            { value: 'id-desc', label: 'Newest first' },
            { value: 'id-asc', label: 'Oldest first' },
            { value: 'title-asc', label: 'Title A → Z' },
            { value: 'title-desc', label: 'Title Z → A' },
          ]}
          className="text-[var(--text-xs)] py-1.5 w-full sm:w-44"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MeetingCardSkeleton key={i} />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <CalendarDays size={36} className="text-[var(--color-text-faint)]" />
          <div>
            <p className="text-[var(--text-sm)] font-medium text-[var(--color-text)]">
              {search ? 'No meetings match your search' : 'No meetings yet'}
            </p>
            <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] mt-1">
              {search ? 'Try a different keyword.' : 'Create your first meeting to get started.'}
            </p>
          </div>
          {!search && (
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setCreateOpen(true)}>
              Create Meeting
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map((m) => (
              <MeetingListCard
                key={m.id}
                meeting={m}
                onClick={() => navigate(`/meetings/${m.id}`)}
                onDelete={() => setDeleteId(m.id)}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </>
      )}

      <CreateMeetingModal open={createOpen} onClose={() => setCreateOpen(false)} />

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Meeting"
        message="This will permanently delete the meeting and all its tasks and attendees. This action cannot be undone."
        confirmLabel="Delete Meeting"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      {errorModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-md rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-6">
            <h2 className="text-[var(--text-lg)] font-semibold text-[var(--color-error)]">
              Permission denied
            </h2>
            <p className="mt-2 text-[var(--text-sm)] text-[var(--color-text-muted)]">
              {errorModal.message}
            </p>
            <div className="mt-5 flex justify-end">
              <Button onClick={() => setErrorModal({ open: false, message: '' })}>
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MeetingListCard({
  meeting,
  onClick,
  onDelete,
}: {
  meeting: MeetingListItem;
  onClick: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="group relative p-4 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:shadow-[var(--shadow-md)] hover:border-[var(--color-primary)] transition-all duration-[180ms] cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)] leading-snug line-clamp-2">
          {meeting.title}
        </h3>
      </div>

      <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] mt-2">
        by {meeting.uploadedBy.username}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-[var(--color-error-highlight)] hover:text-[var(--color-error)] transition-all duration-[180ms]"
        aria-label="Delete meeting"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14H6L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4h6v2" />
        </svg>
      </button>
    </div>
  );
}