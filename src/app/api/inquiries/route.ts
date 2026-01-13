import { NextResponse } from "next/server";
import { inquiries } from "@/mockData";

export async function GET(request: Request) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const {searchParams} = new URL(request.url);
    const client = searchParams.get("clientName");
    const minValue = searchParams.get("minValue");
    const startDateParam = searchParams.get("startDate");
const endDateParam = searchParams.get("endDate");

const startDate = startDateParam ? new Date(startDateParam) : null;
const endDate = endDateParam ? new Date(endDateParam) : null;
    let result = inquiries;
    if (client) {
        result = result.filter((inquiry) => inquiry.clientName.toLowerCase().includes(client.toLowerCase()));
    }
    if (minValue) {
        result = result.filter((inquiry) => inquiry.potentialValue >= Number(minValue));
    }
    if (startDate) {
        result = result.filter((i) => new Date(i.eventDate) >= startDate);
    }
    if (endDate) {
        result = result.filter((i) => new Date(i.eventDate) <= endDate);
    }
    return NextResponse.json(result);
}