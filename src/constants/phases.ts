import { Phase } from "@/types/inquiry";
export type PhaseItem ={
  label: string;
  value: Phase;
}

export const PHASES: PhaseItem[] = [
  { label: "New", value: "new" },
  { label: "Sent to Hotels", value: "sent_to_hotels" },
  { label: "Offers Received", value: "offers_received" },
  { label: "Completed", value: "completed" },
];
