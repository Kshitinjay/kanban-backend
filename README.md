# Kanban Backend

This is the **backend (server)** for a Kanban app — the part that stores data and decides who is allowed to do what. The frontend (the screens users see) talks to this server to log in, create tickets, move them between columns, add comments, and so on.

Think of it like a restaurant: the frontend is the dining area where customers sit, and this backend is the kitchen that prepares and stores everything. Customers never enter the kitchen directly — they send orders (requests), and the kitchen sends back food (responses).

---

## 1. What can this app do?

- **Users can sign up and log in.** Passwords are stored safely (scrambled, never as plain text).
- **Tickets** (tasks) can be created, viewed, edited, commented on, and deleted.
- **Two kinds of users** with different powers:
  - **Admin** — can do everything.
  - **Member** — a normal user with limited powers (e.g. can only edit tickets assigned to them).
- The server **enforces these rules itself**, so even if someone bypasses the website, they still can't do something they're not allowed to.

---

## 2. Tech stack (the tools used)

| Tool | What it does (in plain words) |
| ---- | ----------------------------- |
| **Node.js** | Lets us run JavaScript on a server (not just in a browser). |
| **Express 5** | Handles incoming requests and sends back responses. |
| **MongoDB** | The database — where all users and tickets are stored. |
| **Mongoose** | A helper that makes talking to MongoDB easier and adds rules/validation. |
| **JWT (jsonwebtoken)** | A digital "wristband" that proves who you are after you log in. |
| **bcryptjs** | Scrambles passwords so they're safe even if someone sees the database. |
| **cors** | Lets the frontend (on a different address) talk to this server. |
| **dotenv** | Loads secret settings from a `.env` file. |

---

## 3. What you need before starting

