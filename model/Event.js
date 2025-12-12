import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  totalSeats: { type: Number, required: true, min: 1 },
  
  bookedSeats: { type: Number, required: true, default: 0, min: 0 }, 
  ticketPrice: { type: Number, required: true },
  primaryImage: { type: String }, 
}, {
  timestamps: true,
});

export default mongoose.model('Event', EventSchema);