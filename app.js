import express from 'express';
import dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose';
import Reservation from './model/Reservation.js';

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
            reservations: tout_reservations,
        });
    } else {
        //Otherwise, indicate that there is nothing to return (204 No Content)
        res.status(204);
    }
});

//app.get('/api/projects/get-all', async (request, response) => {
//    const projects = await db.getProjects();
//
//    response.json({
//        content: projects,
//    });
//});
//
//app.get('/api/skills/get-all', async (request, response) => {
//    const projects = await db.getSkills();
//
//    response.json({
//        content: projects,
//    });
//});

//First, try to establish a connection to the database before starting
//the server.
mongoose
    .connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
    .then(
        resolved => {
            console.log('Successfully connected to the MongoDB Database');

            //Since the server successfully connected to the database, we
            //can start the server now.
            app.listen(port, async () => {
                console.log(`Server is now listening on port ${port}.`);

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
        rejected => {
            console.log('Failed to connect to the MongoDB Database');
        }
    )
    .catch(error => {
        console.log(
            'An error occurred while connecting to the MongoDB Database :'
        );
        console.log(error);
    });
