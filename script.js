var shotTimes = [];
var imgScale = 1;
var increaseSize = true;

document.addEventListener('DOMContentLoaded', function () {
    setInterval(updateTimer, 1000);
    updateTimer();
    shotTimes = generateShotTimes();
    console.log(shotTimes);
    setInterval(checkShots, 1000);
    checkShots();
});

function timeUntilMidnight(){
    const currentTime = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);

    const timeRemaining = midnight - currentTime;

    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
    const seconds = Math.floor((timeRemaining / 1000) % 60);

    return { hours, minutes, seconds };
}

function updateTimer(){
    const { hours, minutes, seconds } = timeUntilMidnight();
    const timerDiv = document.getElementById('timer');
    timerDiv.innerHTML = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`
}

function getRandomTime(min, max){
    const intervalInMinutes = (max - min) / (1000 * 60);
    const randomNrOfMinutes = Math.floor(Math.random() * (intervalInMinutes - 20 + 1)) + 20;
    const result = new Date(min);
    result.setMinutes(randomNrOfMinutes);
    return result;
}

function generateShotTimes(){
    var startTime = new Date();
    var endTime = new Date();
    const startHour = 20; // Start at 20:00
    const endHour = 24; // End at midnight
    startTime.setHours(startHour, 0, 0, 0);
    endTime.setHours(endHour, 0, 0, 0);

    var shotTimes = [];

    for (i = 0; i < 4; i++){
        minTime = new Date();
        minTime.setHours(startHour + i);
        maxTime = new Date();
        maxTime.setHours(startHour + i + 1);
        const randomTime = getRandomTime(minTime, maxTime);
        shotTimes.push(randomTime);
    }

    // lifehack
    var lastTime = shotTimes.pop();
    if (lastTime.getMinutes() > 40){
        lastTime.setMinutes(lastTime.getMinutes() - 20);
    }
    shotTimes.push(lastTime);

    // TODO: REMOVE
    var temp = new Date();
    temp.setSeconds(temp.getSeconds() + 10);
    shotTimes.push(temp);

    return shotTimes;
}

function checkShots(){
    const currentTime = new Date();
    if (shotTimes.some(date => datesAreTheSame(date, currentTime))){
        console.log("SHOTS")
        const timerDiv = document.getElementById('timer');
        timerDiv.style.display = 'none'; // Show the div
        const hiddenDiv = document.getElementById('shots');
        hiddenDiv.style.display = 'flex'; // Show the div
        audio = new Audio('shots short.mp3');
        audio.play(); // Start playing the song

        // DANCE IMAGE
        const image = document.getElementById('image');
        const dancing = setInterval(() => {
            if (increaseSize)
                imgScale = 1.5;
            else
                imgScale = 1;
            increaseSize = !increaseSize;
            image.style.transform = `scale(${imgScale})`;
        }, 234.5); // Adjust speed (100ms = 10 frames per second)

        // Hide the div after 1 minute (60,000 milliseconds)
        setTimeout(() => {
            timerDiv.style.display = 'flex';
            hiddenDiv.style.display = 'none';
            clearInterval(dancing);
        }, 62000);
    }
}

function datesAreTheSame(a, b){
    return a.getHours() === b.getHours() && a.getMinutes() === b.getMinutes() && a.getSeconds() === b.getSeconds()
}

function padZero(value) {
    return value.toString().padStart(2, '0');
}
