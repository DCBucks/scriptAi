"use client";

import { Brain } from "lucide-react";

export default function BrandCorner() {
  return (
    <div
      className="fixed bottom-4 right-4 z-30 flex items-center space-x-2 text-primary text-sm font-semibold select-none"
      style={{ pointerEvents: "none" }}
    >
      <Brain className="w-5 h-5 text-primary" />
      <span className="tracking-tight">ScriptAi</span>
    </div>
  );
}
