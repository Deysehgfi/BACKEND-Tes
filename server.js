import { createServer } from 'node:http'
import { readFile, writeFile } from 'node:fs'

const PORT = 3333

// Função para ler arquivo
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

const server = createServer((request, response) => {
    const { method, url } = request
    if (method === 'GET' && url === '/usuarios') {
        lerDadosPessoas((err, pessoas) => {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify({ message: 'Erro no servidor' }))
            } else {
                response.writeHead(200, { 'Content-Type': 'application/json' })
                response.end(JSON.stringify(pessoas))
            }
        })
    }else if(method === 'GET' && url === '/usuarios/'){
        
        console.log(method,url)
   
        const pessoaId = url.split('/')[1]

      
        lerDadosPessoas((err, pessoas)=>{
            if(err){
                response.writeHead(500, {'Content-Type':'application/json'})
                response.end(JSON.stringify({message: 'Erro no servidor'}))
            }
          
                const pessoaFind = pessoas.find((pessoa) => pessoa.id === pessoaId)

                if(pessoaFind){
                    response.writeHead(200,{'Content-Type':'application/json'})
                    response.end(JSON.stringify(pessoaFind))
                    return;
                } else{
                    response.writeHead(404,{'Content-Type':'application/json'})
                    response.end(JSON.stringify({ message: 'Pessoa não encontrada' }))
                }
            response.end()
        })

    } else if (method === 'POST' && url === '/usuarios') {
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
                lerDadosPessoas((err, pessoas) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'application/json' })
                        response.end(JSON.stringify({ message: 'Erro ao cadastrar pessoa' }))
                    }
                    novaPessoa.id = pessoas.length + 1
                    pessoas.push(novaPessoa)
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
    
    } else if (method === 'PUT' && url.startsWith('/usuarios/')) {
        let body = '';
        const id = url.split('/')[2];
        const index = pessoas.findIndex((pessoa) => pessoa.id == id);
    
        request.on('data', (chunk) => {
            body += chunk;
        });
    
        request.on('end', (err) => {
            if (err) {
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify({ message: 'error no servidor' }));
                return;
            }
    
            const json = JSON.parse(body);
            pessoas[index] = { ...pessoas[index], ...json };
    
            lerDadosPessoas((err, dadosPessoas) => {
                if (err) {
                    response.writeHead(500, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify({ message: 'error no servidor' }));
                    return;
                }
    
                fs.writeFile('pessoas.json', JSON.stringify(dadosPessoas, null, 2), (err) => {
                    if (err) {
                        response.writeHead(500, { 'Content-Type': 'application/json' });
                        response.end(JSON.stringify({ message: 'error no servidor' }));
                        return;
                    }
    
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.end(JSON.stringify(json));
                });
            });
        });
    
        
    }else {
        response.writeHead(404, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ message: 'Rota não encontrada' }))
    }
})

server.listen(PORT, () => {
    console.log(`Server on PORT: ${PORT}`)
})
