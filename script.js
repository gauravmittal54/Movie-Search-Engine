const form = document.getElementById('form');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const searchList = document.getElementById('searchList');
const favoritesHeading = document.getElementById('Favorites');

const API_KEY = '788e9c72';
const BASE_URL = 'https://www.omdbapi.com/';

// Use a variable to store the last search term
let lastSearchTerm = '';

// Regular expression to match non-word characters (including spaces and special characters)
const nonWordRegex = /[\W_]+/g;

// Function to normalize the search term
function normalizeSearchTerm(searchTerm) {
    return searchTerm.toLowerCase().replace(nonWordRegex, '');
}

// Event listener for the search input
searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        // Clear the search results and hide the search list
        resultsDiv.innerHTML = '';
        searchList.style.display = 'none';
        return;
    }

    // Fetch the search results
    const normalizedSearchTerm = normalizeSearchTerm(searchTerm);
    const apiUrl = `${BASE_URL}?s=${encodeURIComponent(normalizedSearchTerm)}&page=1&apikey=${API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True' && data.Search) {
                displayResults(data.Search, normalizedSearchTerm);
                // Store the search results in local storage
                localStorage.setItem('searchResults', JSON.stringify(data.Search));
            } else {
                resultsDiv.innerHTML = '<p>No results found.</p>';
            }

            // Show all matching movie suggestions
            showMovieSuggestions(data.Search);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsDiv.innerHTML = '<p>OOPS! No results found</p>';
        });
});

function showMovieSuggestions(movies) {
    searchList.innerHTML = '';
    searchList.style.display = 'block';

    movies.forEach(movie => {
        const movieTitle = movie.Title;
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('search-item');
        suggestionItem.textContent = movieTitle;

        // Add click event listener to suggestion items
        suggestionItem.addEventListener('click', function () {
            // Navigate to movie.html with the selected movie's IMDb ID
            window.location.href = `movie-page/movie.html?id=${movie.imdbID}`;
        });

        searchList.appendChild(suggestionItem);
    });

    // Add event listener to hide the search list when clicking outside
    document.addEventListener('click', function (event) {
        const target = event.target;
        if (!searchList.contains(target) && target !== searchInput) {
            searchList.style.display = 'none';
        }
    });
}

// Event listener for the form submission
form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const searchTerm = searchInput.value.trim();
    if (searchTerm === '') {
        // Clear the search results and hide the search list
        resultsDiv.innerHTML = '';
        searchList.style.display = 'none';
        return;
    }

    // Fetch the search results
    const normalizedSearchTerm = normalizeSearchTerm(searchTerm);
    const apiUrl = `${BASE_URL}?s=${encodeURIComponent(normalizedSearchTerm)}&page=1&apikey=${API_KEY}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True' && data.Search) {
                displayResults(data.Search, normalizedSearchTerm);
                // Store the search results in local storage
                localStorage.setItem('searchResults', JSON.stringify(data.Search));
            } else {
                resultsDiv.innerHTML = '<p>No results found.</p>';
            }

            // Show all matching movie suggestions
            showMovieSuggestions(data.Search);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            resultsDiv.innerHTML = '<p>OOPS! No results found</p>';
        });
});


// Function to display the search results
function displayResults(movies, searchTerm) {
    if (movies.length === 0) {
        console.log("###")
        resultsDiv.innerHTML = '<h2 class="welcome-heading">WELCOME! SEARCH ANYTHING YOU WANT</h2>';
    } else {
        resultsDiv.innerHTML = '';
        movies.forEach(movie => {
            // Normalize the movie title and poster URL for comparison
            const { Title, Poster, imdbID } = movie;
            const normalizedTitle = normalizeSearchTerm(Title);
            const normalizedSearchTerm = searchTerm;

            // Check if the normalized movie title contains the normalized search term
            if (normalizedTitle.includes(normalizedSearchTerm)) {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('movie');
                // Handle cases where the poster URL is "N/A" and display a blank white image
                const posterUrl = Poster === 'N/A' ? 'https://via.placeholder.com/200x300?text=No+Poster' : Poster;
                movieDiv.innerHTML = `
                    <h2>${Title}</h2>
                    <img src="${posterUrl}" alt="${Title}" width="200" data-imdb-id="${imdbID}">
                    <button class="favorite-button" data-title="${Title}" data-poster="${posterUrl}">Add to Favorites</button>
                `;
                resultsDiv.appendChild(movieDiv);
            }
        });

        // Add event listeners to favorite buttons
        const favoriteButtons = document.querySelectorAll('.favorite-button');
        favoriteButtons.forEach(button => {
            button.addEventListener('click', toggleFavorite);
        });

        const moviePosters = document.querySelectorAll('.movie img');
        moviePosters.forEach(poster => {
            poster.addEventListener('click', openMovieDetails);
        });
    }
}

// Function to toggle favorite status and update favorites array
function toggleFavorite() {
    const title = this.dataset.title;
    const poster = this.dataset.poster;
    const imdbID = this.parentElement.querySelector('img').getAttribute('data-imdb-id');
    const movie = { title, poster, imdbID };

    if (favorites.some(favorite => favorite.title === title)) {
        // Movie is already in favorites, remove it
        favorites = favorites.filter(favorite => favorite.title !== title);
        this.textContent = 'Add to Favorites';
    } else {
        // Movie is not in favorites, add it
        favorites.push(movie);
        this.textContent = 'Remove from Favorites';
    }

    // Store the updated favorites in local storage
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Event listener for the Favorites heading to display favorite movies
favoritesHeading.addEventListener('click', displayFavorites);

function openMovieDetails() {
    const imdbID = this.dataset.imdbId;
    const lastSearchResults = JSON.stringify(JSON.parse(localStorage.getItem('searchResults')));

    // Navigate to movie.html and pass the last search results as a URL parameter
    window.location.href = `movie-page/movie.html?id=${imdbID}&lastSearchResults=${encodeURIComponent(lastSearchResults)}`;
}

// Function to display favorite movies
function displayFavorites() {
    // Instead of updating the content, redirect to favorites.html
    window.location.href = 'favorite-page/favorites.html';
}

// Check browser history state for stored search results
window.addEventListener('popstate', function (event) {
    const state = event.state;
    if (state && state.searchResults) {
        displayResults(state.searchResults, lastSearchTerm);
    }
});

// Check local storage for stored favorites
const storedFavorites = localStorage.getItem('favorites');
if (storedFavorites) {
    favorites = JSON.parse(storedFavorites);
}
