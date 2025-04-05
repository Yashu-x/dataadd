
import { DataModel } from "@/models/Data";
import {NextRequest,NextResponse} from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;
    const searchField = searchParams.get("searchField") || "Name";
    const searchValue = searchParams.get("searchValue") || "";
    
    const query: any = {};
    if (searchValue) {
      query[searchField] = { $regex: searchValue, $options: 'i' }; // Case-insensitive search
    }
    
    const data = await DataModel.find(query).sort({ value: sortOrder });
    return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
    const { key, value, Name, classification } = await request.json();
    if (!key || !value || !Name || !classification) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Extract numeric part and unit
    const match = value.match(/^(\d+)([a-zA-Z]*)$/);
    if (!match) {
        return NextResponse.json({ error: "Invalid value format" }, { status: 400 });
    }

    const numericValue = parseInt(match[1], 10);
    const unit = match[2] || "s"; // Default to seconds if no unit provided

    const data = new DataModel({ 
      Name, 
      classification,
      key, 
      value: numericValue, 
      unit 
    });
    await data.save();
    return NextResponse.json(data);
}