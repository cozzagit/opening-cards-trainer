import { useMemo } from "react";
import type { Card, MasteryLevel, CardMastery } from "../types/card";
import { MASTERY_COLORS } from "../types/card";

interface TreeNode {
  move: string;
  fullPath: string;
  children: TreeNode[];
  cards: Card[];
  depth: number;
}

interface VariationTreeProps {
  cards: Card[];
  mastery: Map<string, CardMastery>;
  onSelectCard?: (card: Card) => void;
}

// Build a tree from card move sequences
function buildTree(cards: Card[]): TreeNode {
  const root: TreeNode = { move: "Start", fullPath: "", children: [], cards: [], depth: 0 };

  for (const card of cards) {
    const moves = card.front.moves_san
      .map(m => m.replace(/^\d+\.{1,3}/, ""))
      .filter(Boolean);

    let node = root;
    let path = "";

    for (let i = 0; i < Math.min(moves.length, 6); i++) { // Max 6 levels deep for readability
      path += (path ? " " : "") + moves[i];
      let child = node.children.find(c => c.move === moves[i]);
      if (!child) {
        child = { move: moves[i], fullPath: path, children: [], cards: [], depth: i + 1 };
        node.children.push(child);
      }
      node = child;
    }

    node.cards.push(card);
  }

  return root;
}

// Get the dominant mastery level for a set of cards
function getDominantMastery(cards: Card[], mastery: Map<string, CardMastery>): MasteryLevel {
  if (cards.length === 0) return "new";
  const levels = cards.map(c => mastery.get(c.id)?.level ?? "new");
  const priority: MasteryLevel[] = ["new", "learning", "familiar", "mastered"];
  // Return the lowest level (weakest link)
  for (const p of priority) {
    if (levels.includes(p)) return p;
  }
  return "new";
}

// Flatten tree to positionable nodes
interface LayoutNode {
  node: TreeNode;
  x: number;
  y: number;
  parentX?: number;
  parentY?: number;
}

function layoutTree(root: TreeNode): { nodes: LayoutNode[]; width: number; height: number } {
  const nodes: LayoutNode[] = [];
  const levelHeight = 44;
  const nodeWidth = 56;
  let maxX = 0;

  function traverse(node: TreeNode, x: number, depth: number, parentX?: number, parentY?: number): number {
    const y = depth * levelHeight + 20;

    if (node.children.length === 0) {
      nodes.push({ node, x, y, parentX, parentY });
      maxX = Math.max(maxX, x);
      return x + nodeWidth;
    }

    let nextX = x;
    const childPositions: number[] = [];

    for (const child of node.children) {
      const childX = nextX;
      childPositions.push(childX + nodeWidth / 2);
      nextX = traverse(child, nextX, depth + 1, 0, 0); // parent set after
    }

    // Center this node above its children
    const centerX = (childPositions[0] + childPositions[childPositions.length - 1]) / 2 - nodeWidth / 2;
    nodes.push({ node, x: centerX, y, parentX, parentY });

    // Now fix children's parent pointers
    for (const n of nodes) {
      if (n.parentX === 0 && n.parentY === 0 && n.node.depth === depth + 1) {
        const parent = nodes.find(p => p.node === node);
        if (parent) {
          n.parentX = parent.x + nodeWidth / 2;
          n.parentY = parent.y + 16;
        }
      }
    }

    return nextX;
  }

  // Skip root, start from children
  let nextX = 10;
  for (const child of root.children) {
    nextX = traverse(child, nextX, 0);
  }

  return { nodes: nodes.filter(n => n.node !== root), width: maxX + nodeWidth + 20, height: (6 * levelHeight) + 40 };
}

export function VariationTree({ cards, mastery, onSelectCard }: VariationTreeProps) {
  const tree = useMemo(() => buildTree(cards), [cards]);
  const { nodes, width, height } = useMemo(() => layoutTree(tree), [tree]);

  if (nodes.length === 0) return null;

  const nodeWidth = 50;
  const nodeHeight = 28;

  return (
    <div className="overflow-x-auto pb-2">
      <svg
        viewBox={`0 0 ${Math.max(width, 300)} ${height}`}
        width={Math.max(width, 300)}
        height={height}
        className="block"
      >
        {/* Connection lines */}
        {nodes.map((n, i) => {
          if (n.parentX == null || n.parentY == null) return null;
          return (
            <path
              key={`line-${i}`}
              d={`M${n.parentX},${n.parentY} C${n.parentX},${n.y - 6} ${n.x + nodeWidth / 2},${n.parentY + 10} ${n.x + nodeWidth / 2},${n.y - 2}`}
              fill="none"
              stroke="var(--border)"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const level = getDominantMastery(n.node.cards, mastery);
          const hasCards = n.node.cards.length > 0;
          const masteryColor = MASTERY_COLORS[level];

          return (
            <g
              key={`node-${i}`}
              onClick={() => {
                if (hasCards && onSelectCard) onSelectCard(n.node.cards[0]);
              }}
              style={{ cursor: hasCards ? "pointer" : "default" }}
            >
              {/* Node background */}
              <rect
                x={n.x}
                y={n.y - nodeHeight / 2}
                width={nodeWidth}
                height={nodeHeight}
                rx={6}
                fill={hasCards ? "var(--bg-card)" : "var(--bg-surface)"}
                stroke={hasCards ? masteryColor : "var(--border)"}
                strokeWidth={hasCards ? 2 : 1}
              />
              {/* Move text */}
              <text
                x={n.x + nodeWidth / 2}
                y={n.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
                fontFamily="var(--font-mono)"
                fill={hasCards ? "var(--text-primary)" : "var(--text-tertiary)"}
                fontWeight={hasCards ? 600 : 400}
              >
                {n.node.move}
              </text>
              {/* Card count badge */}
              {hasCards && (
                <>
                  <circle
                    cx={n.x + nodeWidth - 4}
                    cy={n.y - nodeHeight / 2 + 4}
                    r={6}
                    fill={masteryColor}
                  />
                  <text
                    x={n.x + nodeWidth - 4}
                    y={n.y - nodeHeight / 2 + 5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={7}
                    fill="white"
                    fontWeight={700}
                    fontFamily="var(--font-sans)"
                  >
                    {n.node.cards.length}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
