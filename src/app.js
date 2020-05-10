const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body; // constantes dentro do corpo da requisição.

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository); // ex: adiciona repository em repositories

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryFound = repositories.find(repository => repository.id === id);

  if(!repositoryFound){
    return response.status(400).send(); // erro de status sempre vir com um .send    
  };

  const repository = {  
    id,    
    title,
    url,
    techs,
    likes: repositoryFound.likes
  };

  repositories.push(repository);

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;  

  const repositoryFound = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryFound < 0){
    return response.status(400).json({error: 'Repository not found'}); // erro de status sempre vir com um .send    
  };
  
  repositories.splice(repositoryFound,1); // retira uma informação de dentro da array

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if(!repository) {
    return response.status(400).send();
  }

  repository.likes++;
  
  return response.json(repository);
});

module.exports = app;
