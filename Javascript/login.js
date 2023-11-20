window.addEventListener('load', () => {
    registrarSW();
});

async function registrarSW() {
    if('serviceWorker' in navigator) {
        try {
            await navigator
                .serviceWorker
                .register('serviceworker.js');
        } catch (e) {
            console.log('El SW no pudo ser registrado');
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    // Abrir o crear la base de datos IndexedDB
    const request = window.indexedDB.open("usuariosDB", 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        // Crear un almacén de objetos para los usuarios
        const objectStore = db.createObjectStore("usuarios", { keyPath: "username" });

        // Añadir algunos usuarios de ejemplo
        objectStore.add({ username: "admin", password: "1234", role: "admin" });
        objectStore.add({ username: "usuario", password: "1234", role: "admin" });
        objectStore.add({ username: "julio", password: "1234", role: "admin" });
    };

    request.onsuccess = function (event) {
        // La base de datos se ha abierto correctamente
        db = event.target.result;
    };

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos:", event.target.error);
    };
});

function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const transaction = db.transaction(["usuarios"], "readonly");
    const objectStore = transaction.objectStore("usuarios");
    const request = objectStore.get(username);

    request.onsuccess = function (event) {
        const user = event.target.result;

        if (user && user.password === password) {
            alert("Inicio de sesión exitoso");

            // Redirigir a la vista correspondiente
            if (user.role === "admin") {
                window.location.href = "./indexA.html";
            } else if (user.role === "usuario") {
                window.location.href = "../Usuario/index.html";
            }
        } else {
            alert("Nombre de usuario o contraseña incorrectos");
        }
    };

    request.onerror = function (event) {
        console.error("Error al buscar el usuario:", event.target.error);
    };
}
