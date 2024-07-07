// //Paciência e uma boa prova. Que a Força esteja com você!
// import {createServer} from 'node:http';
// import { writeFile, readFile } from 'node:fs';
// import { callbackify } from 'node:util';

// const PORT = 3333;

// const lerDadosPessoas = (callback)=>{
//     readFile('pessoas.json','utf-8', (err, data)=>{
//         if(err){
//             callbackify(err)
//         } try {
//             const Pessoas = JSON.parse(data)
//             callback(null, Pessoas)
//         } catch (err){
//             callback(err)
//         }
//     })
// }


// const server = createServer((request , response)=>{
//     const {method , url} = request


//     ///listar todos as pessoas

//     if(method=== 'GET'&& url === '/pessoas'){
//         lerDadosPessoas((err,Pessoas)=>{
//             if(err){
//                 response.writeHead(500,{'Content-Type':'application/json'})
//                 response.end(JSON.stringify({message:'corpo da aplicação vazio'}))
//                 return
//             }

//             response.writeHead(200,{'Content-Type':'application/json'})
//             response.end(JSON.stringify(Pessoas))

//         })

       
//     } else if (method === 'POST' && url==='/pessoas'){
   
//     let body = ''

//     request.on('data',(chunk)=>{
//          body += chunk
//     })

//     request.on('end', ()=>{

//             // ↱transformar o novo usuario em um json no body
//      const novaPessoa = JSON.parse(body)
//      novaPessoa.id = Pessoas.length + 1
//      Pessoas.push(novaPessoa)


//      //Validação dos dados vindos do body

//      lerDadosPessoas((err, Pessoas)=>{
//      if(err){
//          response.writeHead(500,{'Content-Type':'application/json'})
//          response.end(JSON.stringify({message:'Não é possivel ler o arquivo'}))
//          return;
//      }
     
//          writeFile("pessoas.json", JSON.stringify(Pessoas, null , 2), (err)=>{
//              if(err){
//                  response.writeHead(500,{'Content-Type':'application/json'})
//                  response.end(JSON.stringify({message:'Não é possivel cadastrar os dados no arquivo'})) 
//                  return;
//              }

//              response.writeHead(201, {'Content-Type':'application/json'}) ;
//              response.end(JSON.stringify(novaPessoa)) ;
//          });


     
//  });

//     });
    
//     } else if (method === 'PUT' && url === '/pessoas/'){
//         const id = parseInt(url.split('/')[2])
//         let body = ''
//         request.on('data', (chunk)=>{
//             body += chunk
//         })
//         request.on('end', ()=>{
//             if(!body){
//                 response.writeFile(400,{'Content-Type':'application/json'})
//                 response.end(JSON.stringify({message: 'Corpo da solicitação vazio'}))
//             }
    
//             lerDadosPessoas((err,Pessoas)=>{
//                 if(err){
//                     response.writeFile(500, {'Content-Type':'applicaton/json'})
//                     response.end(JSON.stringify({message: 'Err ao ler dados da receitas'}))
//                 }
//             })
//                 const indexPessoas = Pessoas.findIndex((pessoas)=>pessoas.id === id)
    
//                 if(indexPessoas=== -1){
//                     response.writeHead(404, {'Content-Type':'application/json'})
//                     response.end(JSON.stringify({message: 'Receita não encontrada'}))
//                     return;
//                 }
    
//                 const pessoaAtualizada = body
//                 pessoaAtualizada.id = id
//                 Pessoas[indexPessoas] = pessoaAtualizada
    
//                 fs.writeFile('receitas.json', JSON.stringify(Pessoas,null,2), (err)=>{
//                     if(err){
//                         response.writeHead(500, {'Content-Type':'application/json'})
//                         response.end(JSON.stringify({message: 'Receita não encontrada'}))
//                     }
//                     response.writeHead(200, {'Content-Type':'application/json'})
//                     response.end(JSON.stringify(Pessoas))
                  

//                 })
              
//         })
       

   
//     }else if(method=== 'GET'&&  url.startsWith('/pessoas')){
        
//         const pessoaId = url.split('/')['bf7c792f-7041-4290-ba9b-474daa3324d5']
//         lerDadosPessoas((err, Pessoas)=>{
//                 if(err){
//                     response.writeHead(500, {"Content-Type": "application"});
//                     response.end(JSON.stringify({message: 'Erro ao ler o arquivo'}))
//                     return;
//                 }

                
//                 writeFile("pessoas.json", JSON.stringify(Pessoas, null , 2), (err)=>{
//                     if(err){
//                         response.writeHead(500,{'Content-Type':'application/json'})
//                         response.end(JSON.stringify({message:'Não é possivel cadastrar os dados no arquivo'})) 
//                         return;
//                     }
       
//                 const ListarPessoaPorId = Pessoas.find((pessoa) => pessoa.id === pessoaId);

               
//                 response.writeHead(200, {"Content-Type": "application"});
//                 response.end(JSON.stringify(ListarPessoaPorId))

//             });
//             }) 
        
//             response.end()
//     } else if(method === 'PUT' && url === '/pessoas/endereco/'){
//         let body = ''
//         request.on("data", (chunk)=>{
//           body += chunk
//         })
//         request.on('end',()=>{
//   if(!body){
//       response.writeHead(400,{'Content-Type':'application/json'})
//       response.end(JSON.stringify({message:"Corpo da solicitação vazio"}))
//      return
//   }
//    lerDadosPessoas((err,pessoas)=>{
//       if(err){
//           response.writeHead(500,{'Content-Type':'application/json'})
//           response.end(JSON.stringify({message:'Erro no servidor'}))
  
//       }
  
//       const indexEndereco = pessoas.findIndex((endereco)=>endereco.id === id)
//       if(indexEndereco === -1){
//           response.writeHead(404,{'Content-type':'application'})
//           response.end(JSON.stringify({message:'Endereço não encontrada'}))
//           return
//       }
//        const enderecoAtualizada = JSON.parse(body)
//        enderecoAtualizada.id = id
//        pessoas[indexEndereco] = enderecoAtualizada
//    })
  
//           writeFile("pessoas.js", JSON.stringify(pessoas, null, 2), (err)=>{
//               if(err){
//                   response.writeHead(500,{'Content-Type':'application/json'})
//                   response.end(JSON.stringify({message:"Erro interno no servidor"}))
//                   return
//               }
//           })
  
//           response.writeHead(201,{'Content-Type':'application/json'})
//           response.end(JSON.stringify(enderecoAtualizada))
//         })
//     }else{
//     response.writeHead(404, {'Contant-Type': 'application/json'})
//     response.end(JSON.stringify({message: 'Rota não encontrada'}))
//     }


// })

// server.listen(PORT,()=>{
//     console.log(`servidor on PORT: ${PORT}`)
// })