- [Node.js](https://nodejs.org/) version 18 or newer.
- [MongoDB](https://www.mongodb.com/) running on your computer at `localhost:27017`.
  - Tip: [MongoDB Compass](https://www.mongodb.com/products/compass) is a free visual tool to see/edit the data.

---

## 4. How to run it (step by step)

1. **Install the dependencies** (downloads the tools listed above):

   ```bash
   npm install
   ```

2. **Create a `.env` file** in the project root with these settings:

   ```
   JWT_SECRET=any-long-random-secret-text
   JWT_EXPIRES_IN=1d
   CLIENT_URL=http://localhost:5173
   ```

   - `JWT_SECRET` — a private password the server uses to sign login tokens. Keep it secret.
   - `JWT_EXPIRES_IN` — how long a login stays valid (`1d` = 1 day).
   - `CLIENT_URL` — the address of the frontend that's allowed to talk to this server.

3. **Make sure MongoDB is running.** The server connects to:

   ```
   mongodb://localhost:27017/kanban-backend
   ```

4. **Start the server:**

   ```bash
   node server.js
   ```

   You should see `Server started`. It runs at **http://localhost:3000**.

---

## 5. Project structure (where things live)

```
kanban-backend/
├── server.js                      # Starting point — wires everything together
├── .env                           # Secret settings (not shared in git)
└── src/
    ├── config/
    │   └── dbConnection.js        # Connects to the MongoDB database
    ├── middleware/
    │   └── auth.js                # Checks the login token on each request
    ├── models/
    │   ├── userScheme.js          # Shape of a "user" record
    │   └── ticketSchema.js        # Shape of a "ticket" record (and its comments)
    └── routes/
        ├── authRoutes.js          # Login & sign up
        ├── userRoutes.js          # Everything about users
        └── ticketRoutes.js        # Everything about tickets
```

**What is "middleware"?** A checkpoint that runs *before* a request reaches its handler. Here, `auth.js` is a security guard: it checks your login token and, if valid, lets the request through.

---

## 6. How login & security work

1. You **log in** with email + password → the server checks them and gives you a **token** (a long string).
2. For every protected action, you must **send that token** in the request header:

   ```
   Authorization: Bearer <your-token>
   ```

3. The server reads the token, figures out **who you are** and **your role** (admin/member), and then decides if you're allowed.

> The token already knows who you are — so you never send your user id in the request. This also prevents cheating (you can't pretend to be someone else).

**Only two actions are public** (no token needed): **Sign Up** and **Log In**. Everything else requires a token.

---

## 7. Who can do what (Permission Matrix)

| Action | Admin | Member |
| ------ | :---: | :----: |
| Sign Up | ✅ | ✅ |
| View Users | ✅ | ✅ |
| Update Own Profile | ✅ | ✅ |
| Update Any User | ✅ | ❌ |
| Delete User | ✅ | ❌ |
| View All Tickets | ✅ | ✅ |
| Create Ticket | ✅ | ✅ |
| View Ticket Details | ✅ | ✅ |
| Comment on Ticket | ✅ | ✅ |
| Edit Assigned Ticket | ✅ | ✅ |
| Edit Unassigned Ticket | ✅ | ❌ |
| Delete Ticket | ✅ | ❌ |
| Assign Ticket | ✅ | ✅ (only while they are the current assignee) |

If a member tries something they can't do, the server replies with **403 Forbidden**.

---

## 8. API endpoints (the full list)

Base address: `http://localhost:3000`

### Auth (public — no token needed)

| Method | Endpoint | What it does |
| ------ | -------- | ------------ |
| POST | `/register` | Create a new account (always a "member"). |
| POST | `/login` | Log in, get a token. |

### Users (login required)

| Method | Endpoint | Who can use it |
| ------ | -------- | -------------- |
| GET | `/users` | Any logged-in user — list all users. |
| GET | `/users/get-user/:id` | Any logged-in user — one user's details. |
| PUT | `/users/update-user/:id` | Yourself, or an admin for anyone. |
| PUT | `/users/reset-password/:id` | Yourself, or an admin for anyone. |
| DELETE | `/users/delete-user/:id` | Admin only. |

### Tickets (login required)

| Method | Endpoint | Who can use it |
| ------ | -------- | -------------- |
| GET | `/tickets` | Any logged-in user — list all tickets. |
| GET | `/tickets/get-ticket/:id` | Any logged-in user — one ticket's details. |
| POST | `/tickets/add-ticket` | Any logged-in user. |
| PUT | `/tickets/update-ticket/:id` | Admin, or the member it's assigned to. |
| PUT | `/tickets/add-comment/:id` | Any logged-in user. |
| DELETE | `/tickets/delete-ticket/:id` | Admin only. |

> `:id` means "put the actual id here", e.g. `/tickets/get-ticket/a1000000-0000-4000-8000-000000000001`.

---

## 9. What the data looks like

### A User

```json
{
  "id": "da4e35c1-8c2d-423f-9657-48d95979c3ae",
  "name": "Kshitinjay",
  "email": "kshitinjay@gmail.com",
  "role": "admin",
  "createdAt": "2026-06-21T17:28:11.534Z",
  "updatedAt": "2026-06-21T17:28:11.534Z"
}
```

The **password is never sent back** in responses — it's hidden for safety.

### A Ticket

```json
{
  "id": "a1000000-0000-4000-8000-000000000001",
  "title": "Set up project repository",
  "description": "Initialize repo, add README and base config.",
  "status": "Todo",
  "priority": "Medium",
  "assignee": "Amit Verma",
  "assigneeId": "cacbdc6d-d0f1-42ae-a5c7-22aff88ba202",
  "reporter": "Kshitinjay",
  "reporterId": "da4e35c1-8c2d-423f-9657-48d95979c3ae",
  "comments": [
    {
      "id": "…",
      "text": "Looks good!",
      "author": "Amit Verma",
      "userId": "cacbdc6d-…",
      "createdAt": "2026-06-22T10:00:00.000Z"
    }
  ],
  "createdAt": "2026-06-20T09:00:00.000Z",
  "updatedAt": "2026-06-20T09:00:00.000Z"
}
```

- `status` is one of: `Todo`, `In Progress`, `Done`.
- `priority` is one of: `Low`, `Medium`, `High`, `Critical`.
- `assignee` / `reporter` are **names** (for display); `assigneeId` / `reporterId` are the matching **user ids** (used to decide permissions).

---

## 10. Quick test (using Postman or similar)

1. **Register:** `POST /register` with body `{ "name": "Test", "email": "test@example.com", "password": "123456" }`.
2. **Log in:** `POST /login` with the same email/password → copy the `token` from the response.
3. **Use a protected route:** `GET /tickets` and add the header `Authorization: Bearer <token>` → you should get the list.
4. Without the token, the same request returns **401 Unauthorized**.

---

## 11. Good to know (common gotchas)

- **Adding data directly in Compass skips the safety rules.** If you paste a user straight into the database, the password won't be scrambled and login will fail. Always create users through `POST /register`.
- **One admin to start.** New sign-ups are always `member`. To get your first admin, change one user's `role` to `"admin"` in Compass.
- **Tokens expire** after the time in `JWT_EXPIRES_IN` (default 1 day). After that, log in again.
- **The `.env` file is secret** and is not committed to git (it's in `.gitignore`).

---

## License

ISC © kshitinjay kumar
