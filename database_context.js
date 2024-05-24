module.exports = {
    _db: null,
    _client: null,

    _reservations_collection_name: 'reservations',
    _reservations: null,

    initialize: function (database_url, database_name) {
        //const {MongoClient, ObjectId}
        const { MongoClient } = require('mongodb');

        this._client = new MongoClient(database_url);
        this._db = this._client.db(database_name);

        this._reservations = this._db.collection(
            this._reservations_collection_name
        );
    },

    getAllReservations: async function () {
        const results = this._reservations.find({});
        return await results.toArray();
    },
};
