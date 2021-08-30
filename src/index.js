const express = require("express");
const { v4: uuidV4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

const verifyIfExistAccount = (request, response, next) => {
  const { cpf } = request.headers;

  const findCustomer = customers.find(customer => customer.cpf === cpf);
  
  if (!findCustomer) {
    return response.status(400).json({error: "Usuário não encontrado"});
  }

  request.customer = findCustomer;

  return next();
}

const getBalance = (statement) => {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === 'credit') {
      return acc + operation.amount;
    }

    return acc - operation.amount;
  }, 0)

  return balance;
}

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

// app.use(verifyIfExistAccount) usa assim se todas as rotas abaixo forem usar, se nao forem coloca o middlware em cada 1

app.get("/statement", verifyIfExistAccount, (request, response) => { //middleware coloca entre o endpoint e request e response
  const { customer } = request;

  return response.json(customer.statement)
});

app.post("/deposit", verifyIfExistAccount ,(request, response) => {
  const { description, amount } = request.body;
  const { customer } = request;

  const bankOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(bankOperation);


  return response.status(201).send()
});

app.post("/withdraw", verifyIfExistAccount, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return response.status(400).json({ error: "Saldo insuficiente" })
  }

  const bankOperation = {
    amount,
    created_at: new Date(),
    type: "debit"
  }

  customer.statement.push(bankOperation);


  return response.status(201).send()
})

app.listen(3333);
