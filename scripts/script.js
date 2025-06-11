document.addEventListener("DOMContentLoaded", () => {
    console.log("--- SCRIPT DEDO-DURO INICIADO ---");

    const audio1 = document.getElementById("audio-parte1");
    const audio2 = document.getElementById("audio-parte2");
    const botaoMusica = document.getElementById("botao-musica");
    const capitulos = document.querySelectorAll(".capitulo");

    // VERIFICAÇÃO DOS ARQUIVOS DE ÁUDIO
    if (!audio1) {
        console.error("ERRO CRÍTICO: Elemento de áudio com id 'audio-parte1' NÃO ENCONTRADO.");
    } else {
        console.log("Elemento de áudio 1 encontrado.", audio1);
        audio1.addEventListener('canplaythrough', () => console.log('%c✅ Áudio 1 PRONTO PARA TOCAR.', 'color: lightgreen; font-weight: bold;'));
        audio1.addEventListener('error', () => console.error('%c❌ ERRO AO CARREGAR ÁUDIO 1. Verifique o caminho/arquivo em src="' + audio1.src + '"', 'color: red; font-weight: bold;'));
    }

    if (!audio2) {
        console.error("ERRO CRÍTICO: Elemento de áudio com id 'audio-parte2' NÃO ENCONTRADO.");
    } else {
        console.log("Elemento de áudio 2 encontrado.", audio2);
        audio2.addEventListener('canplaythrough', () => console.log('%c✅ Áudio 2 PRONTO PARA TOCAR.', 'color: lightgreen; font-weight: bold;'));
        audio2.addEventListener('error', () => console.error('%c❌ ERRO AO CARREGAR ÁUDIO 2. Verifique o caminho/arquivo em src="' + audio2.src + '"', 'color: red; font-weight: bold;'));
    }

    if (capitulos.length === 0) {
        console.warn("AVISO: Nenhum capítulo com a classe '.capitulo' foi encontrado para observar.");
    } else {
        console.log(`Encontrados ${capitulos.length} capítulos para observar.`);
    }

    let musicaPodeTocar = false;

    botaoMusica.addEventListener("click", () => {
        musicaPodeTocar = true;
        botaoMusica.style.display = 'none';
        console.log("Botão clicado. Tentando tocar Áudio 1.");
        audio1.play().catch(e => console.error("Erro no play() inicial do Áudio 1:", e));

        // Truque de pré-aprovação
        audio2.muted = true;
        const promise = audio2.play();
        if (promise !== undefined) {
            promise.then(_ => {
                audio2.pause();
                audio2.muted = false;
                console.log("Áudio 2 pré-aprovado pelo navegador.");
            }).catch(error => {
                audio2.muted = false;
                console.error("Falha na pré-aprovação do Áudio 2. Isso pode ser um problema.", error);
            });
        }
    });

    const audioObserver = new IntersectionObserver((entries) => {
        if (!musicaPodeTocar) return;

        const capitulosVisiveis = entries.filter(entry => entry.isIntersecting);
        if (capitulosVisiveis.length > 0) {
            const capituloAtivo = capitulosVisiveis[capitulosVisiveis.length - 1];
            const chapterId = capituloAtivo.target.id;

            console.log(`Capítulo ativo detectado: ${chapterId}`);

            if (['prologo', 'capitulo1', 'capitulo2', 'capitulo3'].includes(chapterId)) {
                if (audio1.paused) {
                    console.log("Trocando para Áudio 1...");
                    audio2.pause();
                    audio1.play().catch(e => {});
                }
            } else if (['capitulo4', 'capitulo5'].includes(chapterId)) {
                if (audio2.paused) {
                    console.log("Trocando para Áudio 2...");
                    audio1.pause();
                    audio2.play().catch(e => {});
                }
            }
        }
    }, { threshold: 0.4 });

    capitulos.forEach(capitulo => {
        audioObserver.observe(capitulo);
    });
});
