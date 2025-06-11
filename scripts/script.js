document.addEventListener("DOMContentLoaded", () => {
    // --- CONTROLES DE VÍDEO ---
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

    // --- CONTROLES DOS DOIS ÁUDIOS ---
    const audio1 = document.getElementById("audio-parte1");
    const audio2 = document.getElementById("audio-parte2");
    const botaoMusica = document.getElementById("botao-musica");
    
    // Procura por todos os elementos que têm a classe "capitulo"
    const capitulos = document.querySelectorAll(".capitulo");
    
    let musicaPodeTocar = false;

    botaoMusica.addEventListener("click", () => {
        musicaPodeTocar = true;
        botaoMusica.style.display = 'none';
        audio1.play().catch(e => {});
    });

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

    capitulos.forEach(capitulo => {
        audioObserver.observe(capitulo);
    });

    // --- EFEITO DE CORAÇÕES CAINDO ---
    const containerCoracoes = document.querySelector(".container");
    if (containerCoracoes) {
        setInterval(() => {
            const coracao = document.createElement("div");
            coracao.classList.add("coracao");
            coracao.innerText = "💙";
            coracao.style.left = Math.random() * 100 + "%";
            coracao.style.animationDuration = (Math.random() * 3 + 2) + "s";
            containerCoracoes.appendChild(coracao);
            setTimeout(() => {
                coracao.remove();
            }, 5000);
        }, 300);
    }
});