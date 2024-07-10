import {createServer} from 'node:http'
import {readFile , writeFile} from 'node:fs'

const PORT = 3333;

const lerDadosPessoas = (callback) => {
    readFile('pessoas.json', 'utf-8', (err, data) => {
        if (err) {
            callback(err)
        } else {
            try {
                const pessoas = JSON.parse(data)
                callback(null, pessoas)
            } catch (err) {
                callback(err)
            }
        }
    })
}



const server = createServer((request, response)=>{
    const {method ,url } = request 

    if(url === '/pessoas' && method === 'GET'){
        console.log(method, url)

        //ler os dados vindo do pessoa.json
        lerDadosPessoas((err, pessoas) => {
                if (err) {
                    response.writeHead(500, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ message: 'Erro no servidor' }))
                } else {
                    response.writeHead(200, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify(pessoas))
                }
        })
    }else if(url === '/pessoas' && method === 'POST'){
        // cadastra pessoa
        let body = ''
        request.on('data', (chunk) => {
            body += chunk
        })
        request.on('end', () => {
            if (!body) {
                response.writeHead(400, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: 'Corpo da solicitação vazio' }))
                return
            }
         

                const novaPessoa = JSON.parse(body)
                //ler dados vindos do passoas.json
                lerDadosPessoas((err, pessoas) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify({ message: 'Erro ao cadastrar pessoa' }))
                    }
                    novaPessoa.id = pessoas.length + 1
                    pessoas.push(novaPessoa)

                    // escrever arquivo no pessoas.json tipo json
                    writeFile('pessoas.json', JSON.stringify(pessoas, null, 2), (err) => {
                        if (err) {
                            response.writeHead(500, { 'Content-Type': 'application/json' })
                            response.end(JSON.stringify({ message: 'Erro ao cadastrar pessoa' }))
                            return
                        }
                        response.writeHead(201, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify(novaPessoa))
                    })
                })
           
        })
    }else if( method ==='GET' && url.startsWith('/pessoas/')){

        //  console.log(method,url)

   
        const pessoaId = url.split('/')[2]
        console.log(`id: ${pessoaId}`) //tudo certo
        
      
        lerDadosPessoas((err, pessoas)=>{
            if(err){
                response.writeHead(500, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Erro no servidor'}))
            } 
          
                const pessoaFind = pessoas.find((pessoa)=> pessoa.id == pessoaId)
                console.log(pessoaFind)

                if(!pessoaFind){
                    response.writeHead(404,{'Content-Type':'application/json'})
                    response.end(JSON.stringify({ message: 'Pessoa não encontrada' }))
            
                } else{
                    response.writeHead(200,{'Content-Type':'application/json'})
                    response.end(JSON.stringify(pessoaFind))
                    return;
                }
            response.end()
            // console.log(pessoas)
        })

    }else if(method === 'POST' && url.startsWith('/pessoas/telefone/')){
        const pessoaId = url.split('/')[3];
        const index = pessoas.findIndex((usuario) => usuario.id == pessoaId);
    
        if (index === -1) {
            response.writeHead(404, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ message: 'Pessoa não encontrada' }));
        } else {
            let body = '';
    
            request.on('data', (chunk) => {
                body += chunk;
            });
    
            request.on('end', () => {
                const phoneNumbers = JSON.parse(body);
    
                const NumerosValidacao = phoneNumbers.every((num) =>
                    Object.hasOwnProperty.call(num, 'tipo') &&
                    Object.hasOwnProperty.call(num, 'numero')
                );
    
                if (!NumerosValidacao) {
                    response.writeHead(400, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ message: 'Não foi possível criar um telefone' }));
                } else {
                    data[index] = {
                        ...data[index],
                        telefone: phoneNumbers,
                    };
    
                    writeFile('./pessoas.json', JSON.stringify(data, null, 2), (err) => {
                        if (err) {
                            response.writeHead(500, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ message: 'Erro ao cadastrar pessoa' }));
                        } else {
                            response.writeHead(201, { 'Content-Type': 'application/json' });
                            response.end(JSON.stringify({ message: 'Telefone(s) adicionado(s) com sucesso!', usuario: data[index] }));
                        }
                    });
                }
            });
        }
    } else if(method === 'PUT' && url === '/pessoas/endereco/'){
        pessoaId = url.split('/')[3]

            let body = ''
            request.on("data", (chunk)=>{
              body += chunk
            })
            request.on('end',()=>{
      if(!body){
          response.writeHead(400,{'Content-Type':'application/json'})
          response.end(JSON.stringify({message:"Corpo da solicitação vazio"}))
         return
      }
       lerDadosPessoas((err,pessoas)=>{
          if(err){
              response.writeHead(500,{'Content-Type':'application/json'})
              response.end(JSON.stringify({message:'Erro no servidor'}))
      
          }
      
          const indexEndereco = pessoas.findIndex((endereco)=>endereco.id == id)
          if(indexEndereco === -1){
              response.writeHead(404,{'Content-type':'application'})
              response.end(JSON.stringify({message:'Endereço não encontrada'}))
              return
          }
           const enderecoAtualizada = JSON.parse(body)
           enderecoAtualizada.id = id
           pessoas[indexEndereco] = enderecoAtualizada
       })
      
              writeFile("pessoas.js", JSON.stringify(pessoas, null, 2), (err)=>{
                  if(err){
                      response.writeHead(500,{'Content-Type':'application/json'})
                      response.end(JSON.stringify({message:"Erro interno no servidor"}))
                      return
                  }
              })
      
              response.writeHead(201,{'Content-Type':'application/json'})
              response.end(JSON.stringify(enderecoAtualizada))
            })
    }else if(method === 'PUT' && url === '/pessoas/telefone/'){
        let body = ''
        request.on("data", (chunk) => {
            body += chunk
        });
        request.on('end', () => {
            if (!body) {
                response.writeHead(400, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: "Corpo da solicitação vazio" }))
                return
            }
    
            lerDadosPessoas((err, pessoas) => {
                if (err) {
                    response.writeHead(500, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify({ message: 'Erro no servidor' }))
                    return
                }
    
                const indexTelefone = pessoas.findIndex((telefone) => telefone.id === id)
                if (indexTelefone === -1) {
                    response.writeHead(404, { 'Content-type': 'application/json' })
                    response.end(JSON.stringify({ message: 'Telefone não encontrado' }))
                    return
                }
    
                const telefoneAtualizado = JSON.parse(body)
                telefoneAtualizado.id = id
                pessoas[indexTelefone] = telefoneAtualizado
    
                writeFile("pessoas.js", JSON.stringify(pessoas, null, 2), (err) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify({ message: "Erro interno no servidor" }))
                        return;
                    }
                    response.writeHead(201, { 'Content-Type': 'application/json' })
                    response.end(JSON.stringify(telefoneAtualizado))
                })
            })
        })

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
  
