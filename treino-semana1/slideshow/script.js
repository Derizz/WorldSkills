// --- SELETORES GLOBAIS ---
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const galleryList = document.getElementById('galleryList');
const sampleBtn = document.getElementById('sampleBtn');

// Elementos do Slideshow
const slideshowContainer = document.getElementById('slideshowContainer');
const currentSlideImg = document.getElementById('currentSlideImg');
const currentSlideCaption = document.getElementById('currentSlideCaption');
const fullscreenBtn = document.getElementById('fullscreenBtn');

// --- ESTADO DA APLICAÇÃO ---
let photosArray = [];
let currentIndex = 0;
let currentMode = 'manual'; // 'manual', 'auto', 'random'
let currentTheme = 'theme-a'; // 'theme-a', 'theme-b'
let timerId = null; // Para controlar e cancelar os temporizadores

// Função de formatação de legenda
function formatCaption(filename) {
    const lastDotIndex = filename.lastIndexOf('.');
    let nameWithoutExt = lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
    let cleanName = nameWithoutExt.replace(/[-_]/g, ' ');
    return cleanName.replace(/\b\w/g, (char) => char.toUpperCase());
}

// --- MOSTRAR A FOTO ATUAL NO SLIDESHOW ---
function showSlide(index) {
    if (photosArray.length === 0) {
        currentSlideImg.src = '';
        currentSlideCaption.textContent = 'Nenhuma foto carregada';
        return;
    }

    if (index >= photosArray.length) currentIndex = 0;
    else if (index < 0) currentIndex = photosArray.length - 1;
    else currentIndex = index;

    const photo = photosArray[currentIndex];
    currentSlideImg.src = photo.src;
    currentSlideCaption.textContent = photo.caption;
}

// --- GERENCIAMENTO E CANCELAMENTO DE TEMPORIZADORES (Modos Automático e Aleatório) ---
function stopTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}

function setMode(mode) {
    stopTimer(); // Garante que cancela qualquer temporizador anterior antes de mudar
    currentMode = mode;

    if (currentMode === 'auto') {
        timerId = setInterval(() => {
            showSlide(currentIndex + 1);
        }, 3000);
    } else if (currentMode === 'random') {
        timerId = setInterval(() => {
            if (photosArray.length <= 1) return;
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * photosArray.length);
            } while (nextIndex === currentIndex); // Evita repetir a mesma foto duas vezes seguidas
            showSlide(nextIndex);
        }, 3000);
    } else {
        // Modo Manual: temporizador limpo, slideshow automático/aleatório cancelado com sucesso
        console.log("Modo Manual ativado - Slideshow automático/aleatório interrompido.");
    }
}

// --- TROCA DE TEMA ---
function setTheme(themeName) {
    currentTheme = themeName;
    slideshowContainer.className = ''; 
    slideshowContainer.classList.add(currentTheme);
}

// Redesenha a galeria mantendo a sincronização com o array de dados
function renderGallery() {
    galleryList.innerHTML = '';

    photosArray.forEach((photo, index) => {
        const li = document.createElement('li');
        li.draggable = true;
        li.dataset.index = index;

        const img = document.createElement('img');
        img.src = photo.src;
        img.width = 100;

        const span = document.createElement('span');
        span.textContent = ` ${photo.caption}`;

        li.appendChild(img);
        li.appendChild(span);

        // --- EVENTOS DE DRAG AND DROP (Reordenação) ---
        li.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', index);
            setTimeout(() => li.classList.add('dragging'), 0);
        });

        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            document.querySelectorAll('#galleryList li').forEach(item => {
                item.classList.remove('drag-over-top', 'drag-over-bottom');
            });
        });

        li.addEventListener('dragover', (e) => {
            e.preventDefault();
            const rect = li.getBoundingClientRect();
            const midpoint = rect.top + rect.height / 2;
            if (e.clientY < midpoint) {
                li.classList.add('drag-over-top');
                li.classList.remove('drag-over-bottom');
            } else {
                li.classList.add('drag-over-bottom');
                li.classList.remove('drag-over-top');
            }
        });

        li.addEventListener('dragleave', () => {
            li.classList.remove('drag-over-top', 'drag-over-bottom');
        });

        li.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
            const targetIndex = index;

            if (draggedIndex !== targetIndex) {
                const rect = li.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                let newIndex = targetIndex;
                if (e.clientY >= midpoint && draggedIndex < targetIndex) {
                    newIndex = targetIndex;
                } else if (e.clientY < midpoint && draggedIndex > targetIndex) {
                    newIndex = targetIndex;
                }

                const [movedItem] = photosArray.splice(draggedIndex, 1);
                photosArray.splice(newIndex, 0, movedItem);
                renderGallery();
                showSlide(currentIndex);
            }
        });

        galleryList.appendChild(li);
    });

    if (photosArray.length > 0 && currentIndex >= photosArray.length) {
        showSlide(0);
    }
}

