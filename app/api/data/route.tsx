

// import { DataModel } from "@/models/Data";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
  
//   // Handle filter options request
//   if (searchParams.get('type') === 'filter-options') {
//     const field = searchParams.get('field');
//     if (!field) return NextResponse.json({ error: "Field parameter required" }, { status: 400 });
    
//     try {
//       const values = await DataModel.distinct(field);
//       return NextResponse.json(values);
//     } catch (error) {
//       return NextResponse.json({ error: "Failed to fetch options" }, { status: 500 });
//     }
//   }

//   // Original GET implementation
//   const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;
//   const query: any = {};

//   // Build query from parameters
//   [
//     'sportEvent', 'eventName', 'classification', 
//     'athleteName' // Keep these as regex search
//   ].forEach((field) => {
//     const value = searchParams.get(field);
//     if (value && value !== 'all') query[field] = { $regex: value, $options: 'i' };
//   });

//   // Handle gender filter separately with exact case-insensitive match
//   const genderFilter = searchParams.get('gender');
//   if (genderFilter && genderFilter !== 'all') {
//     query.gender = { $regex: `^${genderFilter}$`, $options: 'i' };
//   }

//   try {
//     const data = await DataModel.find(query).sort({ value: sortOrder });
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
//     const { sportEvent, eventName, classification, gender, athleteName, value } = await request.json();
    
//     if (!sportEvent || !eventName || !classification || !gender || !athleteName || value === undefined) {
//         return NextResponse.json({ error: "All fields are required" }, { status: 400 });
//     }

//     const numericValue = parseFloat(value);
//     if (isNaN(numericValue)) {
//         return NextResponse.json({ error: "Invalid numeric value" }, { status: 400 });
//     }

//     // Ensure gender is stored in lowercase
//     const normalizedGender = gender.toLowerCase();
    
//     const data = new DataModel({ 
//         sportEvent,
//         eventName,
//         classification,
//         gender: normalizedGender,
//         athleteName,
//         value: numericValue,
//         unit: 's',
//         timestamp: new Date()
//     });
    
//     await data.save();
//     return NextResponse.json(data);
// }
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

  // New endpoint for athlete gender lookup
  if (searchParams.get('type') === 'athlete-gender') {
    const athleteName = searchParams.get('name');
    if (!athleteName) return NextResponse.json({ error: "Athlete name required" }, { status: 400 });

    try {
      // Find most recent record for this athlete
      const latestRecord = await DataModel.findOne(
        { athleteName: { $regex: new RegExp(`^${athleteName}$`, 'i') } },
        { gender: 1 },
        { sort: { timestamp: -1 } }
      );
      
      return NextResponse.json({ 
        gender: latestRecord?.gender || null,
        found: !!latestRecord
      });
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch athlete gender" }, { status: 500 });
    }
  }

  // Original GET implementation
  const sortOrder = searchParams.get("sortOrder") === "desc" ? -1 : 1;
  const query: any = {};

  // Build query from parameters
  [
    'sportEvent', 'eventName', 'classification', 
    'athleteName'
  ].forEach((field) => {
    const value = searchParams.get(field);
    if (value && value !== 'all') query[field] = { $regex: value, $options: 'i' };
  });

  // Handle gender filter separately with exact case-insensitive match
  const genderFilter = searchParams.get('gender');
  if (genderFilter && genderFilter !== 'all') {
    query.gender = { $regex: `^${genderFilter}$`, $options: 'i' };
  }

  try {
    const data = await DataModel.find(query).sort({ value: sortOrder });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
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

    // Ensure gender is stored in lowercase
    const normalizedGender = gender.toLowerCase();
    
    const data = new DataModel({ 
        sportEvent,
        eventName,
        classification,
        gender: normalizedGender,
        athleteName,
        value: numericValue,
        unit: 's',
        timestamp: new Date()
    });
    
    await data.save();
    return NextResponse.json(data);
}