# Humber Capstone Backend API

This repository contains the backend API for the Humber 2024 Summer Capstone project as part of the Web Development program.

The backend is built using the MERN stack and uses MongoDB Atlas as the database.

# API Routes

Here are a list of currently implemented routes for the API.

&nbsp;

## GET: / (Index)

Prints the current status of the backend API.
RETURNS 200 on success.

## GET: /api/reservations/fetch/all

Queries the database to fetch all the reservations stored inside.
RETURNS 200 on success, along with JSON containing the reservations.

## GET: /api/reservations/fetch?

Queries the database according to the filter specified by the query parameters.

-   startDate : (int) a unix timestamp to pass into the Date constructor.
-   endDate : (int) see above.
-   status : (string) any one of the allowed string values to filter by \["requires-approval", "reserved", "deleted"\]
    RETURNS 200 on success, along with JSON containing the reservations.

## POST: /api/reservations/create

Makes a request to the database in order to create a new Reservation.

-   POST_payload : (application/json) a JSON string containing the required keys to create a reservation object with.
    RETURNS 201 on success, 400 otherwise

## POST: /api/reservations/request

Alternate create route intended to be exposed to the public for website integration and creating "Reservation Requests".

-   POST_payload : (application/json) a JSON string containing the required keys to create a reservation object with.
    RETURNS 201 on success, 400 otherwise

## POST: /api/reservations/update/{FIELD_NAME}

Makes a request to the database in order to update the specified FIELD_NAME of the reservation entry.

-   POST_payload : (application/json) a JSON string containing the objectID and new FIELD_NAME and VALUE to update the reservation to.
    RETURNS 200 on success, 400 otherwise

## POST: /api/reservations/delete

Makes a request to soft-delete the reservation. This updates the status field in the reservation to "deleted".

-   POST_payload : (application/json) a JSON string containing the objectID of the reservation to delete.
    RETURNS 200 on success, 404 if the doesn't exist, 400 otherwise

&nbsp;

# Live Demo

The API is currently hosted using the Render Serverless Hosting Platform. [Click here to visit the API endpoint](https://capstone-backend-api-zqnd.onrender.com/).

NOTE: Due to Render's free tier, there is a short 1-2 minute boot up time for the server.
