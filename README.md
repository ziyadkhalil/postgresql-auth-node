# postgresql-auth-node

## Setup

1. Add database.json in root

   Example `database.json`:

   ```
   {
       "dev": {
           "driver": "pg",
           "database": "classroom",
           "host": "127.0.0.1",
           "port": "5432",
           "user": "node-app",
           "password": "password"
       },
       "test": {
           "driver": "pg",
           "database": "classroom_test",
           "host": "127.0.0.1",
           "port": "5432",
           "user": "node-app",
           "password": "password"
       }
   }
   ```

2. add `.env` file

   Example .env:

   ```
   POSTGRES_HOST=127.0.0.1
   POSTGRES_DB=classroom
   POSTGRES_TEST_DB=classroom_test
   ENV=dev
   POSTGRES_USER=node-app
   POSTGRES_PASSWORD=password
   BCRYPT_PASSWORD=my_pepper
   TOKEN_SECRET=my_secret123
   SALT_ROUNDS=10
   ```

3. Create dev and test database with names given in `.env` and `database.json`

---

## Run

    yarn && yarn watch

---

## Test

    yarn build && yarn test
