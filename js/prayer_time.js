import {get_position} from './location.js';

let prayer_index_map = {
    0: 'Fajr',
    1: 'Sunrise',
    2: 'Dhuhr',
    3: 'Asr',
    4: 'Maghrib',
    5: 'Isha'
};

function get_prayer_time(adhan) {
    let latitude = get_position().latitude;
    let longitude = get_position().longitude;
    const coordinates = new adhan.Coordinates(latitude, longitude);
    
    let date = new Date();
    let params = adhan.CalculationMethod.MuslimWorldLeague();
    params.madhab = adhan.Madhab.Hanafi;
    
    let prayer_times = new adhan.PrayerTimes(coordinates, date, params);

    let current = prayer_times.currentPrayer();
    let next = prayer_times.nextPrayer();
    let nextPrayerTime = prayer_times.timeForPrayer(next);
    
    
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
        nextPrayerTime: nextPrayerTime
    };
}

function set_prayer_time(prayer_times) {
    // let sunrise = document.getElementById('sunrise');
    // sunrise.innerText = prayer_times.sunrise;
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
    nextPrayerName.innerText = prayer_times.nextPrayerName;
    nextPrayerTime.innerText = formatTime(prayer_times.nextPrayerTime);
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

export { get_prayer_time, set_prayer_time };