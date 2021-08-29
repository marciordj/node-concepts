const express = require("express");
const { v4: uuidV4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

app.post("/account", (request, response) => {
  const { cpf, name } = request.body; //pega os dados do body da requisição

  const customerAlreadyExist = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExist) {
    return response.status(400).json({ error: "Esse usuário já está cadastrado" });
  }

  customers.push({
    cpf,
    name,
    id: uuidV4(),
    statement: [],
  });

  return response.status(201).send();
});

app.get("/statement", (request, response) => {
  const { cpf } = request.body;

  const findCostumer = customers.find(customer => customer.cpf === cpf);

  if (!findCostumer) {
    return response.status(400).json({error: "Cliente não encontrado"})
  }
  
  return response.json(findCostumer.statement)
  
});

app.listen(3333);
