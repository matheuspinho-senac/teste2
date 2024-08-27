function setupForm() {
    document.getElementById("courseForm").addEventListener('submit', function(event) {
        event.preventDefault();

        var formData = {
            curso: document.getElementById("course").value,
            cargaHoraria: document.getElementById("workload").value,
            eixo: document.getElementById("eixo").value,
            tipo: document.getElementById("tipo").value,
            uc: document.getElementById("uc").value,
            ch: document.getElementById("ch").value,
            situAprendizagem: document.getElementById("situAprendizagem").value,
        };

        localStorage.setItem("formData", JSON.stringify(formData));
        localStorage.setItem("situacaoAtual", "1"); // Inicializa com a primeira situação
        localStorage.setItem("todasSituacoes", JSON.stringify([])); // Inicializa array vazio para todas as situações
        localStorage.setItem("respostasSituacoes", JSON.stringify({})); // Inicializa objeto vazio para respostas das situações

        window.location.href = "situacao.html";
    });
}

document.addEventListener('DOMContentLoaded', setupForm);