import { get_location, get_position } from './location.js';
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

function if_online() {
    return navigator.onLine;
}

// after document is fully loaded
document.addEventListener('DOMContentLoaded', async function () {
    setInterval(update_clock_time, 500);

    if (if_online()) {
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
            let prayer_times = get_prayer_time(adhan);
            console.log(prayer_times);
            set_prayer_time(prayer_times);}
    } catch (error) {
        console.log(error);
        Toast.fire({
            icon: "error",
            title: error
        });
    }

    
});

