let clock_hour = document.getElementById('clock_hour');
let clock_minute = document.getElementById('clock_min');
let clock_second = document.getElementById('clock_sec');

function update_clock_time() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    clock_hour.innerText = hours;
    clock_minute.innerText = minutes;
    clock_second.innerText = seconds;
}

setInterval(update_clock_time, 500);