// 1. Lista com o caminho das suas fotos
const listaFotos = [
  'foto1.jpg', // Foto inicial (frente)
  'foto2.jpg', // Segunda foto
  'foto3.jpg', // Terceira foto
  'foto4.jpg'  // Quarta foto
];

let indiceAtual = 0;

const stage = document.getElementById('stage');
const bgPhoto = document.getElementById('bgPhoto');
const doorLeft = document.getElementById('doorLeft');
const doorRight = document.getElementById('doorRight');

// Define as imagens iniciais no carregamento
function inicializarGaleria() {
  const urlAtual = listaFotos[indiceAtual];
  const urlProxima = listaFotos[(indiceAtual + 1) % listaFotos.length];

  doorLeft.style.backgroundImage = `url('${urlAtual}')`;
  doorRight.style.backgroundImage = `url('${urlAtual}')`;
  bgPhoto.style.backgroundImage = `url('${urlProxima}')`;
}

inicializarGaleria();

// 2. Evento de clique para animar e trocar de foto
stage.addEventListener('click', () => {
  // Se já estiver aberto, fechamos e atualizamos as imagens em segundo plano
  if (stage.classList.contains('is-open')) {
    stage.classList.remove('is-open');
    
    // Atualiza o índice para a próxima foto após fechar (ou imediatamente)
    indiceAtual = (indiceAtual + 1) % listaFotos.length;
    
    // Pequeno atraso para atualizar as imagens enquanto a "porta" está fechada
    setTimeout(() => {
      inicializarGaleria();
    }, 500); // 500ms é metade da animação

  } else {
    // Se estiver fechado, abre revelando a próxima foto
    stage.classList.add('is-open');
  }
});