document.addEventListener("DOMContentLoaded", () => {

    // --- FEATURE 1: VÍDEO (Continua igual) ---
    const video = document.getElementById("video-surpresa");
    if (video) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => entry.isIntersecting ? video.play().catch(e => {}) : video.pause());
        }, { threshold: 0.5 });
        videoObserver.observe(video);
    }

    // --- FEATURE 2: TROCA DE MÚSICA (MÉTODO DE SCROLL - MAIS ROBUSTO) ---
    const player = document.getElementById("player");
    const botaoMusica = document.getElementById("botao-musica");
    const capitulos = document.querySelectorAll(".capitulo");
    const musicaParte1 = "audio/Matue-AnosLuz.mp3";
    const musicaParte2 = "audio/Lisboa.mp3";
    let musicaIniciada = false;
    let musicaAtual = musicaParte1;
    let scrollTimeout; // Variável para otimizar o scroll

    // O clique no botão continua igual
    botaoMusica.addEventListener("click", () => {
        musicaIniciada = true;
        botaoMusica.style.display = 'none';
        player.play().catch(e => {});
    });

    // A NOVA LÓGICA: Função que checa o capítulo no centro da tela
    function checarCapituloAtivo() {
        let capituloCentral = null;
        const centroDaTela = window.innerHeight / 2;

        capitulos.forEach(capitulo => {
            const rect = capitulo.getBoundingClientRect();
            // Verifica se o topo do capítulo está ACIMA do centro da tela
            // E se a base do capítulo está ABAIXO do centro da tela
            if (rect.top <= centroDaTela && rect.bottom >= centroDaTela) {
                capituloCentral = capitulo;
            }
        });

        // Se encontrou um capítulo no centro, decide a música
        if (capituloCentral) {
            const chapterId = capituloCentral.id;
            let proximaMusica = null;

            if (['prologo', 'capitulo1', 'capitulo2', 'capitulo3'].includes(chapterId)) {
                proximaMusica = musicaParte1;
            } else if (['capitulo4', 'capitulo5'].includes(chapterId)) {
                proximaMusica = musicaParte2;
            }

            // Se a música que deveria tocar é diferente da atual, faz a troca
            if (proximaMusica && proximaMusica !== musicaAtual) {
                musicaAtual = proximaMusica;
                player.src = musicaAtual;
                player.play().catch(e => {});
            }
        }
    }

    // O "SENSOR DE MOVIMENTO": Adiciona o listener de scroll na janela
    window.addEventListener('scroll', () => {
        if (!musicaIniciada) return;
        
        // Uma pequena otimização para não rodar o código em cada pixel de rolagem
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checarCapituloAtivo, 100); // Roda a checagem a cada 100ms
    });


    // --- FEATURE 3: CHUVA DE CORAÇÕES (Continua igual) ---
    const containerCoracoes = document.getElementById("efeito-chuva-de-coracoes");
    if (containerCoracoes) {
        setInterval(() => {
            const coracao = document.createElement("div");
            coracao.classList.add("coracao");
            coracao.innerText = "💙";
            coracao.style.left = Math.random() * 100 + "vw";
            coracao.style.animationDuration = (Math.random() * 4 + 4) + "s";
            coracao.style.opacity = Math.random() * 0.7 + 0.3;
            coracao.style.fontSize = (Math.random() * 16 + 10) + 'px';
            containerCoracoes.appendChild(coracao);
            setTimeout(() => {
                coracao.remove();
            }, 8000);
        }, 200);
    }
});
