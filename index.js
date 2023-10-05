document.addEventListener("DOMContentLoaded", function () {
    const btn = document.getElementById("btn");
    const form = document.getElementById("notificacao-form");

    btn.addEventListener("click", (event) => {
        event.preventDefault();
        updateNotification();
    });

    function updateNotification() {
        const titulo = document.getElementById("titulo").value;
        const corpo = document.getElementById("corpo").value;

        window.electronAPI.notify(titulo, corpo);
        clear();
    }

    function clear() {
        const tituloInput = document.getElementById("titulo");
        const corpoInput = document.getElementById("corpo");

        tituloInput.value = "";
        corpoInput.value = "";
    }
});
