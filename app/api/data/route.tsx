import { DataModel } from "@/models/Data";
import {NextRequest,NextResponse} from "next/server";

export async function GET() {
    const data = await DataModel.find();
    const response = NextResponse.json(data);
    return response;
}

export async function POST(request: NextRequest) {
    const { key, value,Name } = await request.json();
    if (!key || !value || !Name) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    // console.log("Data received:", { key, value,Name });
    const data = new DataModel({ Name:Name, key, value });
    await data.save();
    return NextResponse.json(data);
}