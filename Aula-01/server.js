// const express = require('express')
import express, { request, response } from 'express'
import {v4 as uuidv4} from "uuid"

const PORT = 3333;
//cria um servidor 
const app = express()

//Aceitar JSON
app.use(express.json())



//Middleware -> 
const logRoutes = (request, response, next) => {
const {url , method } = request
const rota = `[${method.toUpperCase()}] ${url}`
console.log(rota)
next()
}

//Middleware Para todas as rotas
app.use(logRoutes)

const users = [];

//Trabalhando com as rotas query
app.get("/users", logRoutes, (request, response)=>{
//    const query = request.query 
//    console.log(query)

// const {nome , idade} = request.query //queryparams

    
    response.status(200).json(users)
    })


//post
app.post("/users", (request, response)=>{
 const {nome, idade} = request.body
   
 //Validação do nome ser obrigatório
 if(!nome){
    response.status(422).json({message: "O nome é obrigatório"})
    return;
 }

 //validação

 if(!idade){
    response.status(400).json({message: ""})
    return;
 }

 const user = { 
    id: uuidv4(),
    nome,
    idade
 }

 users.push(user)

response.status(201).json({message:"Usuario cadastrado", user})


}) 




//put
//Routes Params 
//referencia ao id
app.put("/users/:id", (request, response)=>{
 

    const id = request.params.id //Desestruturando

    const indexUser = users.findIndex((user)=> user.id == id)

    if(indexUser == -1){
        response.status(404).json({message:"Usuario nao encontrado"})
        return
    }

    //validação
    if(!nome || idade){
        response.status(400).json({message:"nome e idade é obrigatório "})
    }


    const updateUser = {
        id,
        nome,
        idade
    }

    //Atualizar
    users[indexUser] = updateUser
    response.status(200).json(updateUser);
})


app.patch("/users", (request, response)=>{
    response.status(200).json({msg:"PATCH"})
})

app.delete("/users/:id", (request, response)=>{
    // response.status(200).json({msg:"DELETE"})
const id = request.params.id

const indexUser = users.findIndex((user)=> user.id == id)

if(indexUser === -1){
    response.status(404).json({message:"Usuario nao encontrado"})
}

users.splice(indexUser,1)
response.status(204).send("Usuario deletado")

})


//listar o o servidos
app.listen(PORT, ()=>{
    console.log("Servidor on PORT:" +PORT)
})

/*Terminal
-Divide o terminal em 2

*/


