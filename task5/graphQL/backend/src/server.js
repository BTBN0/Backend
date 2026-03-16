const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema");
const root = require("./resolver");

const app = express();

app.use(cors());

app.use(
    "/graphql",
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
);

app.listen(4000, () => {
    console.log("🚀 Server running at http://localhost:4000/graphql");
});