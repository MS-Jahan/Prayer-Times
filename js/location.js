import { Toast } from './components.js';

function get_location_from_device() {
    // check if geolocation is available
    if (navigator.geolocation) {
        // show a toast before asking for permission
        Toast.fire({
            icon: "info",
            title: "Please allow location permission."
        });

        // check if permission is granted
        navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
            if (result.state === 'granted' || result.state === 'prompt') {
                navigator.geolocation.getCurrentPosition(show_position, show_error);
            } else if (result.state === 'denied') {
                Toast.fire({
                    icon: "error",
                    title: "Please allow location permission."
                });
            }
        }).catch(function (error) {
            console.log(error);
            Toast.fire({
                icon: "error",
                title: "Error getting location permission."
            });
        });
    } else {
        Toast.fire({
            icon: "error",
            title: "Geolocation is not supported by this browser."
        });
    }
}

function show_position(position) {
    // save location to local storage
    localStorage.setItem('latitude', position.coords.latitude);
    localStorage.setItem('longitude', position.coords.longitude);
}

function get_position() {
    let latitude = localStorage.getItem('latitude');
    let longitude = localStorage.getItem('longitude');

    if (latitude && longitude) {
        return {
            latitude: latitude,
            longitude: longitude
        };
    } else {
        return null;
    }
}


function get_location() {
    return new Promise((resolve, reject) => {
        let latitude = localStorage.getItem('latitude');
        let longitude = localStorage.getItem('longitude');
        
        if (latitude && longitude) {
            resolve();
        } else {
            console.log('No location found in storage, trying to get from device...');
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        localStorage.setItem('latitude', position.coords.latitude);
                        localStorage.setItem('longitude', position.coords.longitude);
                        resolve();
                    },
                    error => {
                        get_location_from_network().then(resolve).catch(reject);
                    }
                );
            } else {
                get_location_from_network().then(resolve).catch(reject);
            }
        }
    });
}

function show_error(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            Toast.fire({
                icon: "error",
                title: "User denied the request for Geolocation."
            });
            break;
        case error.POSITION_UNAVAILABLE:
            Toast.fire({
                icon: "error",
                title: "Location information is unavailable. Maybe device doesn't have GPS?"
            });
            break;
        case error.TIMEOUT:
            Toast.fire({
                icon: "error",
                title: "The request to get user location timed out."
            });
            break;
        case error.UNKNOWN_ERROR:
            Toast.fire({
                icon: "error",
                title: "An unknown error occurred."
            });
            break;
    }
}

function set_city() {
    let city = localStorage.getItem('city');
    if (!city) {
        get_location_from_network();
        city = localStorage.getItem('city');
    }
    
    // if city is still not found   
    if (!city) {
        city = 'Unknown';
    }

    document.getElementById('city_name').innerText = city;
}   


function get_location_from_network() {
    if(!navigator.onLine) {
        Toast.fire({
            icon: "error",
            title: "Network is offline. Failed to get location and city name via network."
        });
        return;
    }

    fetch('https://ipinfo.io/json')
        .then(response => response.json())
        .then(data => {
            let latitude = data.loc.split(',')[0];
            let longitude = data.loc.split(',')[1];
            let city = data.city;
            // save location to local storage
            localStorage.setItem('latitude', latitude);
            localStorage.setItem('longitude', longitude);
            localStorage.setItem('city', city);
            Toast.fire({
                icon: "success",
                title: "Location found from network."
            });
        })
        .catch(error => {
            console.log(error);
            Toast.fire({
                icon: "error",
                title: "Error getting location and city name from network."
            });
        });
}

export { get_location, get_position, set_city };