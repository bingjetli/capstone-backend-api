import { Schema, model } from 'mongoose';

const blacklist_schema = new Schema({
    blacklistId: Number,
    email: String,
    phoneNumber: String,
    dateBlacklisted: Date,
});

const Blacklist = model('Blacklist', blacklist_schema);
export default Blacklist;
