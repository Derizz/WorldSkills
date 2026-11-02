import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

const BASE_DIR = path.resolve('content-pages');

// Função auxiliar reutilizável para ler pastas de forma segura
async function listarDiretorio(subCaminhoParts, res) {
  try {
    const subCaminhoStr = subCaminhoParts.join('/');
    const caminhoSeguro = path.normalize(path.join(BASE_DIR, ...subCaminhoParts));

    if (!caminhoSeguro.startsWith(BASE_DIR)) {
      return res.status(403).send('Erro de segurança: Acesso negado fora da pasta permitida.');
    }

    let itens;
    try {
      itens = await fs.readdir(caminhoSeguro, { withFileTypes: true });
    } catch (err) {
      if (err.code === 'ENOENT') {
        return res.status(404).send('Erro 404: Pasta ou arquivo não encontrado.');
      }
      throw err;
    }

    const subpastas = [];
    const arquivos = [];

    for (const item of itens) {
      if (item.isDirectory()) {
        if (item.name !== 'images') {
          subpastas.push(item.name);
        }
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (ext === '.html' || ext === '.txt') {
          arquivos.push(item.name);
        }
      }
    }

    return res.json({
      caminhoAtual: subCaminhoStr || '/',
      subpastas,
      arquivos
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send('Erro interno no servidor.');
  }
}

// Função para ler o arquivo com UTF-8 e fazer o parse manual do Front-Matter (Atividade 4)
async function lerArquivoComFrontMatter(caminhoCompleto) {
  const conteudoBruto = await fs.readFile(caminhoCompleto, 'utf8');
  const conteudoNormalizado = conteudoBruto.replace(/\r\n/g, '\n');

  const metadata = {
    title: '',
    tags: [],
    draft: false,
    summary: '',
    cover: ''
  };

  let corpo = conteudoNormalizado;

  if (conteudoNormalizado.startsWith('---\n')) {
    const fimFrontMatter = conteudoNormalizado.indexOf('\n---\n', 4);

    if (fimFrontMatter !== -1) {
      const blocoFM = conteudoNormalizado.substring(4, fimFrontMatter);
      corpo = conteudoNormalizado.substring(fimFrontMatter + 5).trim();

      const linhas = blocoFM.split('\n');
      for (const linha of linhas) {
        const indiceDoisPontos = linha.indexOf(':');
        if (indiceDoisPontos !== -1) {
          const chave = linha.substring(0, indiceDoisPontos).trim();
          const valor = linha.substring(indiceDoisPontos + 1).trim();

          if (chave === 'title' || chave === 'summary' || chave === 'cover') {
            metadata[chave] = valor;
          } 
          else if (chave === 'tags') {
            metadata.tags = valor.split(',').map(tag => tag.trim()).filter(Boolean);
          } 
          else if (chave === 'draft') {
            metadata.draft = (valor.toLowerCase() === 'true');
          }
        }
      }
    }
  }

  return { metadata, corpo };
}

// 1. Rota Raiz geral
router.get('/', (req, res) => {
  res.send('Módulo C: Raiz do site funcionando com sucesso!');
});

// 2. Rota para a raiz de heritages (/heritages ou /heritages/)
router.get('/heritages', async (req, res) => {
  await listarDiretorio([], res);
});

// 3. Rota para subpastas de heritages
router.get('/heritages/*caminho', async (req, res) => {
  const rawCaminho = req.params.caminho || '';
  const subCaminhoParts = Array.isArray(rawCaminho) ? rawCaminho : rawCaminho.split('/').filter(Boolean);
  
  await listarDiretorio(subCaminhoParts, res);
});

// 4. Rota para testar a leitura do Front-Matter (com suporte a subpastas)
router.get('/ler-arquivo/*caminhoArquivo', async (req, res) => {
  try {
    const rawCaminho = req.params.caminhoArquivo || '';
    const caminhoParts = Array.isArray(rawCaminho) ? rawCaminho : rawCaminho.split('/').filter(Boolean);
    
    const caminhoArquivo = path.normalize(path.join(BASE_DIR, ...caminhoParts));

    if (!caminhoArquivo.startsWith(BASE_DIR)) {
      return res.status(403).send('Acesso negado.');
    }

    const resultado = await lerArquivoComFrontMatter(caminhoArquivo);
    res.json(resultado);

  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(404).send('Arquivo não encontrado.');
    }
    console.error(err);
    res.status(500).send('Erro interno.');
  }
});

// 5. Rota Tags
router.get('/tags/*tag', (req, res) => {
  const tag = req.params.tag || 'nenhuma tag informada';
  const q = req.query.q || '';
  res.send(`[TAGS] Tag capturada: ${tag} | Parâmetro q: ${q}`);
});

export default router;