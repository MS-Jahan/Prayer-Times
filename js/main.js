import { get_location, get_position, set_city, location_search } from './location.js';
import { Toast } from './components.js';
import { get_prayer_time, set_prayer_time } from './prayer_time.js';

let clock_hour = document.getElementById('clock_hour');
let clock_minute = document.getElementById('clock_min');
let clock_second = document.getElementById('clock_sec');

function update_clock_time() {
    let date = new Date();
    let hours = ("0" + date.getHours()).slice(-2)
    let minutes = ("0" + date.getMinutes()).slice(-2)
    let seconds = ("0" + date.getSeconds()).slice(-2)

    clock_hour.innerText = hours;
    clock_minute.innerText = minutes;
    clock_second.innerText = seconds;
}

// after document is fully loaded
document.addEventListener('DOMContentLoaded', async function () {
    setInterval(function() {
        update_clock_time();
        set_prayer_time(adhan);
        set_city();
    }, 500);

    if (navigator.onLine) {
        Toast.fire({
            icon: "success",
            title: "Online"
        });
    } else {
        Toast.fire({
            icon: "info",
            title: "Offline"
        });
    }

    try {
        await get_location();
        if (get_position() === null) {
            Toast.fire({
                icon: "error",
                title: "Location not set"
            });
        } else {
            set_prayer_time(adhan);
        }
    } catch (error) {
        console.log(error);
        Toast.fire({
            icon: "error",
            title: error
        });
    }

    // Search bar functionality
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');

    searchInput.addEventListener('input', async function() {
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
                    });
                    searchResults.appendChild(item);
                });
                searchResults.classList.remove('hidden');
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

    document.addEventListener('click', function(event) {
        if (!searchBar.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.classList.add('hidden');
        }
        searchInput.value = '';
    });

});

