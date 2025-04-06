
import { DataModel } from "@/models/Data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // Handle filter options request
  if (searchParams.get('type') === 'filter-options') {
    const field = searchParams.get('field');
    if (!field) return NextResponse.json({ error: "Field parameter required" }, { status: 400 });
    
    try {
      const values = await DataModel.distinct(field);
      return NextResponse.json(values);
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch options" }, { status: 500 });
    }
  }

  // Original GET implementation
  const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;
  const query: any = {};

  // Build query from parameters
  [
    'sportEvent', 'eventName', 'classification', 
    'gender', 'athleteName'
  ].forEach((field) => {
    const value = searchParams.get(field);
    if (value) query[field] = { $regex: value, $options: 'i' };
  });

  try {
    const data = await DataModel.find(query).sort({ value: sortOrder });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// POST remains same

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