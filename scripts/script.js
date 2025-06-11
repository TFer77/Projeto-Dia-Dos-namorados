document.addEventListener("DOMContentLoaded", () => {

    // --- FEATURE 1: VÍDEO COM AUTOPLAY AO ROLAR ---
    const video = document.getElementById("video-surpresa");
    if (video) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(e => {});
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.5 });
        videoObserver.observe(video);
    }

    // --- FEATURE 2: TROCA DE MÚSICA COM PLAYER ÚNICO (A VERSÃO QUE FUNCIONA) ---
    const player = document.getElementById("player");
    const botaoMusica = document.getElementById("botao-musica");
    const capitulos = document.querySelectorAll(".capitulo");

    const musicaParte1 = "audio/Matue-AnosLuz.mp3";
    const musicaParte2 = "audio/Lisboa.mp3";
    
    let musicaIniciada = false;
    let musicaAtual = musicaParte1;

    botaoMusica.addEventListener("click", () => {
        musicaIniciada = true;
        botaoMusica.style.display = 'none';
        player.play().catch(e => console.error("Erro ao iniciar o player:", e));
    });

    const audioObserver = new IntersectionObserver((entries) => {
        if (!musicaIniciada) return;

        const capituloVisivel = entries.find(entry => entry.isIntersecting);
        if (!capituloVisivel) return;

        const chapterId = capituloVisivel.target.id;
        let proximaMusica = null;

        if (['prologo', 'capitulo1', 'capitulo2', 'capitulo3'].includes(chapterId)) {
            proximaMusica = musicaParte1;
        } else if (['capitulo4', 'capitulo5'].includes(chapterId)) {
            proximaMusica = musicaParte2;
        }

        if (proximaMusica && proximaMusica !== musicaAtual) {
            musicaAtual = proximaMusica;
            player.src = musicaAtual;
            player.play().catch(e => console.error("Erro ao trocar de música:", e));
        }
    }, { threshold: 0.6 });

    if (capitulos.length > 0) {
        capitulos.forEach(capitulo => {
            audioObserver.observe(capitulo);
        });
    }

    // --- FEATURE 3: CHUVA DE CORAÇÕES FIXA NA TELA ---
    const containerCoracoes = document.getElementById("efeito-chuva-de-coracoes");
    if (containerCoracoes) {
        setInterval(() => {
            const coracao = document.createElement("div");
            coracao.classList.add("coracao");
            coracao.innerText = "💙";
            coracao.style.left = Math.random() * 100 + "vw"; // 'vw' usa a largura da tela
            coracao.style.animationDuration = (Math.random() * 4 + 4) + "s"; // Duração entre 4 e 8 segundos
            coracao.style.opacity = Math.random() * 0.7 + 0.3; // Opacidade variada
            coracao.style.fontSize = (Math.random() * 16 + 10) + 'px'; // Tamanhos variados
            containerCoracoes.appendChild(coracao);

            // Remove o coração depois que a animação acaba para não sobrecarregar
            setTimeout(() => {
                coracao.remove();
            }, 8000); 
        }, 200); // Cria um coração novo a cada 200ms
    }
});
