import { useMemo } from "react";
import { BookOpen, Brain, Layers, Target, Shuffle, Zap, Eye, Flame } from "lucide-react";
import { getDeckSummary } from "../lib/mastery";
import { getStreak } from "../lib/streak";
import type { DeckMeta, TrainingMode, MasteryLevel } from "../types/card";
import { MASTERY_COLORS } from "../types/card";

interface HomeScreenProps {
  decks: DeckMeta[];
  onStart: (deckFile: string, mode: TrainingMode, shuffle?: boolean, weakOnly?: boolean) => void;
}

export function HomeScreen({ decks, onStart }: HomeScreenProps) {
  const streak = useMemo(() => getStreak(), []);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-lg">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-light border border-border-light mb-4 relative">
            <KnightIcon />
          </div>
          <h1 className="text-2xl font-serif font-semibold text-primary tracking-tight">
            Opening Cards
          </h1>
          <p className="text-xs font-sans text-secondary mt-1.5 max-w-xs mx-auto leading-relaxed">
            Allena memoria e riconoscimento delle varianti di apertura
          </p>

          {/* Streak */}
          {streak.current > 0 && (
            <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 bg-accent-light rounded-full">
              <Flame className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-sans font-semibold text-accent">
                {streak.current} {streak.current === 1 ? "giorno" : "giorni"} consecutivi
              </span>
            </div>
          )}
        </div>

        {/* Method pillars */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <Pillar icon={<Brain className="w-4 h-4" />} title="Visualizzazione" desc="Scacchiera cieca, poi verifica" />
          <Pillar icon={<Layers className="w-4 h-4" />} title="Ripetizione" desc="Carte deboli prima, spaced review" />
          <Pillar icon={<Target className="w-4 h-4" />} title="Padronanza" desc="4 livelli per ogni carta" />
        </div>

        {/* Decks */}
        <h2 className="text-[10px] font-sans font-semibold text-tertiary uppercase tracking-widest mb-2 px-1">
          Mazzi disponibili
        </h2>

        <div className="space-y-3">
          {decks.map(deck => (
            <DeckCard key={deck.deck_id} deck={deck} onStart={onStart} />
          ))}
          {decks.length === 0 && (
            <div className="text-center py-10 text-tertiary text-sm font-sans">Caricamento mazzi...</div>
          )}
        </div>

        {/* Keyboard hints */}
        <div className="mt-6 text-center">
          <p className="text-[9px] text-tertiary font-sans">
            <span className="kbd">Space</span> avanza fase &middot;
            <span className="kbd ml-1">&larr;</span><span className="kbd">&rarr;</span> naviga &middot;
            <span className="kbd ml-1">1</span> sapevo &middot;
            <span className="kbd ml-1">2</span> non sapevo
          </p>
        </div>
      </div>
    </div>
  );
}

