import Booking from '../model/Booking.js';
import Event from '../model/Event.js';
import { getSocketIO } from '../socket.js';

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ status: true, message: "Events fetched", data: events });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, totalSeats, ticketPrice } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    if (!title || !date || !location || !ticketPrice) {
        return res.status(400).json({ status: false, message: "Please fill required fields" });
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      totalSeats,
      ticketPrice,
      primaryImage: imageUrl,
      secondaryImages: []
    });

    res.status(201).json({ status: true, message: "Event created successfully", data: event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ status: false, message: "Event not found" });

    await event.deleteOne();
    res.status(200).json({ status: true, message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const bookEvent = async (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ status: false, message: "Event not found" });
    }

    if (event.bookedSeats >= event.totalSeats) {
      return res.status(400).json({ status: false, message: "Housefull! No seats available." });
    }

    const existingBooking = await Booking.findOne({ user: userId, event: eventId });
    if (existingBooking) {
      return res.status(400).json({ status: false, message: "You have already booked this event." });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, bookedSeats: { $lt: event.totalSeats } },
      { $inc: { bookedSeats: 1 } },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(400).json({ status: false, message: "Booking failed. Seats just filled up!" });
    }

    await Booking.create({
      user: userId,
      event: eventId
    });

    const io = getSocketIO();
    io.emit("seatsUpdated", {
      eventId: eventId,
      bookedSeats: updatedEvent.bookedSeats,
      totalSeats: updatedEvent.totalSeats
    });

    res.status(200).json({ status: true, message: "Ticket booked successfully!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server Error during booking" });
  }
};