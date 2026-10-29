const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');

// 1. Função para desenhar o triângulo preenchido
function desenharTriangulo(p1, p2, p3) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fillStyle = "black";
    ctx.fill();
}

// 2. Função auxiliar para calcular o ponto médio entre dois vértices
function pontoMedio(pA, pB) {
    return {
        x: (pA.x + pB.x) / 2,
        y: (pA.y + pB.y) / 2
    };
}

// 3. Função recursiva do Sierpinski (com caso-base garantido)
function sierpinski(p1, p2, p3, niveisRestantes) {
    if (niveisRestantes === 0) {
        desenharTriangulo(p1, p2, p3);
    } else {
        const pMid1 = pontoMedio(p1, p2);
        const pMid2 = pontoMedio(p2, p3);
        const pMid3 = pontoMedio(p3, p1);

        sierpinski(p1, pMid1, pMid3, niveisRestantes - 1);
        sierpinski(pMid1, p2, pMid2, niveisRestantes - 1);
        sierpinski(pMid3, pMid2, p3, niveisRestantes - 1);
    }
}

// 4. Função principal disparada pelo botão (com limpeza de canvas e limite de segurança)
function atualizarFractal() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const inputVal = document.getElementById('iteracoes').value;
    let iteracoes = parseInt(inputVal) || 0;

    // BLINDAGEM CONTRA TRAVAMENTO: Limita no máximo a 6 iterações para não congelar a aba
    if (iteracoes > 6) {
        iteracoes = 6;
        document.getElementById('iteracoes').value = 6;
    }
    if (iteracoes < 0) iteracoes = 0;

    // Vértices do triângulo principal equilátero
    const larguraLado = 400;
    const altura = (larguraLado * Math.sqrt(3)) / 2;
    const xInicial = (canvas.width - larguraLado) / 2;
    const yInicial = 20;

    const pTopo = { x: xInicial + (larguraLado / 2), y: yInicial };
    const pEsquerda = { x: xInicial, y: yInicial + altura };
    const pDireita = { x: xInicial + larguraLado, y: yInicial + altura };

    sierpinski(pTopo, pEsquerda, pDireita, iteracoes);
}

// Vincula o evento e executa a primeira vez
document.getElementById('btnDesenhar').addEventListener('click', atualizarFractal);
atualizarFractal();