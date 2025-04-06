import { DataModel } from "@/models/Data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;
    const searchValue = searchParams.get("searchValue") || "";
    const filters = {
      sportEvent: searchParams.get("sportEvent") || "",
      gender: searchParams.get("gender") || "",
      eventName: searchParams.get("eventName") || "",
      classification: searchParams.get("classification") || "",
      athleteName: searchParams.get("athleteName") || ""
    };
    
    const query: any = {};
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        query[key] = { $regex: value, $options: 'i' };
      }
    });
    
    // Apply sorting
    const data = await DataModel.find(query).sort({ value: sortOrder });
    return NextResponse.json(data);
  }

export async function POST(request: NextRequest) {
    const { sportEvent, eventName, classification, gender, athleteName, value } = await request.json();
    
    if (!sportEvent || !eventName || !classification || !gender || !athleteName || value === undefined) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) {
        return NextResponse.json({ error: "Invalid numeric value" }, { status: 400 });
    }

    const data = new DataModel({ 
        sportEvent,
        eventName,
        classification,
        gender,
        athleteName,
        value: numericValue,
        unit: 's',
        timestamp: new Date()
    });
    
    await data.save();
    return NextResponse.json(data);
}