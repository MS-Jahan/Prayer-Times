function update_clock_time() {
    // get current time
    let date = convertTimeZone(new Date(), get_timezone());

    let clock_hour = document.getElementById('clock_hour');
    let clock_minute = document.getElementById('clock_min');
    let clock_second = document.getElementById('clock_sec');
    let clock_ampm = document.getElementById('clock_ampm');

    let hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    hours = ("0" + hours).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2)
    let seconds = ("0" + date.getSeconds()).slice(-2)
    let ampm = date.getHours() >= 12 ? 'PM' : 'AM';

    clock_hour.innerText = hours;
    clock_minute.innerText = minutes;
    clock_second.innerText = seconds;
    clock_ampm.innerText = ampm;
}

function change_timezone() {
    let lat = localStorage.getItem('latitude');
    let lon = localStorage.getItem('longitude');

    // get timezone from lat and lon fetching https://timeapi.io/api/time/current/coordinate?latitude={lat}&longitude={lon}
    return fetch(`https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`)
        .then(response => response.json())
        .then(data => {
            let timezone = data.timeZone;
            localStorage.setItem('timezone', timezone ? timezone : Intl.DateTimeFormat().resolvedOptions().timeZone);
        })
        .catch(error => {
            console.log(error);
            Toast.fire({
                icon: "error",
                title: "Error getting timezone. Machine timezone will be used."
            });
            return Promise.resolve(); // Ensure a promise is returned even on error
        });
}

// from https://stackoverflow.com/a/54127122/12804377
function convertTimeZone(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
}

function get_timezone() {
    return localStorage.getItem('timezone') ? localStorage.getItem('timezone') : Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export { update_clock_time, change_timezone, get_timezone };