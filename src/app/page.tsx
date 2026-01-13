"use client";

import { FilterForm } from "@/components/FilterForm";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useInquiryStore } from "@/store";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const fetchInquiries = useInquiryStore((state) => state.fetchInquiries);
  const loading = useInquiryStore((state) => state.loading);
  const searchParams = useSearchParams();
  const clientName = searchParams.get("clientName") || "";
  const minValue = searchParams.get("minValue") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  useEffect(() => {
    fetchInquiries(clientName || undefined, minValue || undefined, startDate || undefined, endDate || undefined);
  }, [fetchInquiries, clientName, minValue, startDate, endDate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading inquiries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FilterForm />
      <div className="max-w-7xl mx-auto px-4 pb-8">
        <KanbanBoard />
      </div>
    </div>
  );
}
