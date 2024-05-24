document.addEventListener('DOMContentLoaded', () => {
    const thumbnailsContainer = document.getElementById('thumbnails');

    // Fetch data from the backend
    fetch('/api/movies')
        .then(response => response.json())
        .then(movies => {
            // Function to create thumbnail HTML
            function createThumbnail(movie) {
                return `
                    <div class="thumbnail">
                        <img src="${movie.image}" alt="${movie.title}">
                        <h3>${movie.title}</h3>
                        <p>${movie.description}</p>
                    </div>
                `;
            }

            // Insert thumbnails into the DOM
            thumbnailsContainer.innerHTML = movies.map(createThumbnail).join('');
        })
        .catch(error => console.error('Error fetching data:', error));

    // Check for token in localStorage on page load
    const token = localStorage.getItem('token');
    if (token) {
        showAuthenticatedLinks();
    }

    // Register form
    document.getElementById('register-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json())
            .then(data => alert(data.message))
            .catch(error => console.error('Error:', error));
    });

    // Login form
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    alert('Login successful');
                    showAuthenticatedLinks
