import { useRef, useState } from 'react';
import { FileText, Pencil, Save, X, Upload } from 'lucide-react';
import { meetingsService } from '@/services/meetings';
import Button from '@/components/atoms/Button';
import toast from 'react-hot-toast';

interface Props {
  meetingId:  number;
  transcript: string;
  onUpdate:   (t: string) => void;
}

export default function TranscriptSection({ meetingId, transcript, onUpdate }: Props) {
  const [editing,   setEditing]   = useState(false);
  const [draft,     setDraft]     = useState(transcript);
  const [saving,    setSaving]    = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!draft.trim()) { toast.error('Transcript cannot be empty'); return; }
    setSaving(true);
    try {
      const updated = await meetingsService.update(meetingId, { transcript: draft });
      onUpdate(updated.transcript);
      setEditing(false);
      toast.success('Transcript saved');
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setSaving(false); }
  };

  const handleCancel = () => {
    setDraft(transcript);
    setEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith('.txt') && !file.name.endsWith('.md') && file.type !== 'text/plain') {
      toast.error('Only .txt or .md files are supported');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setDraft(text);
      setEditing(true);
      toast.success(`File "${file.name}" loaded — review and save`);
    };
    reader.readAsText(file);
    // reset input so same file can be re-uploaded
    e.target.value = '';
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">Transcript</h3>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="ghost" size="sm" leftIcon={<X size={13} />} onClick={handleCancel}>Cancel</Button>
              <Button size="sm" leftIcon={<Save size={13} />} loading={saving} onClick={handleSave}>Save</Button>
            </>
          ) : (
            <>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,text/plain"
                className="sr-only"
                onChange={handleFileUpload}
                aria-label="Upload transcript file"
              />
              <Button variant="ghost" size="sm" leftIcon={<Upload size={13} />}
                onClick={() => fileInputRef.current?.click()}>
                Upload File
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Pencil size={13} />}
                onClick={() => { setDraft(transcript); setEditing(true); }}>
                Edit
              </Button>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <>
          <p className="text-[var(--text-xs)] text-[var(--color-text-muted)] mb-2">
            Edit the transcript below or upload a <code>.txt</code> file using the button above.
          </p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={16}
            className="w-full text-[var(--text-sm)] text-[var(--color-text)] bg-[var(--color-surface-offset)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-3 resize-y leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-[180ms]"
            placeholder="Paste or type the meeting transcript here…"
          />
          <p className="text-[var(--text-xs)] text-[var(--color-text-faint)] mt-1 text-right">
            {draft.length} characters
          </p>
        </>
      ) : transcript ? (
        <pre className="text-[var(--text-sm)] text-[var(--color-text)] whitespace-pre-wrap leading-relaxed font-[inherit] max-h-[480px] overflow-y-auto">
          {transcript}
        </pre>
      ) : (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <FileText size={28} className="text-[var(--color-text-faint)]" />
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">No transcript yet.</p>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" leftIcon={<Upload size={13} />}
              onClick={() => fileInputRef.current?.click()}>
              Upload .txt File
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Pencil size={13} />}
              onClick={() => setEditing(true)}>
              Type Manually
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,text/plain"
            className="sr-only"
            onChange={handleFileUpload}
            aria-label="Upload transcript file"
          />
        </div>
      )}
    </div>
  );
}