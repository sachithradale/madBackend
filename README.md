# Madhack 2024 - Initial Round Backend Api

clone the repo and run the below commands in your terminal to start the API

```bash
npm install or yarn install
npm run dev or yarn dev
```

## Postman Collection

This API has a Postman collection that can be used to test the API. The collection can be found [here](https://api.postman.com/collections/20109264-88647060-0ab8-414d-8c7c-d27bcc60cce4?access_key=PMAT-01HPF0V7S7TG7AAJQFN86271A0). Some of the endpoints are demonstrated in this collection. 

## Environment Variables

The following environment variables are required to run the API. They can be set in a `.env` file in the root of the project. The following is a sample `.env` file with all the required variables.

#### Database Options

- `DB_CONNECTION` - The connection string for the MongoDB database. If not provided, the API will use an in-memory database.
- Alternatively  a free MongoDB cluster can be created easily at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Copy and paste the connection string into the `.env` file. This option is recommended.

#### Database Seeding

- `DB_SEED` - If set to `true`, the database will be seeded with sample initial data. This is useful for development and testing.

```bash
#express
PORT=4000

# client urls
API_URL=http://localhost:4000

# mongodb
DB_CONNECTION=<mongodb connection string>||memory

# other
NODE_ENV=test
DB_SEED=false
ENCRYPT_KEY=<32 character string>
HASH=<128 character string>
HASH_REFRESH=<128 character string>
```
