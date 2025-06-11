document.addEventListener("DOMContentLoaded", () => {
    // Adicionado para a chuva de corações fixa
    const EFEITO_CORACOES_ATIVADO = true;

    // --- CONTROLES DE VÍDEO ---
    const video = document.getElementById("video-surpresa");
    if (video) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => entry.isIntersecting ? video.play().catch(e => {}) : video.pause());
        }, { threshold: 0.5 });
        videoObserver.observe(video);
    }

    // --- CONTROLES DOS DOIS ÁUDIOS ---
    const audio1 = document.getElementById("audio-parte1");
    const audio2 = document.getElementById("audio-parte2");
    const botaoMusica = document.getElementById("botao-musica");
    
    // Procura por todos os elementos que têm a classe "capitulo"
    const capitulos = document.querySelectorAll(".capitulo");
    
    let musicaPodeTocar = false;

    // Inicia a música com o clique no botão
    botaoMusica.addEventListener("click", () => {
        musicaPodeTocar = true;
        botaoMusica.style.display = 'none';

        // Toca o primeiro áudio
        audio1.play().catch(e => console.error("Erro ao iniciar audio 1:", e));

        // O TRUQUE para pré-aprovar o segundo áudio no navegador
        audio2.muted = true;
        const promise = audio2.play();
        if (promise !== undefined) {
            promise.then(_ => {
                audio2.pause();
                audio2.muted = false;
            }).catch(error => {
                audio2.muted = false;
            });
        }
    });

    // Observador que vigia os capítulos para trocar a música
    const audioObserver = new IntersectionObserver((entries) => {
        if (!musicaPodeTocar) return;

        const capitulosVisiveis = entries.filter(entry => entry.isIntersecting);

        if (capitulosVisiveis.length > 0) {
            const capituloAtivo = capitulosVisiveis[capitulosVisiveis.length - 1];
            const chapterId = capituloAtivo.target.id;

            if (['prologo', 'capitulo1', 'capitulo2', 'capitulo3'].includes(chapterId)) {
                if (audio1.paused) {
                    audio2.pause();
                    audio1.play().catch(e => {});
                }
            } else if (['capitulo4', 'capitulo5'].includes(chapterId)) {
                if (audio2.paused) {
                    audio1.pause();
                    audio2.play().catch(e => {});
                }
            }
        }
    }, { threshold: 0.4 });

    // Pede para o observador vigiar todos os capítulos
    if(capitulos.length > 0) {
        capitulos.forEach(capitulo => {
            audioObserver.observe(capitulo);
        });
    }

    // --- EFEITO DE CHUVA DE CORAÇÕES ---
    if(EFEITO_CORACOES_ATIVADO) {
        const containerCoracoes = document.createElement('div');
        containerCoracoes.id = 'efeito-chuva-de-coracoes';
        document.body.appendChild(containerCoracoes);

        setInterval(() => {
            const coracao = document.createElement("div");
            coracao.classList.add("coracao");
            coracao.innerText = "💙";
            coracao.style.left = Math.random() * 100 + "vw"; // vw = viewport width
            coracao.style.animationDuration = (Math.random() * 3 + 3) + "s"; // entre 3 e 6 segundos
            coracao.style.opacity = Math.random();
            coracao.style.fontSize = (Math.random() * 16 + 10) + 'px'; // Tamanhos variados
            containerCoracoes.appendChild(coracao);

            setTimeout(() => {
                coracao.remove();
            }, 6000); // Remove depois de 6 segundos
        }, 150); // Cria um coração a cada 150ms
    }
});
