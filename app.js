const express = require('express');
const dotenv = require('dotenv');

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

//Setup the database context.
const db = require('./database_context.js');
db.initialize(process.env.DB_URL, process.env.DB_NAME);

//Setup API routing.
app.get('/', (request, response) => {
    response.json({
        content: 'Hello!',
    });
});

app.get('/api/projects/get-all', async (request, response) => {
    const projects = await db.getProjects();

    response.json({
        content: projects,
    });
});

app.get('/api/skills/get-all', async (request, response) => {
    const projects = await db.getSkills();

    response.json({
        content: projects,
    });
});

//Start the server.
app.listen(port, () => {
    console.log(`Server is now listening on port ${port}.`);
});
