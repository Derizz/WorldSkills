import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';   
import apiRoutes from './routes/api.js';   

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORTA = 3000;

app.use(express.static(path.join(__dirname, 'public')));

const PREFIXO_PROVA = '/modulo_c';
app.use(PREFIXO_PROVA, apiRoutes);

app.use((req, res, next) => {
  res.status(404).send('<h1>Erro 404: Página não encontrada!</h1>');
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('<h1>Erro 500: Erro interno no servidor.</h1>');
});

app.listen(PORTA, () => {
  console.log(`Servidor Express rodando na porta ${PORTA}`);
});