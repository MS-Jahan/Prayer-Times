import { location_search } from './location.js';
import { Toast } from './components.js';
import { change_timezone } from './time.js';

// Search bar functionality
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', async function () {
    const query = searchInput.value;
    if (query.length > 2) {
        try {
            const results = await location_search(query);
            searchResults.innerHTML = '';
            results.forEach(result => {
                const item = document.createElement('div');
                item.className = 'p-2 cursor-pointer hover:bg-gray-200';
                item.innerText = result.display_name;
                item.addEventListener('click', () => {
                    localStorage.setItem('city', result.display_name);
                    localStorage.setItem('latitude', result.lat);
                    localStorage.setItem('longitude', result.lon);
                    searchResults.classList.add('hidden');
                    searchInput.value = result.display_name;
                    Toast.fire({
                        icon: "success",
                        title: "Location set to " + result.display_name
                    });
                    searchInput.value = '';

                    change_timezone().then(() => {
                        // change location to / if current location is not /
                        if (window.location.pathname !== '/') {
                            setTimeout(() => {
                                redirectToIndex();
                            }, 1000);
                        }
                    });
                });
                searchResults.appendChild(item);
            });
            if (results.length > 0) {
                searchResults.classList.remove('hidden');
            } else {
                searchResults.classList.add('hidden');
            }
        } catch (error) {
            console.log(error);
            Toast.fire({
                icon: "error",
                title: "Error fetching search results."
            });
        }
    } else {
        searchResults.classList.add('hidden');
    }
});

document.addEventListener('click', function (event) {
    if (!searchBar.contains(event.target) && !searchResults.contains(event.target)) {
        searchResults.classList.add('hidden');
    }
    searchInput.value = '';
});