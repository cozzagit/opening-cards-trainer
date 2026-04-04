import { useMemo, useState } from "react";
import { Brain, Layers, Target, Shuffle, Zap, Eye, Flame, GitBranch, ChevronDown, RotateCcw } from "lucide-react";
import { getDeckSummary, resetMastery } from "../lib/mastery";
import { getStreak } from "../lib/streak";
import type { DeckMeta, TrainingMode, MasteryLevel } from "../types/card";
import { MASTERY_COLORS } from "../types/card";

interface HomeScreenProps {
  decks: DeckMeta[];
  onStart: (deckFile: string, mode: TrainingMode, shuffle?: boolean, weakOnly?: boolean) => void;
  onViewTree?: (deckFile: string) => void;
}

// Categorize decks
const D4_DECKS = ["london_v1", "queens_gambit_v1", "kings_indian_v1"];

function categorizeDeck(id: string): "e4" | "d4" {
  return D4_DECKS.includes(id) ? "d4" : "e4";
}

export function HomeScreen({ decks, onStart, onViewTree }: HomeScreenProps) {
  const streak = useMemo(() => getStreak(), []);
  const [filter, setFilter] = useState<"all" | "e4" | "d4">("all");

  const filteredDecks = useMemo(() => {
    if (filter === "all") return decks;
    return decks.filter(d => categorizeDeck(d.deck_id) === filter);
  }, [decks, filter]);

  // Overall stats
  const totalStats = useMemo(() => {
    let totalCards = 0, mastered = 0, familiar = 0;
    for (const d of decks) {
      const s = getDeckSummary(d.deck_id, d.card_count);
      totalCards += s.totalCards;
      mastered += s.masteredCount;
      familiar += s.familiarCount;
    }
    const pct = totalCards > 0 ? Math.round(((mastered + familiar) / totalCards) * 100) : 0;
    return { totalCards, mastered, familiar, pct };
  }, [decks]);

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6">
      <div className="w-full max-w-lg">
        {/* Hero */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-light border border-border-light mb-3">
            <KnightIcon />
          </div>
          <h1 className="text-2xl font-serif font-semibold text-primary tracking-tight">
            Opening Cards
          </h1>
          <p className="text-xs font-sans text-secondary mt-1 max-w-xs mx-auto">
            Allena memoria e riconoscimento delle varianti di apertura
          </p>
        </div>

        {/* Global stats bar */}
        <div className="bg-card border border-border-light rounded-xl p-3 mb-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {streak.current > 0 && (
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-accent" />
                  <span className="text-sm font-mono font-semibold text-accent">{streak.current}</span>
                  <span className="text-[9px] font-sans text-tertiary">giorni</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span className="text-sm font-mono font-semibold text-primary">{totalStats.totalCards}</span>
                <span className="text-[9px] font-sans text-tertiary">carte</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-mono font-semibold" style={{ color: "var(--correct)" }}>{totalStats.mastered}</span>
                <span className="text-[9px] font-sans text-tertiary">padr.</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-mono font-bold text-accent">{totalStats.pct}%</span>
            </div>
          </div>
          {/* Overall progress bar */}
          <div className="h-1 rounded-full bg-surface overflow-hidden mt-2 flex">
            {totalStats.mastered > 0 && <div className="h-full" style={{ flex: totalStats.mastered, background: MASTERY_COLORS.mastered }} />}
            {totalStats.familiar > 0 && <div className="h-full" style={{ flex: totalStats.familiar, background: MASTERY_COLORS.familiar }} />}
            <div className="h-full flex-1" style={{ background: "var(--border-light)" }} />
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-1 mb-3 bg-surface rounded-lg p-0.5">
          {(["all", "e4", "d4"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 text-xs font-sans font-medium rounded-md transition-all ${
                filter === f
                  ? "bg-card text-primary shadow-sm"
                  : "text-tertiary hover:text-secondary"
              }`}
            >
              {f === "all" ? `Tutti (${decks.length})` : f === "e4" ? `1.e4 (${decks.filter(d => categorizeDeck(d.deck_id) === "e4").length})` : `1.d4 (${decks.filter(d => categorizeDeck(d.deck_id) === "d4").length})`}
            </button>
          ))}
        </div>

        {/* Decks */}
        <div className="space-y-2.5">
          {filteredDecks.map(deck => (
            <DeckCard key={deck.deck_id} deck={deck} onStart={onStart} onViewTree={onViewTree} />
          ))}
          {filteredDecks.length === 0 && (
            <div className="text-center py-10 text-tertiary text-sm font-sans">
              {decks.length === 0 ? "Caricamento mazzi..." : "Nessun mazzo in questa categoria"}
            </div>
          )}
        </div>

        {/* Method pillars */}
        <div className="grid grid-cols-3 gap-2 mt-6 mb-4">
          <Pillar icon={<Brain className="w-3.5 h-3.5" />} title="Visualizzazione" desc="Scacchiera cieca" />
          <Pillar icon={<Layers className="w-3.5 h-3.5" />} title="Ripetizione" desc="Spaced review" />
          <Pillar icon={<Target className="w-3.5 h-3.5" />} title="Padronanza" desc="4 livelli carta" />
        </div>

        {/* Keyboard hints — desktop only */}
        <div className="text-center hidden sm:block">
          <p className="text-[9px] text-tertiary font-sans">
            <span className="kbd">Space</span> avanza &middot;
            <span className="kbd ml-1">&larr;</span><span className="kbd">&rarr;</span> naviga &middot;
            <span className="kbd ml-1">1</span> sapevo &middot;
            <span className="kbd ml-1">2</span> non sapevo
          </p>
        </div>
      </div>
    </div>
  );
}

function DeckCard({ deck, onStart, onViewTree }: {
  deck: DeckMeta;
  onStart: (file: string, mode: TrainingMode, shuffle?: boolean, weakOnly?: boolean) => void;
  onViewTree?: (file: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const summary = useMemo(() => getDeckSummary(deck.deck_id, deck.card_count), [deck.deck_id, deck.card_count, resetKey]);

  const lastReviewedText = summary.lastReviewed ? timeAgoShort(summary.lastReviewed) : null;
  const category = categorizeDeck(deck.deck_id);

  return (
    <div className="bg-card border border-border-light rounded-xl overflow-hidden shadow-sm">
      {/* Mastery bar */}
      <div className="h-1 flex bg-surface">
        {summary.masteredCount > 0 && <div className="h-full" style={{ flex: summary.masteredCount, background: MASTERY_COLORS.mastered }} />}
        {summary.familiarCount > 0 && <div className="h-full" style={{ flex: summary.familiarCount, background: MASTERY_COLORS.familiar }} />}
        {summary.learningCount > 0 && <div className="h-full" style={{ flex: summary.learningCount, background: MASTERY_COLORS.learning }} />}
        {summary.newCount > 0 && <div className="h-full" style={{ flex: summary.newCount, background: "var(--border-light)" }} />}
      </div>

      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left active:bg-surface/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface text-tertiary">{category}</span>
            <h3 className="text-sm font-serif font-semibold text-primary truncate">{deck.deck_name}</h3>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-mono text-accent font-semibold">{summary.masteryPercent}%</span>
            <span className="text-[10px] text-tertiary">{deck.card_count} carte</span>
            {summary.dueCount > 0 && (
              <span className="text-[10px] font-semibold" style={{ color: "var(--review)" }}>{summary.dueCount} da ripassare</span>
            )}
            {lastReviewedText && (
              <span className="text-[10px] text-tertiary">&middot; {lastReviewedText}</span>
            )}
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-tertiary transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 pb-3 border-t border-border-light pt-3 animate-[fadeIn_0.15s_ease-out]">
          <p className="text-[11px] text-secondary font-sans mb-3 leading-relaxed">{deck.description}</p>

          {/* Mode buttons */}
          <div className="grid grid-cols-2 gap-1.5 mb-2">
            <button
              onClick={() => onStart(deck.file, "drill")}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-accent text-inverse text-xs font-sans font-medium rounded-lg active:scale-[0.97]"
            >
              <Zap className="w-3.5 h-3.5" /> Drill
            </button>
            {summary.dueCount > 0 && (
              <button
                onClick={() => onStart(deck.file, "drill", false, true)}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-sans font-medium rounded-lg active:scale-[0.97]"
                style={{ background: "color-mix(in srgb, var(--review) 10%, var(--bg-card))", color: "var(--review)", border: "1px solid color-mix(in srgb, var(--review) 20%, transparent)" }}
              >
                <Brain className="w-3.5 h-3.5" /> Deboli
              </button>
            )}
            <button
              onClick={() => onStart(deck.file, "quiz", true)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-surface text-secondary text-xs font-sans font-medium rounded-lg border border-border active:scale-[0.97]"
            >
              <Shuffle className="w-3.5 h-3.5" /> Quiz
            </button>
            <button
              onClick={() => onStart(deck.file, "study")}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-surface text-secondary text-xs font-sans font-medium rounded-lg border border-border active:scale-[0.97]"
            >
              <Eye className="w-3.5 h-3.5" /> Studio
            </button>
          </div>

          {/* Secondary actions */}
          <div className="flex items-center justify-between">
            {onViewTree && (
              <button onClick={() => onViewTree(deck.file)} className="flex items-center gap-1 py-1 text-[10px] font-sans text-tertiary hover:text-secondary">
                <GitBranch className="w-3 h-3" /> Mappa varianti
              </button>
            )}
            <button
              onClick={() => { if (confirm("Resettare i progressi di questo mazzo?")) { resetMastery(deck.deck_id); setResetKey(k => k + 1); }}}
              className="flex items-center gap-1 py-1 text-[10px] font-sans text-tertiary hover:text-incorrect"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Mastery legend */}
          <div className="flex items-center justify-center gap-3 pt-1.5 border-t border-border-light mt-2">
            <MLabel level="mastered" count={summary.masteredCount} />
            <MLabel level="familiar" count={summary.familiarCount} />
            <MLabel level="learning" count={summary.learningCount} />
            <MLabel level="new" count={summary.newCount} />
          </div>
        </div>
      )}
    </div>
  );
}

function MLabel({ level, count }: { level: MasteryLevel; count: number }) {
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
    <div className="bg-card border border-border-light rounded-lg p-2 text-center">
      <div className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-accent-light text-accent mb-1">{icon}</div>
      <h3 className="text-[10px] font-sans font-semibold text-primary">{title}</h3>
      <p className="text-[8px] text-tertiary font-sans mt-0.5">{desc}</p>
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
