Authentication server app built with Better Auth, Express.js, and Prisma.

## Features

This server app features API endpoints that support fundamental authentication functions such as sign up, sign in and sign out. User may choose to sign in with email or username. The app also implements server-side user input verification.

## Deployment

Please follow these instructions.

### Prerequisites

1. Two running local PostgreSQL servers: one for deployment and the other for testing

2. pnpm

3. This [Frontend Client](https://github.com/jlk-zhou/better-auth-basic-client-template) (optional)

### Steps

1. Clone this repository and navigate into it:

```
git clone git@github.com:jlk-zhou/better-auth-basic-server-template.git
cd server
```

2. Install all dependencies:

```
pnpm install
```

3. Configure environment variables such as URL for your development and test databases, and client url if you have one, as per `.env.example`.

4. Run the following command to bootstrap your databases:

```
pnpm run db-init
```

5. (Optional) Verify whether the bootstrap is successful on both development and test databases. To verify development database, start Prisma studio, which allows you to visualise the server's development database, by running

```
npx prisma studio
```

to verify that you have indeed populated the development with tables. You should at least see these tables:

* User

* Session

* Account

Now, shut down Prisma studio, go to your `.env` file and change `NODE_ENV` to `"test"` and restart Prisma studio. You should see the same thing for your test database as for your development one. After that, don't for get to change `NODE_ENV` back to `"development"`.

6. Run

```
pnpm start
```

to start the server. You should see

```
Better Auth Template App - listening on port 3000
```

appearing in your console. This indicates that the server can now receive requests and return responses.

## Usage

This server app uses Better Auth's API endpoints for authentication. All endpoints start with `/api/auth/{*}`. For this server, these Better Auth API endpoints have been built and tested and are available:

```
POST /sign-up/email
POST /sign-in/email
POST /sign-in/username
GET  /get-session
POST /sign-out
```

Please refer to [Better Auth docs](https://better-auth.com/docs/introduction) for details.

You may call these endpoints, or connect the server app with the [frontend client](https://frontend) that it is meant to power.

## Dependencies

Key packages that are used to build this server app include:

* Framework: Express.js

* Auth: Better Auth

* Database and ORM: PostgreSQL, Prisma

* Server-side verification: Zod

* Type safety: Typescript

* Unit and integration testing: Jest, Supertest

* Linter: ESLint, Prettier

* Compiler: Babel
