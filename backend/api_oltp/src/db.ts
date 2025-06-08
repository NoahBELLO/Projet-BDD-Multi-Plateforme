import { Client } from "pg";

const client = new Client({
    host: process.env.PostgreSql_Host,
    database: process.env.PostgreSql_Database,
    user: process.env.PostgreSql_User,
    password: process.env.PostgreSql_Password
});

client.connect();
export default client;