# Splitwise Clone

A full-stack expense sharing app built in public over 15 days. One backend, two clients: a React web app and a Flutter mobile app, both talking to the same REST API.

Track shared expenses with friends and groups, split bills three different ways, see who owes whom, and settle up.

> Status: backend in progress (Day 5 of 15). Web and mobile clients are planned. See the [progress log](#progress-log).

## Features

**Done**
- JWT authentication (register, login, protected routes) with zod validation
- Groups: create a group, add members, list your groups, view group details
- Friends: add a friend by email, plus a friends list that merges people from shared groups and direct adds
- Expenses with server side validation (group membership, payer, participants)
- Three split types: equal, exact amount, and percentage
- Group expense history, newest first, with payer and split users populated

**Planned**
- Balance calculation per group
- Debt simplification (fewest payments to settle everyone)
- Settle up and an activity feed
- React web app and Flutter mobile app

## Architecture

```mermaid
flowchart LR
    Web["Web app<br/>React + TypeScript + Redux Toolkit"] --> API
    Mobile["Mobile app<br/>Flutter"] --> API
    API["REST API<br/>Node.js + Express + TypeScript"] --> DB[("MongoDB Atlas")]
```

Both clients use the same API, so all business rules (split math, validation, permissions) live on the server only.

## Tech stack

| Layer | Choice |
|---|---|
| Backend | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB Atlas |
| Auth | JWT and bcrypt |
| Validation | zod |
| Testing | Jest and ts-jest |
| Web (planned) | React, TypeScript, Redux Toolkit, React Router, Tailwind |
| Mobile (planned) | Flutter |

## The split engine

The most interesting part of the project. All money math is done in integer cents, never in decimals, so totals always reconcile exactly.

| Type | Client sends | Server does |
|---|---|---|
| Equal | participants | divides the total fairly among them |
| Exact | an amount per person | checks the amounts add up to the total |
| Percentage | a percentage per person | checks they add up to 100, converts to amounts |

**Why integer cents.** In JavaScript, `0.1 + 0.2` is `0.30000000000000004`, and splitting 10.00 three ways with plain rounding gives 3.33 x 3 = 9.99, so a cent disappears. Working in cents makes the leftover visible so it can be assigned on purpose.

**Equal split.** 10.00 among 3 people is 1000 cents. Each person gets 333, and the 1 leftover cent goes to the first person: 3.34, 3.33, 3.33.

**Percentage split.** Percentages are converted to basis points (33.33% becomes 3333) so they can be summed exactly. Each share is floored to whole cents, then the missing cents are given to the people with the largest fractional remainders (the largest remainder method). Example: 20.00 split 33.33 / 33.33 / 33.34 gives 6.67, 6.66, 6.67.

The calculator is a set of pure functions (no database, no Express), which makes them easy to unit test. Every result is checked to sum exactly to the total before it is saved.

Currency is fixed to USD for now.

## Getting started

### Prerequisites
- Node.js 18 or newer
- A MongoDB Atlas cluster (the free tier works)

### Setup

```bash
git clone [your-repo-url]
cd [repo-folder]/backend
npm install
cp .env.example .env
```

Fill in `.env`:

```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret
```

### Run

```bash
npm run dev      # start the server with auto reload
npm test         # run the unit tests
```

Check that it works: `GET http://localhost:5000/api/health` should return a 200.

## API overview

All routes are under `/api`. Everything except register and login needs an `Authorization: Bearer <token>` header.

**Auth**

| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in and receive a JWT |
| GET | `/auth/me` | Current user |

**Groups**

| Method | Route | Description |
|---|---|---|
| POST | `/groups` | Create a group |
| GET | `/groups` | List your groups |
| GET | `/groups/:id` | Group details with members |
| POST | `/groups/:id/members` | Add a member |
| GET | `/groups/:id/expenses` | Expenses in a group, newest first |

**Friends**

| Method | Route | Description |
|---|---|---|
| POST | `/friends/add` | Add a friend by email |
| GET | `/friends` | List your friends |

**Expenses**

| Method | Route | Description |
|---|---|---|
| POST | `/expenses` | Create an expense (equal, exact, or percentage) |

Example, equal split between two of three group members:

```json
{
  "description": "Taxi",
  "amount": 30,
  "groupId": "<group id>",
  "paidBy": "<user id>",
  "splitType": "equal",
  "participants": ["<user id>", "<user id>"]
}
```

Example, percentage split:

```json
{
  "description": "Rent",
  "amount": 1000,
  "groupId": "<group id>",
  "paidBy": "<user id>",
  "splitType": "percentage",
  "splits": [
    { "user": "<user id>", "percentage": 50 },
    { "user": "<user id>", "percentage": 30 },
    { "user": "<user id>", "percentage": 20 }
  ]
}
```

A Postman collection is saved in `/backend/postman`.

## Project structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/         database connection
│   │   ├── models/         Mongoose schemas
│   │   ├── types/          shared TypeScript types
│   │   ├── controllers/    request handlers
│   │   ├── routes/         route definitions
│   │   ├── middlewares/    auth and validation
│   │   ├── validations/    zod schemas
│   │   ├── utils/          split calculator and helpers
│   │   ├── app.ts          Express app setup
│   │   └── server.ts       entry point
│   └── postman/
├── web/                    planned
└── mobile/                 planned
```

## Progress log

| Day | What shipped |
|---|---|
| 1 | Repo setup, data models, Express and TypeScript server connected to MongoDB Atlas |
| 2 | Auth: register, login, JWT middleware, zod validation |
| 3 | Groups and friends |
| 4 | Expense model, equal split, group expenses endpoint |
| 5 | Exact and percentage splits, split calculator tests |

## Roadmap

1. Balance engine and debt simplification
2. Settle up and activity feed
3. React web app
4. Flutter mobile app
5. Deploy backend (Render or Railway or AWS) and web (Vercel)
