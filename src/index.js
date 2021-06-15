const { request } = require("express");
const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function repositoryValidation(request, response, next){
  const { id } = request.params;

  const foundRepository = repositories.find(repository => repository.id === id);

  if(!foundRepository) return response.status(404).json({error: "Repository not found!"});

  request.id = id;

  return next();
}



app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", repositoryValidation, (request, response) => {
  const { id } = request;
  const {title, url, techs} = request.body;

  const updatedRepository = {
    title,
    url,
    techs
  }
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  
  const repository = {...repositories[repositoryIndex], ...updatedRepository}

  repositories[repositoryIndex] = repository

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", repositoryValidation, (request, response) => {
  const { id } = request;

  repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", repositoryValidation, (request, response) => {
  const { id } = request;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories[repositoryIndex].likes++

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
