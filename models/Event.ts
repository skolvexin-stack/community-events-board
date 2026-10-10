import mongoose, { Schema, model, models, Types } from "mongoose";

export interface IEvent {
  _id: Types.ObjectId;
  title: string;
  category: string;
  city: string;
  dateTime: Date;
  price: number;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    city: { type: String, required: true },
    dateTime: { type: Date, required: true },
    price: { type: Number, required: true, default: 0 },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

EventSchema.index({ isActive: 1, dateTime: 1 });
EventSchema.index({ category: 1, isActive: 1 });
EventSchema.index({ city: 1, isActive: 1 });
EventSchema.index({ title: "text", description: "text" });

export const Event = models.Event ?? model<IEvent>("Event", EventSchema);
