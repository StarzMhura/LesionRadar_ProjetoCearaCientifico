// const openButotn querySelectorAll ('')
const botaoTema = document.getElementById("toggleTema");

if (localStorage.getItem("tema") === "light") {
    document.documentElement.classList.add("light_mode");
    botaoTema.textContent = "☀️"
} else {
    botaoTema.textContent = "🌙"
}

botaoTema.addEventListener("click", () => {
    document.documentElement.classList.toggle("light_mode");

    if (document.documentElement.classList.contains("light_mode")) {
        botaoTema.textContent = "☀️";
        localStorage.setItem("tema", "light");
    } else {
        botaoTema.textContent = "🌙";
        localStorage.setItem("tema", "dark");
    }
});

// SCROLL SUAVE
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
        const alvo = document.querySelector(this.getAttribute("href"));
        if (!alvo) return;
        e.preventDefault();
        const alturaHeader = document.querySelector(".cabecalho").offsetHeight;
        const posicao = alvo.getBoundingClientRect().top + window.scrollY - alturaHeader - 16;
        window.scrollTo({ top: posicao, behavior: "smooth" });
    });
});

// BANCO DE EXERCÍCIOS
const exercicios = {
    peito:     ["Supino reto", "Supino inclinado", "Cruxifixo", "Flexão de braço", "Cross over"],
    costas:    ["Puxada Frontal", "Remada Curvada", "Remada Unilateral", "Pulldown", "Levantamento Terra"],
    ombro:     ["Desenvolvimento com Halteres", "Elevação Lateral", "Elevação Frontal", "Encolhimento", "Desenvolvimento Arnold"],
    biceps:    ["Rosca Direta", "Rosca Alternada", "Rosca Martelo", "Rosca Concentrada", "Rosca Scott"],
    triceps:   ["Tríceps Corda", "Tríceps Testa", "Tríceps Francês", "Mergulho no Banco", "Extensão Unilateral"],
    pernas:    ["Agachamento", "Leg Press", "Cadeira Extensora", "Cadeira Flexora", "Stiff", "Panturrilha em Pé"],
    gluteos:   ["Agachamento Sumô", "Hip Thrust", "Passada", "Abdução no Cabo", "Elevação Pélvica"],
    abdomen:   ["Prancha", "Abdominal Crunch", "Abdominal Bicicleta", "Elevação de Pernas", "Russian Twist"],
    cardio:    ["Esteira 20min", "Bike 20min", "Pular Corda 15min", "Polichinelo 3x30", "Corrida Leve 25min"],
    corpotodo: ["Burpee", "Agachamento com Salto", "Mountain Climber", "Flexão com Palma", "Kettlebell Swing"]
};

const gruposPorObjetivo = {
    hipertrofia:     [["peito","triceps","ombro"], ["costas","biceps"], ["pernas","gluteos"], ["peito","costas"], ["ombro","triceps","biceps"], ["pernas","gluteos"], ["abdomen","cardio"]],
    emagrecer:       [["corpotodo","cardio"], ["pernas","gluteos","cardio"], ["peito","costas","cardio"], ["corpotodo","abdomen"], ["pernas","cardio"], ["peito","costas","ombro"], ["cardio","abdomen"]],
    condicionamento: [["cardio","corpotodo"], ["pernas","abdomen"], ["peito","costas","cardio"], ["corpotodo","cardio"], ["pernas","gluteos"], ["cardio","abdomen"], ["corpotodo"]],
    forca:           [["peito","triceps"], ["costas","biceps"], ["pernas","gluteos"], ["ombro","trapezio"], ["peito","costas"], ["pernas"], ["abdomen","cardio"]],
    saude:           [["corpotodo","cardio"], ["pernas","abdomen"], ["peito","costas"], ["cardio","abdomen"], ["pernas","gluteos"], ["ombro","biceps","triceps"], ["cardio"]],
    flexibilidade:   [["cardio","abdomen"], ["pernas","gluteos"], ["corpotodo"], ["abdomen","cardio"], ["pernas"], ["corpotodo","abdomen"], ["cardio"]]
};

const seriasReps = {
    hipertrofia:     { series: "4", reps: "8–12",  descanso: "90s" },
    emagrecer:       { series: "3", reps: "15–20", descanso: "30s" },
    condicionamento: { series: "3", reps: "12–15", descanso: "45s" },
    forca:           { series: "5", reps: "4–6",   descanso: "2min" },
    saude:           { series: "3", reps: "12–15", descanso: "60s" },
    flexibilidade:   { series: "2", reps: "15",    descanso: "30s" }
};

const nomeObjetivo = {
    hipertrofia:     "Ganho de Massa Muscular",
    emagrecer:       "Emagrecimento",
    condicionamento: "Condicionamento Físico",
    forca:           "Ganho de Força",
    saude:           "Saúde e Bem-estar",
    flexibilidade:   "Flexibilidade"
};

