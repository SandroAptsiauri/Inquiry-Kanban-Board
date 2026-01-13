"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useInquiryStore } from "@/store";
import { Inquiry, Phase } from "@/types/inquiry";
import { format, formatDistanceToNow } from "date-fns";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inquiry: Inquiry;
}

export default function InquiryModal({ isOpen, onClose, inquiry }: Props) {
  const updatePhase = useInquiryStore(state => state.updatePhase);
  

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !inquiry) return null;

  const isHighValue = inquiry.potentialValue > 50000;

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{inquiry.clientName}</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-3xl leading-none cursor-pointer transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          {isHighValue && (
            <span className="inline-block mt-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              High Value Inquiry
            </span>
          )}
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Event Type</p>
              <p className="text-base font-semibold text-gray-900">{inquiry.eventType}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Event Date</p>
              <p className="text-base font-semibold text-gray-900">
                {format(new Date(inquiry.eventDate), "MMM d, yyyy")}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Guest Count</p>
              <p className="text-base font-semibold text-gray-900">{inquiry.guestCount} guests</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Potential Value</p>
              <p className={`text-base font-bold ${isHighValue ? "text-red-600" : "text-green-600"}`}>
                CHF {inquiry.potentialValue.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Contact Person</p>
            <p className="text-base text-gray-900">{inquiry.contactPerson}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Hotels</p>
            <div className="flex flex-wrap gap-2">
              {inquiry.hotels.map((hotel, idx) => (
                <span key={idx} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {hotel}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-2">Notes</p>
            <p className="text-base text-gray-900 bg-gray-50 rounded-lg p-4">{inquiry.notes || "No notes"}</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Change Phase</label>
            <select
              value={inquiry.phase}
              onChange={(e) => updatePhase(inquiry.id, e.target.value as Phase)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              {["new", "sent_to_hotels", "offers_received", "completed"].map((p) => (
                <option key={p} value={p}>{p.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</option>
              ))}
            </select>
          </div>

          <div className="pt-4 border-t border-gray-200 flex justify-between text-xs text-gray-500">
            <p>
              <span className="font-medium">Created:</span> {format(new Date(inquiry.createdAt), "MMM d, yyyy HH:mm")}
            </p>
            <p>
              <span className="font-medium">Updated:</span> {formatDistanceToNow(new Date(inquiry.updatedAt), { addSuffix: true })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
