import { Inquiry, Phase } from "@/types/inquiry";
import { InquiryCard } from "./InquiryCard";
import { useDroppable } from "@dnd-kit/core";

const phaseColors: Record<Phase, { bg: string; border: string; header: string }> = {
  new: { bg: "bg-blue-50", border: "border-blue-200", header: "bg-blue-500" },
  sent_to_hotels: { bg: "bg-yellow-50", border: "border-yellow-200", header: "bg-yellow-500" },
  offers_received: { bg: "bg-purple-50", border: "border-purple-200", header: "bg-purple-500" },
  completed: { bg: "bg-green-50", border: "border-green-200", header: "bg-green-500" },
};

export function KanbanColumn({ phase, inquiries }:{ phase: { label: string, value: Phase }, inquiries: Inquiry[] }) {
    const total = inquiries.reduce(
      (sum, i) => sum + i.potentialValue,
      0
    );
    const {setNodeRef, isOver} = useDroppable({id:phase.value});
    const colors = phaseColors[phase.value];
    
    return (
      <div 
        ref={setNodeRef}
        className={`${colors.bg} ${colors.border} border-2 rounded-lg min-h-[500px] transition-all ${
          isOver ? "ring-2 ring-offset-2 ring-blue-400 scale-[1.02]" : ""
        }`}
      >
        <header className={`${colors.header} text-white rounded-t-lg px-4 py-3 mb-3`}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">{phase.label}</h2>
            <span className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {inquiries.length}
            </span>
          </div>
          <p className="text-white/90 text-sm mt-1">
            Total: CHF {total.toLocaleString()}
          </p>
        </header>
        <div className="px-2 pb-2 space-y-3">
          {inquiries.length === 0 ? (
            <div className="text-center text-gray-400 py-8 text-sm">
              No inquiries
            </div>
          ) : (
            inquiries.map((i: Inquiry) => (
              <InquiryCard key={i.id} inquiry={i} />
            ))
          )}
        </div>
      </div>
    );
  }
  