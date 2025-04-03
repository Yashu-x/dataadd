import { DataModel } from "@/models/Data";
import {NextRequest,NextResponse} from "next/server";

export async function GET() {
    const data = await DataModel.find();
    const response = NextResponse.json(data);
    return response;
}

export async function POST(request: NextRequest) {
    const { key, value } = await request.json();
    const data = new DataModel({ key, value });
    await data.save();
    return NextResponse.json(data);
}