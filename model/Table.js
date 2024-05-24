import { Schema, model } from 'mongoose';

const table_schema = new Schema({
    tableId: Number,
    alias: String,
});

const Table = model('Table', table_schema);
export default Table;
