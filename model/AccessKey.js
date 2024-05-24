import { Schema, model } from 'mongoose';

const access_key_schema = new Schema({
    value: Number,
});

const AccessKey = model('AccessKey', access_key_schema);
export default AccessKey;
