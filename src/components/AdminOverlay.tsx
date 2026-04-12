"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface DraggableItem {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  scale: number;
}

interface AdminOverlayProps {
  enabled: boolean;
  items: DraggableItem[];
  onUpdate: (items: DraggableItem[]) => void;
}

export type { DraggableItem };

export default function AdminOverlay({ enabled, items, onUpdate }: AdminOverlayProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const startRef = useRef({ mx: 0, my: 0, x: 0, y: 0, w: 0, s: 0 });
  const [showLayout, setShowLayout] = useState(false);

  if (!enabled) return null;

  const update = (id: string, changes: Partial<DraggableItem>) => {
    onUpdate(items.map((item) => (item.id === id ? { ...item, ...changes } : item)));
  };

  const onPointerDownDrag = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    setDragging(true);
    const item = items.find((i) => i.id === id)!;
    startRef.current = { mx: e.clientX, my: e.clientY, x: item.x, y: item.y, w: item.width, s: item.scale };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerDownResize = (id: string, e: React.PointerEvent) => {
    e.stopPropagation();
    setSelectedId(id);
    setResizing(true);
    const item = items.find((i) => i.id === id)!;
    startRef.current = { mx: e.clientX, my: e.clientY, x: item.x, y: item.y, w: item.width, s: item.scale };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!selectedId) return;
    const dx = e.clientX - startRef.current.mx;
    const dy = e.clientY - startRef.current.my;
    if (dragging) {
      update(selectedId, {
        x: Math.round(startRef.current.x + dx),
        y: Math.round(startRef.current.y + dy),
      });
    }
    if (resizing) {
      const newScale = Math.max(0.2, startRef.current.s + dx / 300);
      update(selectedId, { scale: Math.round(newScale * 100) / 100 });
    }
  };

  const onPointerUp = () => {
    setDragging(false);
    setResizing(false);
  };

  const selectedItem = items.find((i) => i.id === selectedId);

  return (
    <div
      className="fixed inset-0 z-[900] pointer-events-none"
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{ pointerEvents: dragging || resizing ? "auto" : "none" }}
    >
      {/* Admin toggle bar */}
      <div
        className="fixed top-3 left-3 z-[999] flex items-center gap-2 pointer-events-auto"
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px]"
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Admin Mode
        </div>
        <button
          onClick={() => setShowLayout(!showLayout)}
          className="px-3 py-1.5 rounded-full text-[11px]"
          style={{
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {showLayout ? "Hide" : "Show"} Layout
        </button>
      </div>

      {/* Layout readout */}
      {showLayout && (
        <div
          className="fixed bottom-3 left-3 z-[999] p-3 rounded-xl text-[10px] max-h-[40vh] overflow-y-auto pointer-events-auto"
          style={{
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)",
            fontFamily: "monospace",
            minWidth: 220,
          }}
        >
          <p className="text-[9px] uppercase tracking-widest text-white/30 mb-2">Current Layout</p>
          {items.map((item) => (
            <div key={item.id} className="mb-1.5">
              <span className="text-white/40">{item.label}:</span>{" "}
              <span className="text-green-400/70">x:{item.x} y:{item.y} scale:{item.scale}</span>
            </div>
          ))}
        </div>
      )}

      {/* Drag handles over each item */}
      {items.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <div
            key={item.id}
            className="absolute pointer-events-auto"
            style={{
              left: item.x - 4,
              top: item.y - 4,
              width: item.width * item.scale + 8,
              height: "auto",
              minHeight: 30,
              outline: isSelected ? "2px solid rgba(59,130,246,0.6)" : "1px dashed rgba(159,159,157,0.3)",
              outlineOffset: 2,
              borderRadius: 4,
              cursor: "grab",
            }}
            onPointerDown={(e) => onPointerDownDrag(item.id, e)}
          >
            {/* Label */}
            <div
              className="absolute -top-5 left-0 text-[9px] px-1.5 py-0.5 rounded"
              style={{
                background: isSelected ? "rgba(59,130,246,0.8)" : "rgba(0,0,0,0.5)",
                color: "white",
                whiteSpace: "nowrap",
              }}
            >
              {item.label}
              {isSelected && ` (${item.x}, ${item.y}) ×${item.scale}`}
            </div>

            {/* Resize handle */}
            {isSelected && (
              <div
                className="absolute -right-2 -bottom-2 w-4 h-4 rounded-full cursor-se-resize"
                style={{ background: "rgba(59,130,246,0.8)", border: "2px solid white" }}
                onPointerDown={(e) => onPointerDownResize(item.id, e)}
              />
            )}
          </div>
        );
      })}

      {/* Selected item controls */}
      {selectedItem && (
        <div
          className="fixed bottom-3 right-3 z-[999] flex items-center gap-3 px-4 py-2 rounded-full pointer-events-auto"
          style={{
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <span className="text-[11px] text-white/50">{selectedItem.label}</span>
          <span className="text-[11px] text-white/30">|</span>
          <span className="text-[11px] text-blue-400/80 font-mono">
            x:{selectedItem.x} y:{selectedItem.y} s:{selectedItem.scale}
          </span>
          <button
            onClick={() => setSelectedId(null)}
            className="text-[11px] text-white/30 hover:text-white/60"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
