import { useInquiryStore } from "@/store";
import { KanbanColumn } from "./KanbanColumn";
import { PHASES } from "@/constants/phases";
import { Phase } from "@/types/inquiry";
import { DndContext, DragEndEvent,  PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";

export function KanbanBoard() {
  const inquiries = useInquiryStore(state => state.inquiries);
  const updatePhase = useInquiryStore(state => state.updatePhase);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );
  function handleDragEnd(event: DragEndEvent) {
    const {active, over} = event;
    if(!over) return;
    
    const taskId = active.id as string;
    const newPhase = over.id as Phase;
    
    const inquiry = inquiries.find(i => i.id === taskId);
    if (!inquiry || inquiry.phase === newPhase) return;
    
    updatePhase(taskId, newPhase);
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PHASES.map((phase: { label: string, value: Phase }) => {
          const phaseInquiries = inquiries
            .filter(i => i.phase === phase.value)
            .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
          return (
            <KanbanColumn
              key={phase.value}
              phase={phase}
              inquiries={phaseInquiries}
            />
          );
        })}
      </div>
    </DndContext>
  );
}
