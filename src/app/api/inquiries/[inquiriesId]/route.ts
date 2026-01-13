import { NextRequest, NextResponse } from "next/server";
import { inquiries } from "@/mockData";
import { Phase } from "@/types/inquiry";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ inquiriesId: string }> }) {
    // network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { inquiriesId } = await params;
    const body = await request.json();
    const { phase }:{phase:Phase} = body;

    const inquiryIndex = inquiries.findIndex((inquiry) => inquiry.id === inquiriesId);

    if (inquiryIndex === -1) { return NextResponse.json({ error: "Inquiry not found" }, { status: 404 }); }

    inquiries[inquiryIndex] = {...inquiries[inquiryIndex], phase, updatedAt: new Date().toISOString()};
    return NextResponse.json(inquiries[inquiryIndex]);
}