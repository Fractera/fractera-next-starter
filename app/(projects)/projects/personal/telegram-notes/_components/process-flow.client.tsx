"use client";

import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  useNodesState,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Info, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { FLOW_EDGES, FLOW_NODES, type FlowNode as GeneratedFlowNode } from "../_data/flow";
import { projectAction } from "../_data/actions";
import { NodeKeyCheck } from "./node-key-check.client";

// Local augmentation: the diagram data is derived (never hand-edited), but this component
// annotates each node at runtime with `alert` (a needed key is missing → red background).
type FlowNode = GeneratedFlowNode & { data: GeneratedFlowNode["data"] & { alert?: boolean } };

// Action color → a left-accent hex the node border uses (matches the registry palette).
const ACTION_ACCENT: Record<string, string> = {
  blue: "#3b82f6", amber: "#f59e0b", green: "#22c55e", violet: "#8b5cf6",
  rose: "#f43f5e", cyan: "#06b6d4", orange: "#f97316", teal: "#14b8a6",
};

// The action ids flowing through a node → the accent to tint its border. A single action =
// that action's color; a trunk ("all") or multi-action node stays neutral (shown via badges).
function nodeAccent(actions: FlowNode["data"]["info"]["actions"]): string | undefined {
  if (!Array.isArray(actions) || actions.length !== 1) return undefined;
  return ACTION_ACCENT[projectAction(actions[0]).color];
}

