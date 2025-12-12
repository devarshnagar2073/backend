import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  bookingDate: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Booking", BookingSchema);