import mongoose, { Document, Schema } from 'mongoose';
import { connectToMongo } from '@/lib/mongo';

export interface DataDocument extends Document {
    sportEvent: string;
    eventName: string;
    classification: string;
    gender: string;
    athleteName: string;
    value: number;
    unit: string;
    
}

const DataSchema: Schema = new Schema<DataDocument>({
    sportEvent: { type: String, required: true },
    eventName: { type: String, required: true },
    classification: { type: String, required: true },
    gender: { type: String, required: true, enum: ['male', 'female'] },
    athleteName: { type: String, required: true },
    value: { type: Number, required: true },
    unit: { type: String },
    
});

async function init(): Promise<void> {
    try {
        await connectToMongo();
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

init().catch((error) => {
    console.error('Error initializing MongoDB connection:', error);
});

export const DataModel = mongoose.models.Data || mongoose.model<DataDocument>('Data', DataSchema);