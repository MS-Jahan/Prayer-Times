import { get_location, get_position, set_city, location_search, get_location_from_device } from './location.js';
import { Toast } from './components.js';
import { get_prayer_time, set_prayer_time } from './prayer_time.js';
import { update_clock_time } from './time.js';


// after document is fully loaded
document.addEventListener('DOMContentLoaded', async function () {
    setInterval(function() {
        update_clock_time();
        set_prayer_time(adhan);
        set_city();
    }, 500);

    if (!navigator.onLine) {
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

});

