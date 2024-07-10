// const express = require('express')
import express, { request, response } from 'express'

const PORT = 3333;
//cria um servidor 
const app = express()

//Aceitar JSON
app.use(express.json())





/*Rotas
Request HTTP
query params - ...:3333/pessoas?nome="Carlos"&idade=32
*Rotas do tipo GET (utilizado para crir FILTROS e BUSCAS)


route params - ...:3333/pessoas/5
*Rotas tipo GET, PUT, PATCH, DELETE(listar um elemento)


body params - ...:3333/pessoas
*Rotas do tipo POST (Cadastro de informções)
*/


//Middleware -> 
const logRoutes = (request, response, next) => {
const {url , method } = request
const rota = `[${method.toUpperCase()}] ${url}`
console.log(rota)
next()
}

//Middleware Para todas as rotas
app.use(logRoutes)


//rota com method === get 
//rota , função de callbak com requisição e a resposta
// app.get("/users", (request, response)=>{
// // response.status(200).json({msg: "GET"})
// //cabeçalho 200 retorna como objeto json com uma menssage

// response.status(200).json([
//     "Pessoas 1",
//     "Pessoas 2",
//     "Pessoas 3"
// ]) 
// })


//Trabalhando com as rotas query
app.get("/users", logRoutes, (request, response)=>{
//    const query = request.query 
//    console.log(query)

const {nome , idade} = request.query //queryparams
console.log(nome,idade)
    
    response.status(200).json([
        "Pessoas 1",
        "Pessoas 2",
        "Pessoas 3"
    ]) 
    })


//post
app.post("/users", (request, response)=>{
    // response.status(200).json({msg:"POST"})

    // const body = request.body
    // console.log(body)


    const {nome, idade} = request.body
    console.log(nome, idade)


    response.status(201).json([
        "Pessoas 1",
        "Pessoas 2",
        "Pessoas 3",
        "Pessoas 4"
    ]) 
}) 




//put
//Routes Params 
//referencia ao id
app.put("/users/:id/:cpf", (request, response)=>{
    // const params = request.params
    // console.log(params)


    //nos parametros em uma propriedade id 
    // const id = request.params.id
    // const cpf = request.params.cpf
    // console.log(id , cpf)

    const {id, cpf} = request.params //Desestruturando
    console.log(id,cpf)
    // response.status(200).json({msg:"PUT"}) -> estrutura base
    response.status(201).json([
        "Pessoas 1",
        "Pessoas 10",
        "Pessoas 3",
        "Pessoas 4"
    ]) 
})


app.patch("/users", (request, response)=>{
    response.status(200).json({msg:"PATCH"})
})

app.delete("/users", (request, response)=>{
    // response.status(200).json({msg:"DELETE"})
    response.status(204).json([
        "Pessoas 1",
        "Pessoas 3",
        "Pessoas 4"
    ]) 
})


//listar o o servidos
app.listen(PORT, ()=>{
    console.log("Servidor on PORT:" +PORT)
})

/*Terminal
-Divide o terminal em 2

*/


