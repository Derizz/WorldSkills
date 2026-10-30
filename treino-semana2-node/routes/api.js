import express from  'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Módulo C: Raiz do site funcionando com sucesso!');
});

router.get('/heritages/*caminho', (req, res) => {
    const partesCaminho = req.params.caminho;
    const q = req.query.q || 'nenhum parâmetro q';
    res.send(`[HERITAGES] Caminho capturado: ${partesCaminho} | Parãmetros q: ${q}`);    
});

router.get('/tags/*tag', (req, res) => {
    const tag = req.params.tag || 'nenhuma tag informada';
    const q = req.query.q || ''; 

    res.send(`[TAGS] Tag capturada: ${tag} | Parâmetro q: ${q}`);
});

export default router;