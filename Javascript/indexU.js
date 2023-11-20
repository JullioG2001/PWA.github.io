
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

function searchCocktail() {
    const searchInput = document.getElementById('searchInput').value;

    if (!searchInput) {
        alert('Por favor, ingresa un término de búsqueda.');
        return;
    }

    $.ajax({
        type: "get",
        url: `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInput}&Language=es`,
        datatype: 'json',
        success: function (data) {
            if (data.drinks) {
                displayCocktailDetails(data.drinks[0]);
                setTimeout(() => {
                    notificacion(data.drinks[0].strDrink, data.drinks[0].strDrinkThumb);
                }, 3000); // Notificación después de 3 segundos
            } else {
                $('#cocktailDetails').html('No se encontraron resultados.');
                $('#cocktailImage').attr('src', '');
            }
        },
        error: function (error) {
            console.log(error.message);
        },
        complete: function (data) {
            console.log(data);
        }
    });
}

function getRandomCocktail() {
    const apiUrl = 'https://www.thecocktaildb.com/api/json/v1/1/random.php?Language=es';

    $.ajax({
        type: "get",
        url: apiUrl,
        datatype: 'json',
        success: function (data) {
            displayCocktailDetails(data.drinks[0]);
            setTimeout(() => {
                notificacion(data.drinks[0].strDrink, data.drinks[0].strDrinkThumb);
            }, 3000); // Notificación después de 3 segundos
        },
        error: function (error) {
            console.error('Error:', error);
            $('#cocktailDetails').html('Error al obtener datos del cóctel.');
            $('#cocktailImage').attr('src', '');
        }
    });
}

function displayCocktailDetails(cocktail) {
    const detailsElement = document.getElementById('cocktailDetails');
    detailsElement.innerHTML = `
        <h2>${cocktail.strDrink}</h2>
        <p>${cocktail.strInstructionsES || cocktail.strInstructions}</p>
        <p>Ingredientes:</p>
        <ul>
          ${displayIngredients(cocktail)}
        </ul>
      `;

    document.getElementById('cocktailImage').src = cocktail.strDrinkThumb;
}

function displayIngredients(cocktail) {
    let ingredientsList = '';
    for (let i = 1; i <= 15; i++) {
        const ingredient = cocktail[`strIngredient${i}`];
        const measure = cocktail[`strMeasure${i}`];

        if (ingredient && measure) {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else if (ingredient) {
            ingredientsList += `<li>${ingredient}</li>`;
        }
    }
    return ingredientsList;
}

$('#notificaciones').on('click', function () {
    Notification.requestPermission().then(function (result) {
        if (result === "granted") {
            mostrarNotificacion("Coctel-Api", "../Images/icon512.png");
        }
    });
});

$('#searchButton').on('click', function () {
    searchCocktail();
});

function mostrarNotificacion(title, imageUrl, year) {
    var options = {
        body: 'Se han activado las notificaciones',
        icon: imageUrl,
    };
    var notif = new Notification(title, options);
}

function notificacion(cocktailName, imageUrl) {
    setTimeout(() => {
        var notifTitle = "Coctel-Api";
        var notifBody = "Se ha buscado el cóctel " + cocktailName + ".";
        var notifImg = imageUrl;
        var options = {
            body: notifBody,
            icon: notifImg,
        };
        var notif = new Notification(notifTitle, options);
    }, 5000);
}
