import { Schema, model, models, Types } from "mongoose";

interface ICardDesign {
  eventId: Types.ObjectId;
  theme: string;
  stickers: string[];
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  passwordHash: string;
  preferences: string[];
  reminders: Types.ObjectId[];
  cardDesigns: ICardDesign[];
  createdAt: Date;
}

const CardDesignSchema = new Schema<ICardDesign>(
  {
    eventId: { type: Schema.Types.ObjectId, required: true },
    theme: { type: String, required: true },
    stickers: [{ type: String }],
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    preferences: [{ type: String }],
    reminders: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    cardDesigns: [CardDesignSchema],
  },
  { timestamps: true }
);

export const User = models.User ?? model<IUser>("User", UserSchema);