//       const indexTelefone = pessoas.findIndex((telefone)=>telefone.id === id)
//       if(indexTelefone === -1){
//           response.writeHead(404,{'Content-type':'application'})
//           response.end(JSON.stringify({message:'Endereço não encontrada'}))
//           return
//       }
//        const telefoneAtualizado = JSON.parse(body)
//        telefoneAtualizado.id = id
//        pessoas[indexTelefone] = telefoneAtualizado
//    })
  
//           writeFile("pessoas.js", JSON.stringify(pessoas, null, 2), (err)=>{
//               if(err){
//                   response.writeHead(500,{'Content-Type':'application/json'})
//                   response.end(JSON.stringify({message:"Erro interno no servidor"}))
//                   return
//               }
//           })
  
//           response.writeHead(201,{'Content-Type':'application/json'})
//           response.end(JSON.stringify(telefoneAtualizado))
//         })
   }else if(method === 'DELETE' && url === '/pessoas'){
    const id = parseInt(url.split('/')[2])
    lerDadosPessoas((err,pessoas)=>{
        if(err){
            response.writeHead(500,{'Content-Type':'application/json'})
                response.end(JSON.stringify({message:"Erro interno no servidor"}))
                return
        }
        const indexPessoa = pessoas.findIndex((pessoa)=>pessoa.id == id)
        if(indexPessoa === -1){
        response.writeHead(404,{'Content-type':'application'})
        response.end(JSON.stringify({message:'Pessoa não encontrada'}))
         return    
    }

    pessoas.splice(indexPessoa,1)
    writeFile('pessoas.json',JSON.stringify(pessoas, null, 2),(err)=>{
        if(err){
            response.writeHead(500,{'Content-type':'application'})
        response.end(JSON.stringify({message:'Error ao deletar pessoa'}))
        return
        }
        response.writeHead(200,{"Content-Type":"application/json"})
        response.end(JSON.stringify({message:"Pessoa deletada"}))
    })
    })
 }else if(method === 'DELETE' && url.startsWith('/pessoas/telefones/')){
    const idPessoa = url.split('/')[3]
    lerDadosPessoas((err, pessoas)=>{
        if(err){
            response.writeHead(500, {'Content-Type':'application/json'})
            response.end(JSON.stringify({ message:'erro interno no servidor'}))
            return;
        }

        const indexPessoa = pessoas.findIndex((pessoa)=>pessoa.id == idPessoa)
        if(indexPessoa === -1){
            response.writeHead(404, {'Content-type':'application/json'})
            response.end(JSON.stringify({message:'pessoa nao encontrada'}))
            return
        }
        writeFile('pessoas.json',JSON.stringify(pessoas, null, 2), (err)=>{
            if(err){
                response.writeHead(500, {'Content-type':'application/json'})
                response.end(JSON.stringify({message:'erro ao atualizar'}))
                return
            }
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ message: 'Telefone removido com sucesso' }))
        })
    })
 } else{
        response.writeHead(404, {'Content-Type':'application/json'})
        response.end(JSON.stringify({message: 'Rota não encontrada'}))
    }

})

server.listen(PORT, ()=>{
    console.log(`servidor on PORT ${PORT}`)
})