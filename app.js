import express, { query } from 'express';
import dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose';
import Reservation from './model/Reservation.js';
import { faker } from '@faker-js/faker';

//Load the .env file
dotenv.config();

//Setup and initialize the express application.
const app = express();
const port = process.env.PORT || '8888';

//Configure JSON handling middleware.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Configure express to allow cross-origin requests.
app.use(function (req, res, next) {
    res.header(
        'Access-Control-Allow-Origin',
        process.env.CROSS_ORIGIN_ALLOWED_URL
    ); // Set to your frontend origin
    // res.header("Access-Control-Allow-Origin", "*"); // Allow all origins (not recommended)
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

//Setup API routing.
app.get('/', (request, response) => {
    response.json({
        content: 'The server is running!',
    });
});

app.get('/api/reservations/fetch/all', async (req, res) => {
    const tout_reservations = await Reservation.find({}).exec();

    if (tout_reservations.length > 0) {
        //If there are reservation entries, return them (200 OK)
        res.status(200).json({
            message: 'Retreived all reservations in the database.',
            reservations: tout_reservations,
        });
    } else {
        //Otherwise, indicate that there is nothing to return (204 No Content)
        res.status(204).json({
            message: 'There is nothing in the database',
        });
    }
});

//Queries the database according to the filter specified by the query
//parameters.
//  @param startDate : (int) unix timestamp to pass into the Date contructor.
//  @param endDate : (int) see above.
//  @param
//  @returns : { reservations: array }
app.get('/api/reservations/fetch', async (req, res) => {
    const start_date = req.query.startDate;
    const end_date = req.query.endDate;
    const query_filter = {
        status: 'reserved',
    };

    if (start_date) {
        //Validate that the value passed into start_date is an integer.
        if (isNaN(parseInt(start_date))) {
            return res.status(400).json({
                message: 'The value passed into startDate is not a Number.',
            }); //Bad Request 400
        }

        query_filter.date = { $gte: new Date(parseInt(start_date)) };

        //The end date is only valid if we specified a start date.
        if (end_date) {
            //Validate that the value passed into end_date is an integer.
            if (isNaN(parseInt(end_date))) {
                return res.status(400).json({
                    message: 'The value passed into endDate is not a Number.',
                }); //Bad Request 400
            }

            query_filter.date = {
                ...query_filter.date,
                $lte: new Date(parseInt(end_date)),
            };
        }
    }

    console.log('DEBUG: Received query filter : ');
    console.log(query_filter);

    const results = await Reservation.find(query_filter).exec();
    return res.status(200).json({
        message: `Found ${results.length} reservations matching this query.`,
        reservations: results,
    });
});

//Makes a request to the database in order to create a new Reservation.
//  @param {...} : application/json payload matching the Reservation Schema.
//  @returns : 201 Created on success, 400 Bad Request otherwise.
app.post('/api/reservations/create', async (req, res) => {
    //Wrap this in a try-catch block to avoid crashing the server with
    //invalid json formats.
    try {
        //First verify that the POST request has either a email or phone number
        //specified as at least 1 is required.
        if (!req.body.email && !req.body.phoneNumber) {
            //If both of these fields are falsy (neither one was specified
            //the request), then return 400 : Bad Request.
            return res.status(400).json({
                message: 'No email or phone number included in the request...',
            });
        }

        //Create the Reservation if it passes validation and return a 201
        //on successful creation.
        await Reservation.create(req.body);
        return res.status(201).json({
            message: 'Reservation created successfully',
        });
    } catch (error) {
        console.log('DEBUG: Error encountered while creating the model...');
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});

//Makes a request to the database in order to update the firstname of
//the reservation entry.
//Expects an application/json with the following fields (@params) :
//  @param payload : (application/json) : {
//      _id: (ObjectID) : The mongodb objectID for the item to upate.
//      firstName: (String) : The new value of the field.
//}
app.post('/api/reservations/update/firstName', async (req, res) => {
    try {
        //First validate that the post payload contains the proper fields.
        if (!req.body.id) {
            return res.status(400).json({
                message:
                    "The 'id' field is missing from the POST body payload. ",
            });
        }
        if (!req.body['firstName']) {
            return res.status(400).json({
                message:
                    "The 'firstName' field is missing from the POST body payload. ",
            });
        }

        //Then attempt to perform the update query.
        const result = await Reservation.findByIdAndUpdate(
            req.body.id,
            {
                firstName: req.body['firstName'],
            },
            { runValidators: true }
        ).exec();

        if (result === null) {
            //The item is not found, so there is nothing to update.
            return res.status(404).json({
                message: "Unable to update a reservation that doesn't exist.",
            });
        }

        return res.status(200).json({
            message: 'The update was successful!',
        });
    } catch (error) {
        console.log(
            'DEBUG: Error encountered while updating the reservation...'
        );
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});

//Makes a request to the database in order to update the lastname of
//the reservation entry.
//Expects an application/json with the following fields (@params) :
//  @param payload : (application/json) : {
//      _id: (ObjectID) : The mongodb objectID for the item to upate.
//      firstName: (String) : The new value of the field.
//}
app.post('/api/reservations/update/lastName', async (req, res) => {
    try {
        //First validate that the post payload contains the proper fields.
        if (!req.body.id) {
            return res.status(400).json({
                message:
                    "The 'id' field is missing from the POST body payload. ",
            });
        }
        if (!req.body['lastName']) {
            return res.status(400).json({
                message:
                    "The 'lastName' field is missing from the POST body payload. ",
            });
        }

        //Then attempt to perform the update query.
        const result = await Reservation.findByIdAndUpdate(
            req.body.id,
            {
                lastName: req.body['lastName'],
            },
            { runValidators: true }
        ).exec();

        if (result === null) {
            //The item is not found, so there is nothing to update.
            return res.status(404).json({
                message: "Unable to update a reservation that doesn't exist.",
            });
        }

        return res.status(200).json({
            message: 'The update was successful!',
        });
    } catch (error) {
        console.log(
            'DEBUG: Error encountered while updating the reservation...'
        );
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});

//Makes a request to the database in order to update the email of
//the reservation entry.
//Expects an application/json with the following fields (@params) :
//  @param payload : (application/json) : {
//      _id: (ObjectID) : The mongodb objectID for the item to upate.
//      email: (String) : The new value of the field.
//}
app.post('/api/reservations/update/email', async (req, res) => {
    try {
        //First validate that the post payload contains the proper fields.
        if (!req.body.id) {
            return res.status(400).json({
                message:
                    "The 'id' field is missing from the POST body payload. ",
            });
        }
        if (!req.body['email']) {
            return res.status(400).json({
                message:
                    "The 'email' field is missing from the POST body payload. ",
            });
        }

        //Then attempt to perform the update query.
        const result = await Reservation.findByIdAndUpdate(
            req.body.id,
            {
                email: req.body['email'],
            },
            { runValidators: true }
        ).exec();

        if (result === null) {
            //The item is not found, so there is nothing to update.
            return res.status(404).json({
                message: "Unable to update a reservation that doesn't exist.",
            });
        }

        return res.status(200).json({
            message: 'The update was successful!',
        });
    } catch (error) {
        console.log(
            'DEBUG: Error encountered while updating the reservation...'
        );
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});

//Makes a request to the database in order to update the phoneNumber of
//the reservation entry.
//Expects an application/json with the following fields (@params) :
//  @param payload : (application/json) : {
//      _id: (ObjectID) : The mongodb objectID for the item to upate.
//      phoneNumber: (String) : The new value of the field.
//}
app.post('/api/reservations/update/phoneNumber', async (req, res) => {
    try {
        //First validate that the post payload contains the proper fields.
        if (!req.body.id) {
            return res.status(400).json({
                message:
                    "The 'id' field is missing from the POST body payload. ",
            });
        }
        if (!req.body['phoneNumber']) {
            return res.status(400).json({
                message:
                    "The 'phoneNumber' field is missing from the POST body payload. ",
            });
        }

        //Then attempt to perform the update query.
        const result = await Reservation.findByIdAndUpdate(
            req.body.id,
            {
                phoneNumber: req.body['phoneNumber'],
            },
            { runValidators: true }
        ).exec();

        if (result === null) {
            //The item is not found, so there is nothing to update.
            return res.status(404).json({
                message: "Unable to update a reservation that doesn't exist.",
            });
        }

        return res.status(200).json({
            message: 'The update was successful!',
        });
    } catch (error) {
        console.log(
            'DEBUG: Error encountered while updating the reservation...'
        );
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});

//Makes a request to the database in order to update the date of
//the reservation entry.
//Expects an application/json with the following fields (@params) :
//  @param payload : (application/json) : {
//      _id: (ObjectID) : The mongodb objectID for the item to upate.
//      date: (Date) : The new value of the field.
//}
app.post('/api/reservations/update/date', async (req, res) => {
    try {
        //First validate that the post payload contains the proper fields.
        if (!req.body.id) {
            return res.status(400).json({
                message:
                    "The 'id' field is missing from the POST body payload. ",
            });
        }
        if (!req.body['date']) {
            return res.status(400).json({
                message:
                    "The 'date' field is missing from the POST body payload. ",
            });
        }

        //Then attempt to perform the update query.
        const result = await Reservation.findByIdAndUpdate(
            req.body.id,
            {
                date: req.body['date'],
            },
            { runValidators: true }
        ).exec();

        if (result === null) {
            //The item is not found, so there is nothing to update.
            return res.status(404).json({
                message: "Unable to update a reservation that doesn't exist.",
            });
        }

        return res.status(200).json({
            message: 'The update was successful!',
        });
    } catch (error) {
        console.log(
            'DEBUG: Error encountered while updating the reservation...'
        );
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});

//Makes a request to the database in order to update the tableId of
//the reservation entry.
//Expects an application/json with the following fields (@params) :
//  @param payload : (application/json) : {
//      _id: (ObjectID) : The mongodb objectID for the item to upate.
//      tableId: (Number) : The new value of the field.
//}
app.post('/api/reservations/update/tableId', async (req, res) => {
    try {
        //First validate that the post payload contains the proper fields.
        if (!req.body.id) {
            return res.status(400).json({
                message:
                    "The 'id' field is missing from the POST body payload. ",
            });
        }
        if (!req.body['tableId']) {
            return res.status(400).json({
                message:
                    "The 'tableId' field is missing from the POST body payload. ",
            });
        }

        //Then attempt to perform the update query.
        const result = await Reservation.findByIdAndUpdate(
            req.body.id,
            {
                tableId: req.body['tableId'],
            },
            { runValidators: true }
        ).exec();

        if (result === null) {
            //The item is not found, so there is nothing to update.
            return res.status(404).json({
                message: "Unable to update a reservation that doesn't exist.",
            });
        }

        return res.status(200).json({
            message: 'The update was successful!',
        });
    } catch (error) {
        console.log(
            'DEBUG: Error encountered while updating the reservation...'
        );
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});

//Makes a request to the database in order to update the seats  of
//the reservation entry.
//Expects an application/json with the following fields (@params) :
//  @param payload : (application/json) : {
//      _id: (ObjectID) : The mongodb objectID for the item to upate.
//       seats: (Number) : The new value of the field.
//}
app.post('/api/reservations/update/seats', async (req, res) => {
    try {
        //First validate that the post payload contains the proper fields.
        if (!req.body.id) {
            return res.status(400).json({
                message:
                    "The 'id' field is missing from the POST body payload. ",
            });
        }
        if (!req.body['seats']) {
            return res.status(400).json({
                message:
                    "The 'seats' field is missing from the POST body payload. ",
            });
        }

        //Then attempt to perform the update query.
        const result = await Reservation.findByIdAndUpdate(
            req.body.id,
            {
                seats: req.body['seats'],
            },
            { runValidators: true }
        ).exec();

        if (result === null) {
            //The item is not found, so there is nothing to update.
            return res.status(404).json({
                message: "Unable to update a reservation that doesn't exist.",
            });
        }

        return res.status(200).json({
            message: 'The update was successful!',
        });
    } catch (error) {
        console.log(
            'DEBUG: Error encountered while updating the reservation...'
        );
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});

//Makes a request to the database in order to update the status  of
//the reservation entry.
//Expects an application/json with the following fields (@params) :
//  @param payload : (application/json) : {
//      _id: (ObjectID) : The mongodb objectID for the item to upate.
//       status: (String) : The new value of the field.
//}
app.post('/api/reservations/update/status', async (req, res) => {
    try {
        //First validate that the post payload contains the proper fields.
        if (!req.body.id) {
            return res.status(400).json({
                message:
                    "The 'id' field is missing from the POST body payload. ",
            });
        }
        if (!req.body['status']) {
            return res.status(400).json({
                message:
                    "The 'status' field is missing from the POST body payload. ",
            });
        }

        //Then attempt to perform the update query.
        const result = await Reservation.findByIdAndUpdate(
            req.body.id,
            {
                status: req.body['status'],
            },
            { runValidators: true }
        ).exec();

        if (result === null) {
            //The item is not found, so there is nothing to update.
            return res.status(404).json({
                message: "Unable to update a reservation that doesn't exist.",
            });
        }

        return res.status(200).json({
            message: 'The update was successful!',
        });
    } catch (error) {
        console.log(
            'DEBUG: Error encountered while updating the reservation...'
        );
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});

//Makes a request to the database in order to update the notes  of
//the reservation entry.
//Expects an application/json with the following fields (@params) :
//  @param payload : (application/json) : {
//      _id: (ObjectID) : The mongodb objectID for the item to upate.
//       notes: (String) : The new value of the field.
//}
app.post('/api/reservations/update/notes', async (req, res) => {
    try {
        //First validate that the post payload contains the proper fields.
        if (!req.body.id) {
            return res.status(400).json({
                message:
                    "The 'id' field is missing from the POST body payload. ",
            });
        }
        if (!req.body['notes']) {
            return res.status(400).json({
                message:
                    "The 'notes' field is missing from the POST body payload. ",
            });
        }

        //Then attempt to perform the update query.
        const result = await Reservation.findByIdAndUpdate(
            req.body.id,
            {
                notes: req.body['notes'],
            },
            { runValidators: true }
        ).exec();

        if (result === null) {
            //The item is not found, so there is nothing to update.
            return res.status(404).json({
                message: "Unable to update a reservation that doesn't exist.",
            });
        }

        return res.status(200).json({
            message: 'The update was successful!',
        });
    } catch (error) {
        console.log(
            'DEBUG: Error encountered while updating the reservation...'
        );
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});

//Makes a request to soft-delete the reservation. This updates the
//status field in the reservation to "deleted".
//Expects an application/json with the following fields (@params) :
//  @param payload : (application/json) : {
//      _id: (ObjectID) : The mongodb objectID for the item to upate.
//}
app.post('/api/reservations/delete', async (req, res) => {
    try {
        //First validate that the post payload contains the proper fields.
        if (!req.body.id) {
            return res.status(400).json({
                message:
                    "The 'id' field is missing from the POST body payload. ",
            });
        }

        //Then attempt to perform the delete query.
        const result = await Reservation.findByIdAndUpdate(
            req.body.id,
            {
                status: 'deleted',
            },
            { runValidators: true }
        ).exec();

        if (result === null || result.status === 'deleted') {
            //The item is not found, so there is nothing to update. Although
            //in this case, the item can already be marked as "deleted"
            //and so we give the impression that the reservation was
            //already deleted.
            return res.status(404).json({
                message: "Unable to delete a reservation that doesn't exist.",
            });
        }

        return res.status(200).json({
            message: 'Reservation deleted',
        });
    } catch (error) {
        console.log(
            'DEBUG: Error encountered while deleting the reservation...'
        );
        console.log(error);
        return res.status(400).json({
            message: error.message,
        });
    }
});

//Define the function to generate placeholder data.
const generateSampleReservations = () => {
    const reservations = [];

    for (let i = 0; i < 100; i++) {
        // Times should range from 00:00 to 23:59
        const start_heure = Math.trunc(Math.random() * 23);
        const start_minutes = Math.trunc(Math.random() * 59);
        const end_heure =
            Math.trunc(Math.random() * (23 - start_heure)) + start_heure;
        const end_minutes =
            end_heure === start_heure
                ? Math.trunc(Math.random() * (59 - start_minutes)) +
                  start_minutes
                : Math.trunc(Math.random() * 59);

        reservations.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phoneNumber: faker.phone.number(),
            date: faker.date.soon({ days: 7 }),
            startTime: `${start_heure}:${start_minutes}`,
            endTime: `${end_heure}:${end_minutes}`,
            notes: faker.lorem.sentence(),
            tableId: Math.trunc(Math.random() * 10),
            status: 'active',
        });
    }

    return reservations;
};

//First, try to establish a connection to the database before starting
//the server.
mongoose
    .connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
    .then(
        (resolved) => {
            console.log('Successfully connected to the MongoDB Database');

            //Since the server successfully connected to the database, we
            //can start the server now.
            app.listen(port, async () => {
                console.log(`Server is now listening on port ${port}.`);

                //await Reservation.insertMany(generateSampleReservations());
                //console.log('Created 100 new sample reservations.');

                //Try to insert an entry into the database.
                //await new Reservation({
                //    firstName: 'John',
                //    lastName: 'Doe',
                //    email: 'johndoe@email.com',
                //    phoneNumber: '18009999999',
                //    notes: 'This is an example reservation entry...',
                //    status: 'active',
                //}).save();
            });
        },
        (rejected) => {
            console.log('Failed to connect to the MongoDB Database');
        }
    )
    .catch((error) => {
        console.log(
            'An error occurred while connecting to the MongoDB Database :'
        );
        console.log(error);
    });
