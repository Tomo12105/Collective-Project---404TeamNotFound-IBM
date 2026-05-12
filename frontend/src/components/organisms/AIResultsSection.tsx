import { AIResults } from '@/types';
import { FileText, ListChecks, MessageSquare, ChevronRight } from 'lucide-react';

interface Props { results: AIResults; }

function ResultCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-divider)] bg-[var(--color-surface-offset)]">
        <span className="text-[var(--color-primary)]">{icon}</span>
        <h4 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">{title}</h4>
      </div>
      <div className="px-4 py-3">{children}</div>
    </div>
  );
}

import React from 'react';

export default function AIResultsSection({ results }: Props) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <FileText size={15} className="text-[var(--color-text-muted)]" />
        <h3 className="text-[var(--text-sm)] font-semibold text-[var(--color-text)]">AI Results</h3>
      </div>

      {/* Summary */}
      <ResultCard icon={<FileText size={14} />} title="Summary">
        <p className="text-[var(--text-sm)] text-[var(--color-text)] leading-relaxed">{results.summary}</p>
      </ResultCard>

      {/* Detailed notes */}
      {results.detailedNotes && (
        <ResultCard icon={<MessageSquare size={14} />} title="Detailed Notes">
          <p className="text-[var(--text-sm)] text-[var(--color-text)] leading-relaxed whitespace-pre-line">{results.detailedNotes}</p>
        </ResultCard>
      )}

      {/* Decisions */}
      {results.decisionsMade && results.decisionsMade.length > 0 && (
        <ResultCard icon={<ListChecks size={14} />} title="Decisions Made">
          <ul className="flex flex-col gap-1.5">
            {results.decisionsMade.map((d, i) => (
              <li key={i} className="flex items-start gap-2 text-[var(--text-sm)] text-[var(--color-text)]">
                <ChevronRight size={14} className="mt-0.5 shrink-0 text-[var(--color-primary)]" />
                {d}
              </li>
            ))}
          </ul>
        </ResultCard>
      )}

      {/* Follow-up notes */}
      {results.followUpNotes && (
        <ResultCard icon={<MessageSquare size={14} />} title="Follow-up Notes">
          <p className="text-[var(--text-sm)] text-[var(--color-text)] leading-relaxed whitespace-pre-line">{results.followUpNotes}</p>
        </ResultCard>
      )}
    </section>
  );
}