// Adicionar novos ficheiros
function handleNewFiles(files) {
    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;
        const imageUrl = URL.createObjectURL(file);
        const caption = formatCaption(file.name);
        photosArray.push({ src: imageUrl, caption: caption });
    });
    renderGallery();
    if (photosArray.length === 1) showSlide(0);
}

fileInput.addEventListener('change', (event) => {
    handleNewFiles(event.target.files);
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
    }, false);
});

dropZone.addEventListener('drop', (e) => {
    handleNewFiles(e.dataTransfer.files);
});

sampleBtn.addEventListener('click', () => {
    const sampleImages = [
        { name: 'hello.jpg', path: 'before.jpg' },
        { name: 'hello-world.jpg', path: 'after.jpg' },
        { name: 'a-sample-photo.jpg', path: 'before.jpg' }
    ];

    sampleImages.forEach(sample => {
        photosArray.push({ src: sample.path, caption: formatCaption(sample.name) });
    });
    renderGallery();
    showSlide(0);
});

// --- NAVEGAÇÃO POR SETAS NO SLIDESHOW ---
document.addEventListener('keydown', (e) => {
    const isPaletteOpen = commandPalette.style.display === 'flex';
    if (isPaletteOpen) return;

    if (e.key === 'ArrowRight') {
        e.preventDefault();
        showSlide(currentIndex + 1);
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        showSlide(currentIndex - 1);
    }
});

// --- TELA CHEIA ---
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        slideshowContainer.requestFullscreen().catch(err => {
            alert(`Erro ao tentar modo tela cheia: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

// --- BARRA DE COMANDOS (PALETA) ---
const commandPalette = document.getElementById('commandPalette');
const paletteInput = document.getElementById('paletteInput');
const paletteList = document.getElementById('paletteList');

const allCommands = [
    { text: 'Modo: Manual (Parar Automático/Aleatório)', action: () => setMode('manual') },
    { text: 'Modo: Auto (Automático)', action: () => setMode('auto') },
    { text: 'Modo: Aleatório', action: () => setMode('random') },
    { text: 'Tema: A (Normal)', action: () => setTheme('theme-a') },
    { text: 'Tema: B (Com Animação)', action: () => setTheme('theme-b') },
    { text: 'Tema: C (Escuro)', action: () => document.body.style.backgroundColor = '#111' },
    { text: 'Tema: D (Claro)', action: () => document.body.style.backgroundColor = '#fff' },
    { text: 'Tema: E (Azul)', action: () => document.body.style.backgroundColor = '#e0f2fe' },
    { text: 'Tema: F (Verde)', action: () => document.body.style.backgroundColor = '#dcfce7' }
];

let filteredCommands = [...allCommands];
let selectedIndex = 0;
let previousActiveElement = null;

function renderPaletteList() {
    paletteList.innerHTML = '';
    if (filteredCommands.length === 0) {
        paletteList.innerHTML = '<li style="color: #94a3b8; text-align: center; padding: 12px;">Nenhum comando encontrado</li>';
        return;
    }

    filteredCommands.forEach((cmd, index) => {
        const li = document.createElement('li');
        li.textContent = cmd.text;
        if (index === selectedIndex) {
            li.classList.add('selected');
            li.scrollIntoView({ block: 'nearest' });
        }
        li.addEventListener('click', () => {
            cmd.action();
            closePalette();
        });
        paletteList.appendChild(li);
    });
}

function openPalette() {
    previousActiveElement = document.activeElement;
    commandPalette.style.display = 'flex';
    paletteInput.value = '';
    filteredCommands = [...allCommands];
    selectedIndex = 0;
    renderPaletteList();
    paletteInput.focus();
}

function closePalette() {
    commandPalette.style.display = 'none';
    if (previousActiveElement) previousActiveElement.focus();
}

document.addEventListener('keydown', (e) => {
    const isPaletteOpen = commandPalette.style.display === 'flex';

    if ((e.ctrlKey && e.key.toLowerCase() === 'k') || (e.key === '/' && !isPaletteOpen)) {
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
        e.preventDefault();
        openPalette();
        return;
    }

    if (isPaletteOpen) {
        if (e.key === 'Escape') {
            e.preventDefault();
            closePalette();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (filteredCommands.length > 0) {
                selectedIndex = (selectedIndex + 1) % filteredCommands.length;
                renderPaletteList();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (filteredCommands.length > 0) {
                selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
                renderPaletteList();
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredCommands[selectedIndex]) {
                filteredCommands[selectedIndex].action();
                closePalette();
            }
        }
    }
});

paletteInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    filteredCommands = allCommands.filter(cmd => cmd.text.toLowerCase().includes(query));
    selectedIndex = 0;
    renderPaletteList();
});