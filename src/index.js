const express = require("express");

const app = express();

app.get("/", (request, response) => {
  return response.json({ message: "Hello world ignite - testee" });
});

app.listen(3333);