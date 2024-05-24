import { Schema, model } from 'mongoose';

const verified_phone_number_schema = new Schema({
    phoneNumber: String,
    dateLastReferenced: Date,
});

const VerifiedPhoneNumber = model(
    'VerifiedPhoneNumber',
    verified_phone_number_schema
);
export default VerifiedPhoneNumber;
