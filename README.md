# Express-Drizzle-PostgreS

A opinionated starter template for building REST APIs with Express, Drizzle ORM and PostgreSQL.


## API Documentation

### `GET /user`

Returns the user. Requires `jwt token` in the request header.

### `PUT /user/update`

Updates the user. Requires `jwt token` in the request header.

User can only update themselves. Properties that can be updated are `name`, `email` and `password`.

if `email` is updated, the user will be unverified and a new verification email will be sent.

### `POST /user/create`

Creates a new user. Requires `name`, `email` and `password` in the request body.


### `DELETE /user/remove`

Removes the user. Requires `jwt token` in the request header.

A user can only remove themselves.
A admin can remove any user.

### `POST /user/login`

Logs in the user. Requires `email` and `password` in the request body.

### `GET /admin/all-users`

Returns all users. It is an admin route, requires `jwt token`.

### `GET /admin/all-verfied-users`

Returns all verified users. It is an admin route, requires `jwt token`.

### `DELETE /admin/remove-unverified-users`

Removes all unverified users. It is an admin route, requires `jwt token`.

### Running the app

Install the dependencies

```bash
npm install
```
Run the development server:

```bash
npm run dev
```