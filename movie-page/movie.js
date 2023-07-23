const movieDetailsDiv = document.getElementById('movie-details');

// Function to load movie details
async function loadMovieDetails(movieId) {
    try {
        const result = await fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=bfd6b563`);
        const movieDetails = await result.json();
        displayMovieDetails(movieDetails);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        movieDetailsDiv.innerHTML = '<p>An error occurred while fetching movie details.</p>';
    }
}

// Function to display movie details on the page
function displayMovieDetails(details) {
    movieDetailsDiv.innerHTML = `
        <div class="movie-poster">
            <img src="${(details.Poster !== "N/A") ? details.Poster : "image_not_found.png"}" alt="movie poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>Writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors: </b>${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class="awards"><b><i class="fas fa-award"></i></b> ${details.Awards}</p>
        </div>
    `;
}

// Get the movie ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');
const lastSearchResults = urlParams.get('lastSearchResults');

// Add event listener to the "Home" heading to go back to the home page
const homeHeading = document.getElementById('Home');
homeHeading.addEventListener('click', function () {
    if (lastSearchResults) {
        // Navigate back to index.html and pass the last search results as a URL parameter
        window.location.href = `../index.html?lastSearchResults=${lastSearchResults}`;
    } else {
        // If no last search results, simply navigate back to index.html
        window.location.href = '../index.html';
    }
});

if (movieId) {
    loadMovieDetails(movieId);
} else {
    movieDetailsDiv.innerHTML = '<p>No movie details found.</p>';
}
