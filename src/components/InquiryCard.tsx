import { Inquiry } from "@/types/inquiry";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";
import InquiryModal from "./InquiryModal";

export function InquiryCard({ inquiry, }: { inquiry: Inquiry}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [touchStartTime, setTouchStartTime] = useState(0);
    const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
    const isHighValue = inquiry.potentialValue > 50000;
    const {setNodeRef, attributes, listeners, transform, isDragging} = useDraggable({id:inquiry.id});
    
    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        scale: isDragging ? 0.95 : 1,
        touchAction: 'none' as const,
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        setTouchStartTime(Date.now());
        setTouchStartPos({ x: touch.clientX, y: touch.clientY });
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (isDragging) return;
        
        const touch = e.changedTouches[0];
        const touchEndTime = Date.now();
        const touchDuration = touchEndTime - touchStartTime;
        const touchDistance = Math.sqrt(
            Math.pow(touch.clientX - touchStartPos.x, 2) + 
            Math.pow(touch.clientY - touchStartPos.y, 2)
        );

        // If it was a quick tap (less than 300ms) with minimal movement (less than 10px), open modal
        if (touchDuration < 300 && touchDistance < 10) {
            e.stopPropagation();
            e.preventDefault();
            setIsModalOpen(true);
        }
    };
  
    return (
        <>
            <div 
                ref={setNodeRef} 
                style={style}
                {...attributes} 
                {...listeners}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    if (!isDragging) {
                        setIsModalOpen(true);
                    }
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 hover:border-blue-300 group"
            >
                <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                        {inquiry.clientName}
                    </h3>
                    {isHighValue && (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            High Value
                        </span>
                    )}
                </div>
                
                <div className="space-y-1.5 mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="text-gray-400 mr-2">📅</span>
                        <span>{new Date(inquiry.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="text-gray-400 mr-2">👥</span>
                        <span>{inquiry.guestCount} guests</span>
                    </div>
                    <div className="flex items-center text-sm font-semibold">
                        <span className="text-gray-400 mr-2">💰</span>
                        <span className={isHighValue ? "text-red-600" : "text-green-600"}>
                            CHF {inquiry.potentialValue.toLocaleString()}
                        </span>
                    </div>
                </div>
                
                <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center group-hover:text-blue-500 transition-colors">
                        Double-click for details
                    </p>
                </div>
            </div>
            {isModalOpen && (
                <InquiryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    inquiry={inquiry}
                />
            )}
        </>
    );
  }
  