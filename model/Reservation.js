import { Schema, model, Types } from 'mongoose';

const reservation_schema = new Schema({
    firstName: {
        type: String,
        minLength: [3, 'First name should be at least 3 characters in length.'],
        trim: true,
        lowercase: true,
        match: /[a-z]/i,
    },
    lastName: {
        type: String,
        required: true,
        minLength: [3, 'Last name should be at least 3 characters in length.'],
        trim: true,
        lowercase: true,
        match: /[a-z]/i,
    },
    //Both the email and phone number should be validated outside of
    //the model because as long as one of them is included, it will be valid.
    email: {
        type: String,
        minLength: [3, 'The email should be at least 3 characters in length.'],
        maxLength: [
            320,
            'The email should be a maximum of 320 characters in length.',
        ],
        trim: true,
        match: /^[A-z0-9\._-]+@[A-z0-9]+\.[A-z0-9]+$/,
    },
    phoneNumber: {
        type: String,
        trim: true,
        match: /^[0-9]{11,13}$/,
    },
    date: {
        type: Date,
        required: true,
    },
    tableId: {
        type: Number,
        min: [0, 'tableId cannot be a negative number.'],
    },
    seats: {
        type: Number,
        required: true,
        min: [0, 'Seats cannot be a negative number.'],
    },
    status: {
        type: String,
        required: true,
        default: 'requires-approval',
        trim: true,
        lowercase: true,
        enum: ['requires-approval', 'reserved', 'deleted'],
    },
    notes: {
        type: String,
        maxLength: 255,
    },
});

const Reservation = model('Reservation', reservation_schema);
export default Reservation;
