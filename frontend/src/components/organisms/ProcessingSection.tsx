import { useEffect, useState } from 'react';
import { Zap, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AIResult } from '@/types';
import { aiService } from '@/services/ai';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import toast from 'react-hot-toast';

interface Props {
  meetingId:     number;
  hasTranscript: boolean;
}

export default function ProcessingSection({ meetingId, hasTranscript }: Props) {
  const [result,     setResult]     = useState<AIResult | null>(null);
  const [status,     setStatus]     = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [errorMsg,   setErrorMsg]   = useState('');

  useEffect(() => {
    aiService.getResults(meetingId)
      .then((r) => { setResult(r); setStatus('done'); })
      .catch(() => setStatus('idle'));
  }, [meetingId]);

  const handleProcess = async () => {
    setStatus('processing');
    setErrorMsg('');
    try {
      const r = await aiService.process(meetingId);
      setResult(r);
      setStatus('done');
      toast.success('Processing complete!');
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus('error');
    }
  };

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">AI Results</h3>
        {status === 'done' && (
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw size={13} />} onClick={handleProcess}>
            Reprocess
          </Button>
        )}
      </div>

      {/* Idle / no transcript */}
      {status === 'idle' && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <Zap size={28} className="text-[var(--color-text-faint)]" />
          {!hasTranscript ? (
            <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
              Add a transcript first before processing.
            </p>
          ) : (
            <>
              <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">
                Ready to process the transcript with AI.
              </p>
              <Button size="sm" leftIcon={<Zap size={13} />} onClick={handleProcess}>
                Process Transcript
              </Button>
            </>
          )}
        </div>
      )}

      {/* Processing spinner */}
      {status === 'processing' && (
        <div className="flex flex-col items-center gap-3 py-10">
          <Spinner size={28} />
          <p className="text-[var(--text-sm)] text-[var(--color-text-muted)]">Analyzing transcript…</p>
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <AlertCircle size={28} className="text-[var(--color-error)]" />
          <p className="text-[var(--text-sm)] text-[var(--color-error)]">{errorMsg}</p>
          <Button size="sm" variant="secondary" onClick={handleProcess}>Retry</Button>
        </div>
      )}

      {/* Results */}
      {status === 'done' && result && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[var(--color-success)]">
            <CheckCircle2 size={15} />
            <span className="text-[var(--text-xs)] font-medium">Processing complete</span>
          </div>

          {result.summary && (
            <ResultBlock title="Summary" content={result.summary} />
          )}
          {result.detailedNotes && (
            <ResultBlock title="Detailed Notes" content={result.detailedNotes} />
          )}
          {result.decisions && (
            <ResultBlock title="Decisions Made" content={result.decisions} />
          )}
          {result.followUpNotes && (
            <ResultBlock title="Follow-up Notes" content={result.followUpNotes} />
          )}
        </div>
      )}
    </div>
  );
}

function ResultBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <div className="px-4 py-2 bg-[var(--color-surface-offset)] border-b border-[var(--color-border)]">
        <p className="text-[var(--text-xs)] font-semibold uppercase tracking-wide text-[var(--color-text-faint)]">{title}</p>
      </div>
      <div className="px-4 py-3">
        <p className="text-[var(--text-sm)] text-[var(--color-text)] whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    </div>
  );
}