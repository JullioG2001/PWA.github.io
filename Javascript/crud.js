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
    const form = document.getElementById("curiosityForm");
    const tableBody = document.getElementById("curiosityList");

    const request = window.indexedDB.open("curiosityDB", 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;

        const objectStore = db.createObjectStore("curiosities", { keyPath: "id", autoIncrement: true });

        objectStore.createIndex("cocktailName", "cocktailName", { unique: false });
        objectStore.createIndex("creationYear", "creationYear", { unique: false });
        objectStore.createIndex("cocktailCuriosity", "cocktailCuriosity", { unique: false });
    };

    request.onsuccess = function (event) {
        const db = event.target.result;

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            const cocktailName = form.cocktailName.value;
            const creationYear = form.creationYear.value;
            const cocktailCuriosity = form.cocktailCuriosity.value;

            if (cocktailName && creationYear && cocktailCuriosity) {
                addCuriosity(db, { cocktailName, creationYear, cocktailCuriosity }, tableBody);
                form.reset();
            } else {
                alert("Por favor, complete todos los campos.");
            }
        });

        displayCuriosities(db, tableBody);
    };

    request.onerror = function (event) {
        console.error("Error al abrir la base de datos:", event.target.error);
    };
});

function addCuriosity(db, curiosity, tableBody) {
    const transaction = db.transaction(["curiosities"], "readwrite");
    const objectStore = transaction.objectStore("curiosities");

    const request = objectStore.add(curiosity);

    request.onsuccess = function (event) {
        console.log("Curiosidad agregada exitosamente");
        displayCuriosities(db, tableBody);
    };

    request.onerror = function (event) {
        console.error("Error al agregar la curiosidad:", event.target.error);
    };
}

function displayCuriosities(db, tableBody) {
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }

    const objectStore = db.transaction("curiosities").objectStore("curiosities");

    objectStore.openCursor().onsuccess = function (event) {
        const cursor = event.target.result;

        if (cursor) {
            const row = tableBody.insertRow();
            const cells = [
                row.insertCell(0),
                row.insertCell(1),
                row.insertCell(2),
                row.insertCell(3),
            ];

            cells[0].textContent = cursor.value.cocktailName;
            cells[1].textContent = cursor.value.creationYear;
            cells[2].textContent = cursor.value.cocktailCuriosity;

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Eliminar";
            deleteButton.className = "btn btn-danger";
            deleteButton.addEventListener("click", function () {
                deleteCuriosity(db, cursor.key, tableBody);
            });

            cells[3].appendChild(deleteButton);

            cursor.continue();
        }
    };
}

function deleteCuriosity(db, id, tableBody) {
    const transaction = db.transaction(["curiosities"], "readwrite");
    const objectStore = transaction.objectStore("curiosities");
    const request = objectStore.delete(id);

    request.onsuccess = function () {
        console.log("Curiosidad eliminada exitosamente");
        displayCuriosities(db, tableBody);
    };

    request.onerror = function (event) {
        console.error("Error al eliminar la curiosidad:", event.target.error);
    };
}
