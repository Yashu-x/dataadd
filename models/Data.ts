import mongoose, { Document, Schema } from 'mongoose';
import { connectToMongo } from '@/lib/mongo';

export interface DataDocument extends Document {
    key: String;
    value: String;
}

const DataSchema: Schema = new Schema<DataDocument>({
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
},{
    timestamps: true,
}
);

async function init():Promise<void> {
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