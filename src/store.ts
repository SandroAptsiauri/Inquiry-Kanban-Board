import { create } from "zustand";
import { Inquiry, Phase } from "./types/inquiry";

type inquiryStore = {
    inquiries: Inquiry[];
    loading: boolean;
    error: string | null;
    fetchInquiries: (clientName?: string, minValue?: string, startDate?: string, endDate?: string) => Promise<void>;
    updatePhase: (id:string, phase:Phase) => Promise<void>;
}

export const useInquiryStore = create<inquiryStore>((set,get)=>({
    inquiries: [],
    loading: false,
    error: null,
    fetchInquiries: async (clientName?: string, minValue?: string, startDate?: string, endDate?: string) => {
        set({ loading: true, error: null });
        try {
            const params = new URLSearchParams();
            if (clientName) params.set("clientName", clientName);
            if (minValue) params.set("minValue", minValue);
            if (startDate) params.set("startDate", startDate);
            if (endDate) params.set("endDate", endDate);
            const res = await fetch(`/api/inquiries?${params.toString()}`);
            if (!res.ok) {
                set({ loading: false, error: "Failed to fetch inquiries" });
                return;
            }
            const data = await res.json();
            const current = get().inquiries;
            const merged = data.map((fetched: Inquiry) => {
                const existing = current.find(c => c.id === fetched.id);
                if (existing && new Date(existing.updatedAt) > new Date(fetched.updatedAt)) {
                    return existing;
                }
                return fetched;
            });
            set({ inquiries: merged, loading: false });
        } catch (error) {
            set({ loading: false, error: "Failed to fetch inquiries" });
            throw error;
        }
    },
    updatePhase: async (id:string, phase:Phase) => {
        const previous = get().inquiries;
        const now = new Date().toISOString();
    
        set({
          inquiries: previous.map(i =>
            i.id === id ? { ...i, phase, updatedAt: now } : i
          ),
        });
    
        try {
          await fetch(`/api/inquiries/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phase }),
          });
        } catch {
          set({ inquiries: previous });
        }
      },
}))