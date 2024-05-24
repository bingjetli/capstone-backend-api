import { Schema, model, Types } from 'mongoose';

const reservation_schema = new Schema({
    reservationId: Number,
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: String,
    date: Date,
    startTime: Date,
    endTime: Date,
    notes: String,
    tableId: Number,
    status: String,
});

const Reservation = model('Reservation', reservation_schema);
export default Reservation;
