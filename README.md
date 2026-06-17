# Kanban Backend

Backend server for the Kanban app, built with Node.js, Express, and MongoDB (via Mongoose).

## Tech Stack

- **Node.js** + **Express 5** — HTTP server
- **MongoDB** + **Mongoose** — database and ODM
- **nodemon** — development auto-reload

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- A running [MongoDB](https://www.mongodb.com/) instance on `localhost:27017`

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Make sure MongoDB is running locally. The server connects to:

   ```
   mongodb://localhost:27017/kanban-backend
   ```

3. Start the server:

   ```bash
   node server.js
   ```

   The server runs on [http://localhost:3000](http://localhost:3000).

## Project Structure

```
kanban-backend/
├── server.js         # Express app entry point and routes
├── dbConnection.js   # MongoDB connection setup
└── package.json
```

## API

| Method | Endpoint | Description           |
| ------ | -------- | --------------------- |
| GET    | `/`      | Health check / status |

## License

ISC © kshitinjay kumar
