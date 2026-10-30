import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Olá do servidor nativo Node.js!');
});

const PORTA = 3000;
server.listen(PORTA, () => {
  console.log(`Servidor nativo rodando em http://localhost:${PORTA}`);
});