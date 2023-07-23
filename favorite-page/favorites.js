const favoritesContainer = document.getElementById('favoritesContainer');

// Function to display favorite movies
function displayFavorites() {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        const favorites = JSON.parse(storedFavorites);

        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<p>No favorite movies yet.</p>';
        } else {
            favoritesContainer.innerHTML = '';
            favorites.forEach(movie => {
                const { title, poster, imdbID } = movie;
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie');

                movieDiv.innerHTML = `
                    <h2>${title}</h2>
                    <img src="${poster}" alt="${title}" width="200" data-imdb-id="${imdbID}">
                    <button class="remove-button" data-imdb-id="${imdbID}">Remove</button>
                `;
                favoritesContainer.appendChild(movieDiv);
            });
        }

        // Add event listeners to remove buttons on the favorites page
        const removeButtons = document.querySelectorAll('.remove-button');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeMovieFromFavorites);
        });

        // Add event listener to the movie posters on the favorites page
        const moviePosters = document.querySelectorAll('.movie img');
        moviePosters.forEach(poster => {
            poster.addEventListener('click', openMovieDetails);
        });
    } else {
        favoritesContainer.innerHTML = '<h2 >No favorites added yet!</h2>';
    }
}

// Function to remove a movie from favorites
function removeMovieFromFavorites(event) {
    const imdbID = event.target.getAttribute('data-imdb-id');
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
        let favorites = JSON.parse(storedFavorites);
        favorites = favorites.filter(movie => movie.imdbID !== imdbID);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
    }
}

// Function to redirect to the movie details page
function openMovieDetails() {
    const imdbID = this.dataset.imdbId;
    window.location.href = `../movie-page/movie.html?id=${imdbID}`;
}

// Check local storage for stored favorite movies
displayFavorites();

// Add event listener to the "Home" heading to go back to the home page
const homeHeading = document.getElementById('Home');
homeHeading.addEventListener('click', function () {
    window.location.href = '../index.html';
});
