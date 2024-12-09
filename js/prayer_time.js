import {get_position, get_location} from './location.js';

let prayer_index_map = {
    0: 'Fajr',
    1: 'Sunrise',
    2: 'Dhuhr',
    3: 'Asr',
    4: 'Maghrib',
    5: 'Isha',
    6: null
};

function get_prayer_time(adhan, date) {
    if(get_position() === null) {
        get_location();
        return;
    }

    let latitude = get_position().latitude;
    let longitude = get_position().longitude;
    const coordinates = new adhan.Coordinates(latitude, longitude);
    
    if(date === undefined) {
        date = new Date();
    }
    let params = adhan.CalculationMethod.MuslimWorldLeague();
    params.madhab = adhan.Madhab.Hanafi;
    
    let prayer_times = new adhan.PrayerTimes(coordinates, date, params);

    let current = prayer_times.currentPrayer();
    console.log("current", current);
    let next = prayer_times.nextPrayer();
    let nextPrayerTime = prayer_times.timeForPrayer(next);
    
    console.log("prayer_times", prayer_times);

    // Calculate forbidden times
    let forbiddenTimes = {
        afterFajr: prayer_times.fajr,
        sunrise: prayer_times.sunrise,
        afterAsr: prayer_times.asr,
        sunset: prayer_times.maghrib
    };
    
    // return prayer_times as an object
    return {
        fajr: prayer_times.fajr,
        sunrise: prayer_times.sunrise,
        dhuhr: prayer_times.dhuhr,
        asr: prayer_times.asr,
        maghrib: prayer_times.maghrib,
        isha: prayer_times.isha,
        current: current,
        nextPrayerName: prayer_index_map[next],
        nextPrayerTime: nextPrayerTime,
        forbiddenTimes: forbiddenTimes
    };
}

function set_prayer_time(adhan, date) {

    if(date === undefined) {
        date = new Date();
    } 
    let prayer_times = get_prayer_time(adhan, date);

    console.log("get_prayer_time", prayer_times);

    let sunrise = document.getElementById('sunrise');
    sunrise.innerText = formatTime(prayer_times.sunrise);
    let fajr = document.getElementById('fajr');
    let dhuhr = document.getElementById('dhuhr');
    let asr = document.getElementById('asr');
    let maghrib = document.getElementById('maghrib');
    let isha = document.getElementById('isha');
    let nextPrayerName = document.getElementById('next_wakt_name');
    let nextPrayerTime = document.getElementById('next_wakt_time');

    // format prayer times as HH:MM AM/PM. Currently, it is Date object
    fajr.innerText = formatTime(prayer_times.fajr);
    dhuhr.innerText = formatTime(prayer_times.dhuhr);
    asr.innerText = formatTime(prayer_times.asr);
    maghrib.innerText = formatTime(prayer_times.maghrib);
    isha.innerText = formatTime(prayer_times.isha);
    
    let now = new Date();
    let forbiddenMessage = null;
    let forbiddenEndTime = null;

    if (now >= prayer_times.sunrise && now < dateByAddingMinutes(prayer_times.sunrise, 15)) {
        forbiddenMessage = "Forbidden time: Until 15 minutes after Sunrise";
        forbiddenEndTime = dateByAddingMinutes(prayer_times.sunrise, 15);
    }
    else if (now >= dateByAddingMinutes(prayer_times.dhuhr, -6) && now < prayer_times.dhuhr) {
        forbiddenMessage = "Forbidden time: 6 minutes before Dhuhr";
        forbiddenEndTime = dateByAddingMinutes(prayer_times.dhuhr, -6);
    }
    else if (now >= dateByAddingMinutes(prayer_times.maghrib, -10) && now < prayer_times.maghrib) {
        forbiddenMessage = "Forbidden time: 10 minutes before Maghrib";
        forbiddenEndTime = dateByAddingMinutes(prayer_times.maghrib, -10);
    }

    if (forbiddenMessage) {
        document.querySelector('#norm_message').textContent = forbiddenMessage;
        document.querySelector('#next-prayer-time-text').style.display = 'block';
        // nextPrayerName.innerText = forbiddenMessage;
        let timeDifference = (forbiddenEndTime - now) / 1000; // time difference in seconds

        let hours = Math.floor(timeDifference / 3600);
        timeDifference %= 3600;
        let minutes = Math.floor(timeDifference / 60);
        timeDifference %= 60;
        let seconds = Math.floor(timeDifference);

        nextPrayerTime.innerText = `${hours}h ${minutes}m ${seconds}s`;
    } else if (prayer_times.nextPrayerName) {
        document.querySelector('#norm_message').textContent = "Time left to Next Prayer";
        document.querySelector('#next-prayer-time-text').style.display = 'block';
        nextPrayerName.innerText = prayer_times.nextPrayerName;
        let timeDifference = (prayer_times.nextPrayerTime - now) / 1000; // time difference in seconds

        let hours = Math.floor(timeDifference / 3600);
        timeDifference %= 3600;
        let minutes = Math.floor(timeDifference / 60);
        timeDifference %= 60;
        let seconds = Math.floor(timeDifference);

        nextPrayerTime.innerText = `${hours}h ${minutes}m ${seconds}s`;
    } else {
        document.querySelector('#next-prayer-time-text').style.display = 'none';
    }
}

// Helper function to format Date object to HH:MM AM/PM
function formatTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

// Helper function to add minutes to a date
function dateByAddingMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

export { get_prayer_time, set_prayer_time };