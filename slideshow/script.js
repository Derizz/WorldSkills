const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const galleryList = document.getElementById('galleryList');
const sampleBtn = document.getElementById('sampleBtn');

// Função de formatação de legenda
function formatCaption(filename) { // Remove a extensão e substitui hífens/underscores por espaços, capitalizando as palavras
    const lastDotIndex = filename.lastIndexOf('.'); // Encontra o último ponto para remover a extensão
    let nameWithoutExt = lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename; // Se não houver ponto, usa o nome completo
    let cleanName = nameWithoutExt.replace(/[-_]/g, ' '); // Substitui hífens e underscores por espaços
    let capitalized = cleanName.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitaliza a primeira letra de cada palavra
    return capitalized; // Retorna o nome formatado
}

// Função para adicionar imagem à lista
function addImageToList(src, filename) { // Formata a legenda e cria elementos para a lista
    const captionText = formatCaption(filename); // Formata a legenda com base no nome do arquivo

    const li = document.createElement('li'); // Cria um item de lista
    
    const img = document.createElement('img'); // Cria o elemento de imagem
    img.src = src; // Define a fonte da imagem
    img.width = 100; // Tamanho compacto para a lista

    const span = document.createElement('span'); // Cria o elemento de legenda
    span.textContent = ` ${captionText}`; // Define o texto da legenda com um espaço antes para separação

    li.appendChild(img); // Adiciona a imagem ao item de lista
    li.appendChild(span); // Adiciona a legenda ao item de lista
    galleryList.appendChild(li); // Adiciona o item de lista à lista principal
}

// 1. Evento do input de ficheiro tradicional
fileInput.addEventListener('change', (event) => { // Adiciona imagens selecionadas à lista
    // Opcional: galleryList.innerHTML = ''; // Descomente se quiser limpar a lista a cada nova seleção
    const files = event.target.files; // Obtém os arquivos selecionados
    Array.from(files).forEach(file => { // Itera sobre cada arquivo selecionado
        if (!file.type.startsWith('image/')) return; // Ignora arquivos que não são imagens
        const imageUrl = URL.createObjectURL(file); // Cria uma URL temporária para a imagem
        addImageToList(imageUrl, file.name); // Adiciona a imagem à lista com a legenda formatada
    });
});

// 2. Configuração do Drag and Drop
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => { // Previne o comportamento padrão para todos os eventos de arrastar e soltar
    dropZone.addEventListener(eventName, (e) => { // Previne o comportamento padrão do navegador (como abrir a imagem)
        e.preventDefault(); // Impede o comportamento padrão do navegador
        e.stopPropagation(); // Impede a propagação do evento para outros elementos
    }, false); 
});

['dragenter', 'dragover'].forEach(eventName => { // Adiciona estilos visuais ao arrastar arquivos sobre a zona de soltar
    dropZone.addEventListener(eventName, () => { // Muda a cor da borda e o fundo para indicar que a zona está ativa
        dropZone.style.borderColor = 'green'; // Indica que a zona de soltar está ativa
        dropZone.style.backgroundColor = '#f0f8ff'; // Cor de fundo leve para indicar que a zona de soltar está ativa
    }, false);
});

['dragleave', 'drop'].forEach(eventName => { // Restaura os estilos visuais quando o arrasto sai da zona ou quando ocorre o drop
    dropZone.addEventListener(eventName, () => { // Restaura a cor da borda e o fundo para o estado original
        dropZone.style.borderColor = '#ccc'; // Restaura a cor da borda para o estado original
        dropZone.style.backgroundColor = 'transparent'; // Restaura a cor de fundo para o estado original
    }, false);
});

dropZone.addEventListener('drop', (e) => { // Adiciona imagens arrastadas à lista
    const files = e.dataTransfer.files; // Obtém os arquivos arrastados
    Array.from(files).forEach(file => { // Itera sobre cada arquivo arrastado
        if (!file.type.startsWith('image/')) return;   // Ignora arquivos que não são imagens
        const imageUrl = URL.createObjectURL(file); // Cria uma URL temporária para a imagem
        addImageToList(imageUrl, file.name); // Adiciona a imagem à lista com a legenda formatada
    });
});

// 3. Botão de carregar fotos de amostra (Usando imagens reais que existem no projeto, ex: before.jpg)
sampleBtn.addEventListener('click', () => { // Adiciona imagens de amostra à lista
    // Certifique-se de usar nomes de ficheiros que realmente estão na sua pasta!
    const sampleImages = [ // Lista de imagens de amostra com nomes e caminhos corretos
        { name: 'hello.jpg', path: 'before.jpg' },        // Usando a imagem real do carro como teste
        { name: 'hello-world.jpg', path: 'after.jpg' }, // Usando a imagem real do carro como teste
        { name: 'a-sample-photo.jpg', path: 'before.jpg' } // Usando a imagem real do carro como teste
    ];

    sampleImages.forEach(sample => { // Itera sobre cada imagem de amostra
        addImageToList(sample.path, sample.name); // Adiciona a imagem de amostra à lista com a legenda formatada
    });
});
