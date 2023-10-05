const { app, BrowserWindow, Notification, ipcMain } = require("electron");
const path = require("path");
const axios = require("axios");

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    mainWindow.loadFile("index.html");
};

app.whenReady().then(() => {
    createWindow();
    notify();
});

async function notify() {
    if (!Notification.isSupported()) {
        console.log("Notificacoes nao sao suportadas neste ambiente.");
        return;
    }

    await axios
        .get("http://localhost:3000/mostrarNotificacao")
        .then((response) => {

            if (response.data.notificacao.length > 0) {
                const notification = response.data.notificacao[0];
                const novaNotification = new Notification({
                    title: notification.titulo ?? "Aplicativo aberto",
                    body:
                        notification.corpo ?? "O aplicativo foi aberto com sucesso",
                    silent: true,
                    timeoutType: "default",
                });

                console.log("Exibindo notificação");
                novaNotification.show();
            }else {
                notifyError('Notificação não encontrada.');
            }
        })
        .catch((error) => {
            console.error("Error fetching character data:", error);
        });
}

app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

function updateNotification(titulo, corpo) {
    axios
        .patch("http://localhost:3000/atualizarNotificacao", {
            titulo,
            corpo,
            mostrar: true,
        })
        .then((response) => {
            console.log(response.data.message);
            notify();
        })
        .catch((error) => {
            // console.error("Erro ao atualizar notificacao:", error.response.data.error);
            notifyError(error.response.data.error);
        });
}

ipcMain.on("notify", (event, titulo, corpo) => {

    if (!corpo || !titulo) {
        
    }
    updateNotification(titulo, corpo);
});

function notifyError(error) {
    if (!Notification.isSupported()) {
        console.log("Notificacoes nao sao suportadas neste ambiente.");
        return;
    }

    if (error === "Notificação não encontrada.") {
        error = error+"\nCadastre uma notificação no banco de dados.";
    }

    const notification = new Notification({
        title: "Ocorreu um erro!",
        body: error,
        silent: true,
        timeoutType: "default",
    });

    console.log("Exibindo notificacao de erro: "+ error);
    notification.show();
}