function DeckCard({ deck, onStart }: {
  deck: DeckMeta;
  onStart: (file: string, mode: TrainingMode, shuffle?: boolean, weakOnly?: boolean) => void;
}) {
  const summary = useMemo(() => getDeckSummary(deck.deck_id, deck.card_count), [deck.deck_id, deck.card_count]);

  const lastReviewedText = summary.lastReviewed
    ? timeAgoShort(summary.lastReviewed)
    : "Mai";

  return (
    <div className="bg-card border border-border-light rounded-xl overflow-hidden shadow-sm">
      {/* Mastery progress bar (top accent) */}
      <div className="h-1.5 flex bg-surface">
        {summary.masteredCount > 0 && <div className="h-full transition-all duration-500" style={{ flex: summary.masteredCount, background: MASTERY_COLORS.mastered }} />}
        {summary.familiarCount > 0 && <div className="h-full transition-all duration-500" style={{ flex: summary.familiarCount, background: MASTERY_COLORS.familiar }} />}
        {summary.learningCount > 0 && <div className="h-full transition-all duration-500" style={{ flex: summary.learningCount, background: MASTERY_COLORS.learning }} />}
        {summary.newCount > 0 && <div className="h-full transition-all duration-500" style={{ flex: summary.newCount, background: "var(--border-light)" }} />}
      </div>

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1">
            <h3 className="text-base font-serif font-semibold text-primary">{deck.deck_name}</h3>
            <p className="text-[11px] text-secondary font-sans mt-0.5 leading-relaxed">{deck.description}</p>
          </div>
          <BookOpen className="w-4 h-4 text-tertiary flex-shrink-0 mt-1 ml-2" />
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-2 mb-3">
          <StatChip value={`${deck.card_count}`} label="carte" />
          <StatChip value={`${summary.masteryPercent}%`} label="padronanza" color="var(--accent)" />
          <StatChip value={`${summary.dueCount}`} label="da ripassare" color={summary.dueCount > 0 ? "var(--review)" : undefined} />
          <StatChip value={lastReviewedText} label="ultimo" />
        </div>

        {/* Mode buttons */}
        <div className="grid grid-cols-2 gap-2 mb-2">
          {/* Primary: Drill */}
          <button
            onClick={() => onStart(deck.file, "drill")}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-accent text-inverse text-sm font-sans font-medium rounded-lg hover:bg-accent-hover transition-colors active:scale-[0.97]"
          >
            <Zap className="w-3.5 h-3.5" />
            Drill
          </button>

          {/* Drill weak only */}
          {summary.dueCount > 0 && (
            <button
              onClick={() => onStart(deck.file, "drill", false, true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-sans font-medium rounded-lg transition-colors active:scale-[0.97]"
              style={{ background: "color-mix(in srgb, var(--review) 10%, var(--bg-card))", color: "var(--review)", border: "1px solid color-mix(in srgb, var(--review) 20%, transparent)" }}
            >
              <Brain className="w-3.5 h-3.5" />
              Carte deboli
            </button>
          )}

          {/* Quiz with shuffle */}
          <button
            onClick={() => onStart(deck.file, "quiz", true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-surface text-secondary text-sm font-sans font-medium rounded-lg border border-border hover:bg-hover transition-colors active:scale-[0.97]"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Quiz
          </button>

          {/* Study */}
          <button
            onClick={() => onStart(deck.file, "study")}
            className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-surface text-secondary text-sm font-sans font-medium rounded-lg border border-border hover:bg-hover transition-colors active:scale-[0.97]"
          >
            <Eye className="w-3.5 h-3.5" />
            Studio
          </button>
        </div>

        {/* Mastery legend */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <MasteryLegend level="mastered" count={summary.masteredCount} />
          <MasteryLegend level="familiar" count={summary.familiarCount} />
          <MasteryLegend level="learning" count={summary.learningCount} />
          <MasteryLegend level="new" count={summary.newCount} />
        </div>
      </div>
    </div>
  );
}

function StatChip({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <div className="text-center flex-1">
      <div className="text-xs font-mono font-semibold" style={{ color: color ?? "var(--text-primary)" }}>{value}</div>
      <div className="text-[8px] font-sans text-tertiary">{label}</div>
    </div>
  );
}

function MasteryLegend({ level, count }: { level: MasteryLevel; count: number }) {
  const labels: Record<MasteryLevel, string> = { new: "Nuove", learning: "App.", familiar: "Fam.", mastered: "Padr." };
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full" style={{ background: MASTERY_COLORS[level] }} />
      <span className="text-[8px] font-sans text-tertiary">{count} {labels[level]}</span>
    </div>
  );
}

function Pillar({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-card border border-border-light rounded-xl p-2.5 text-center">
      <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-accent-light text-accent mb-1.5">{icon}</div>
      <h3 className="text-[11px] font-sans font-semibold text-primary">{title}</h3>
      <p className="text-[9px] text-tertiary font-sans mt-0.5 leading-tight">{desc}</p>
    </div>
  );
}

function KnightIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 28h12M12 28v-4c0-1 .5-2 1.5-3l2-2c1-1 1.5-2 1.5-3.5V12c0-2-1-3.5-3-4.5L12 6.5c-.5-.3-.5-1 0-1.3L14 4c1-.5 2-.5 3 0l3 2c2 1.5 3 3.5 3 6v3.5c0 2-.5 3.5-2 5l-3 3c-1 1-1.5 2-1.5 3v1.5" />
      <circle cx="14" cy="9" r="1" fill="var(--accent)" stroke="none" />
    </svg>
  );
}

function timeAgoShort(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ora";
  if (mins < 60) return `${mins}m fa`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h fa`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Ieri";
  return `${days}g fa`;
}