const nomeDia = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

//GERAR FICHA
function gerarFicha(dados) {
    const secao = document.querySelector(".secao_fichas");
    const objetivo = dados.objetivo || "saude";
    const frequencia = Math.min(Math.max(parseInt(dados.frequencia) || 3, 1), 7);
    const config = seriasReps[objetivo] || seriasReps.saude;
    const grupos = gruposPorObjetivo[objetivo] || gruposPorObjetivo.saude;
    const imc = dados.peso && dados.altura
        ? (parseFloat(dados.peso) / Math.pow(parseFloat(dados.altura), 2)).toFixed(1)
        : "—";

    //REGIÕES A EVITAR SE HOUVER LESÕES
    const lesaoTexto = (dados.localLesao || "").toLowerCase();
    const evitar = [];
    if (lesaoTexto.includes("joelho") || lesaoTexto.includes("perna"))  evitar.push("pernas");
    if (lesaoTexto.includes("ombro"))  evitar.push("ombro");
    if (lesaoTexto.includes("costas") || lesaoTexto.includes("lombar")) evitar.push("costas");
    if (lesaoTexto.includes("punho")  || lesaoTexto.includes("braço"))  evitar.push("biceps","triceps");

    //MONTA OS DIAS
    let diasHTML = "";
    for (let i = 0; i < frequencia; i++) {
        const gruposDoDia = grupos[i].filter(g => !evitar.includes(g));
        const exs = [];
        gruposDoDia.forEach(g => {
            if (exercicios[g]) {
                exercicios[g].slice(0, 3).forEach(ex => exs.push({ nome: ex, grupo: g }));
            }
        });
        const exsFinal = exs.slice(0, 6);

        let linhas = exsFinal.map((ex, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${ex.nome}</strong><br><small>${ex.grupo.charAt(0).toUpperCase() + ex.grupo.slice(1)}</small></td>
                <td>${config.series}</td>
                <td>${config.reps}</td>
                <td>${config.descanso}</td>
            </tr>`).join("");

            diasHTML += `
        <div class="ficha_dia">
            <div class="ficha_dia_titulo">
                <span class="ficha_badge">DIA ${i + 1}</span>
                <h3>${nomeDia[i]} — ${gruposDoDia.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(", ")}</h3>
            </div>
            <table class="ficha_tabela">
                <thead>
                    <tr><th>#</th><th>Exercício</th><th>Séries</th><th>Reps</th><th>Descanso</th></tr>
                </thead>
                <tbody>${linhas}</tbody>
            </table>
        </div>`;
    }

    const avisoLesao = dados.lesao === "sim" ? `
        <div class="ficha_aviso">
            ⚠️ <strong>Atenção:</strong> você informou lesão em <strong>${dados.localLesao || "região não especificada"}</strong>. 
            Os exercícios dessa região foram evitados. Consulte um profissional antes de treinar.
        </div>` : "";
 
    secao.innerHTML = `
        <div class="ficha_wrapper">
            <div class="ficha_cabecalho">
                <h2>Ficha de Treino — ${dados.nome || "Aluno"}</h2>
                <p>${nomeObjetivo[objetivo]} • ${frequencia} dias/semana • IMC: ${imc}</p>
            </div>
 
            <div class="ficha_info">
                <span>🎂 ${dados.idade} anos</span>
                <span>⚖️ ${dados.peso} kg</span>
                <span>📏 ${dados.altura} m</span>
                <span>🏃 ${dados.esporte || "Não informado"}</span>
            </div>
 
            <div class="ficha_dias">${diasHTML}</div>
 
            ${avisoLesao}
 
            <div class="ficha_dicas">
                <h4>⚡ Dicas Importantes</h4>
                <ul>
                    <li>Faça sempre 5–10 minutos de aquecimento antes de começar</li>
                    <li>Mantenha a execução correta em todos os exercícios</li>
                    <li>Hidrate-se bem durante o treino</li>
                    <li>Respeite o descanso de ${config.descanso} entre as séries</li>
                    <li>Durma bem — o músculo cresce no descanso, não no treino</li>
                </ul>
            </div>
 
            <div class="ficha_acoes">
                <button onclick="window.print()" class="Primeiro_botao">🖨️ Imprimir</button>
                <button onclick="location.href='LaioRadarQuestionario/index_ques.html'" class="Primeiro_botao btn_secundario">↩ Refazer questionário</button>
            </div>
        </div>
    `;
 
    // Scroll suave até a ficha
    setTimeout(() => {
        secao.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
}

//LER O LOCALSTORAGE E EXIBE
const dadosSalvos = localStorage.getItem("respostasQuestionario");
if (dadosSalvos) {
    localStorage.removeItem("respostasQuestionario");
    const dados = JSON.parse(dadosSalvos);
    gerarFicha(dados);
}