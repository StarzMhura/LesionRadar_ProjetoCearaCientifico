// --- INTERCEPTAR O ENVIO DO FORMULÁRIO ---

// Selecionamos o formulário pelo ID dele
const formulario = document.getElementById("formEsportivo");

// Adicionamos um "ouvinte" para capturar o momento em que o usuário clica em enviar
formulario.addEventListener("submit", function(event) {
    
    // Evita o comportamento padrão do HTML de atualizar a página ao enviar
    event.preventDefault();

    // Coleta todas as respostas
    const dados = {
        nome:       document.getElementById("nome").value,
        idade:      document.getElementById("idade").value,
        peso:       document.getElementById("peso").value,
        altura:     document.getElementById("altura").value,
        esporte:    document.getElementById("esporte").value,
        frequencia: document.getElementById("frequencia").value,
        objetivo:   document.getElementById("objetivo").value,
        orientacao: (document.querySelector('input[name="orientacao"]:checked') || {}).value || "nao",
        lesao:      (document.querySelector('input[name="lesao"]:checked') || {}).value || "nao",
        localLesao: document.getElementById("local-lesao").value,
    };
 
    
    // Opcional: Limpa os campos do formulário após o envio
    formulario.reset();

    // Exibe uma mensagem de sucesso elegante na tela
    alert("Suas respostas foram enviadas com sucesso.");

    // Salva no localStorage para o index.html ler
    localStorage.setItem("respostasQuestionario", JSON.stringify(dados));


    // Volta para a página inicial
    window.location.href = "../index.html";
    });
