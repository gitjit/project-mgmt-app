const express = require("express");
const colors = require("colors");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
require("dotenv").config();
const port = process.env.PORT || 6000;
const schema = require("../server/schema/schema.js");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
// Connect to MongoDB
connectDB();

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development",
  })
);

app.listen(port, console.log(`App listening on port : ${port}`));
