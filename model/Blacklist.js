import { Schema, model } from 'mongoose';

const blacklist_schema = new Schema({
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
    dateBlacklisted: {
        type: Date,
        default: Date.now,
    },
});

const Blacklist = model('Blacklist', blacklist_schema);
export default Blacklist;
