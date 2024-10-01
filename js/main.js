import { get_location, get_position, set_city } from './location.js';
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

    set_city();

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


});