// Interactive process diagram (react-flow). Its shape is DATA in _data/flow.ts —
// the project's EXECUTION SCHEMA (contract R6): reshape the diagram there, never
// in this component. Clicking a node opens the info panel with EVERYTHING the node
// is (kind, actions, condition, task, tools, env keys, io, connections) — R8. Each
// node is tinted by its Action color; a node that needs a key it does not have gets
// a light-red background (188-R).
function ProcessNode({ data, selected }: NodeProps<FlowNode>) {
  const accent = nodeAccent(data.info.actions);
  const needsKey = Boolean(data.alert);
  return (
    <div
      className={
        "flex max-w-56 items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm " +
        (needsKey ? "bg-red-500/10 border-red-500/50 " : "bg-background ") +
        (selected ? "border-primary" : needsKey ? "" : "border-border")
      }
      style={accent && !needsKey ? { borderLeft: `3px solid ${accent}` } : undefined}
    >
      <Handle type="target" position={Position.Left} />
      <span>{data.label}</span>
      <Info className="size-3.5 shrink-0 text-muted-foreground" />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const NODE_TYPES = { process: ProcessNode };

function PanelList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <div className="space-y-1">
      <h4 className="font-medium">{title}</h4>
      <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

// Which of the node's env keys we can probe presence for (the check-key targets). A node that
// declares one of these but has it absent gets the red alert. TELEGRAM_ALLOWED_CHAT_ID is
// optional (empty = all chats) so it never raises an alert.
const PRESENCE_KEYS = ["TELEGRAM_BOT_TOKEN", "OPENAI_API_KEY"];

export function ProcessFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(FLOW_NODES);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Fetch key presence once, then flag every node that needs an absent key (red background).
  // OpenAI "inconclusive" (auth/gateway hiccup) never flags — no false alarm (187.9).
  useEffect(() => {
    let alive = true;
    async function loadPresence() {
      const present: Record<string, boolean> = {};
      try {
        const r = await fetch("/api/project-config/env?keys=TELEGRAM_BOT_TOKEN", { cache: "no-store" });
        const d = r.ok ? ((await r.json()) as { present?: Record<string, boolean> }) : null;
        present.TELEGRAM_BOT_TOKEN = d ? Boolean(d.present?.TELEGRAM_BOT_TOKEN) : true;
      } catch {
        present.TELEGRAM_BOT_TOKEN = true;
      }
      try {
        const r = await fetch("/api/project-config/openai-key", { cache: "no-store" });
        const d = r.ok ? ((await r.json()) as { configured?: boolean; inconclusive?: boolean }) : null;
        present.OPENAI_API_KEY = d ? Boolean(d.configured) || Boolean(d.inconclusive) : true;
      } catch {
        present.OPENAI_API_KEY = true;
      }
      if (!alive) return;
      setNodes((prev) =>
        prev.map((n) => {
          const missing = (n.data.info.envKeys ?? []).some(
            (k) => PRESENCE_KEYS.includes(k) && present[k] === false,
          );
          return { ...n, data: { ...n.data, alert: missing } };
        }),
      );
    }
    loadPresence();
    return () => {
      alive = false;
    };
  }, [setNodes]);

  const active = activeId
    ? nodes.find((node) => node.id === activeId)
    : undefined;

  // The node's connections, derived from the edges — shown in the info panel.
  const links = useMemo(() => {
    if (!activeId) {
      return { incoming: [], outgoing: [] };
    }
    const labelOf = (id: string) =>
      nodes.find((node) => node.id === id)?.data.label ?? id;
    return {
      incoming: FLOW_EDGES.filter((edge) => edge.target === activeId).map(
        (edge) => labelOf(edge.source)
      ),
      outgoing: FLOW_EDGES.filter((edge) => edge.source === activeId).map(
        (edge) => labelOf(edge.target)
      ),
    };
  }, [activeId, nodes]);

  const info = active?.data.info;

  return (
    <div className="relative h-[420px] overflow-hidden rounded-lg border">
      <ReactFlow
        nodes={nodes}
        edges={FLOW_EDGES}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onNodeClick={(_, node) => setActiveId(node.id)}
        onPaneClick={() => setActiveId(null)}
        nodesConnectable={false}
        deleteKeyCode={null}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      {active && info && (
        <aside className="absolute inset-y-0 right-0 w-72 space-y-4 overflow-y-auto border-l bg-background/95 p-4 text-sm">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium">{active.data.label}</h3>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {info.kind}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close node info"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => setActiveId(null)}
            >
              <X className="size-4" />
            </button>
          </div>
          <p className="text-muted-foreground">{info.summary}</p>
          {/* Which Action branches flow through this node (188-R). */}
          {info.actions && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Actions:</span>
              {info.actions === "all" ? (
                <Badge variant="outline">all</Badge>
              ) : (
                info.actions.map((id) => {
                  const a = projectAction(id);
                  const accent = ACTION_ACCENT[a.color];
                  return (
                    <Badge key={id} variant="outline" style={accent ? { borderColor: accent, color: accent } : undefined}>
                      {a.title}
                    </Badge>
                  );
                })
              )}
            </div>
          )}
          {info.condition && (
            <div className="space-y-1">
              <h4 className="font-medium">Condition</h4>
              <p className="text-muted-foreground">{info.condition}</p>
            </div>
          )}
          {info.task && (
            <div className="space-y-1">
              <h4 className="font-medium">Task</h4>
              <p className="whitespace-pre-line text-muted-foreground">
                {info.task}
              </p>
            </div>
          )}
          <PanelList title="Processes" items={info.processes} />
          <PanelList title="Tools" items={info.tools} />
          {/* Third place a key can be set: an input + live "Check key / API" per env key. */}
          <NodeKeyCheck envKeys={info.envKeys} />
          {info.io && (
            <div className="space-y-1">
              <h4 className="font-medium">Inputs → outputs</h4>
              <p className="text-muted-foreground">
                {JSON.stringify(info.io.in)} → {JSON.stringify(info.io.out)}
              </p>
            </div>
          )}
          {(links.incoming.length > 0 || links.outgoing.length > 0) && (
            <div className="space-y-1">
              <h4 className="font-medium">Connections</h4>
              <ul className="space-y-1 text-muted-foreground">
                {links.incoming.map((label) => (
                  <li key={`in-${label}`}>← {label}</li>
                ))}
                {links.outgoing.map((label) => (
                  <li key={`out-${label}`}>→ {label}</li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      )}
    </div>
  );
}
