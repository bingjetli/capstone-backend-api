import { Schema, model } from 'mongoose';

const verified_email_schema = new Schema({
    email: String,
    dateLastReferenced: Date,
});

const VerifiedEmail = model('VerifiedEmail', verified_email_schema);
export default VerifiedEmail;
