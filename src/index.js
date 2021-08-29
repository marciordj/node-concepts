const express = require("express");
const { v4: uuidV4 } = require("uuid");

const app = express();

app.use(express.json());

const costumers = [];

app.post("/account", (request, response) => {
  const { cpf, name } = request.body; //pega os dados do body da requisição

  const customerAlreadyExist = costumers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExist) {
    return response
      .status(400)
      .json({ error: "Esse usuário já está cadastrado" });
  }

  costumers.push({
    cpf,
    name,
    id: uuidV4(),
    statement: [],
  });

  return response.status(201).send();
});

app.listen(3333);
