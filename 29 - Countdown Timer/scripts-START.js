let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
  // clear timer
  clearInterval(countdown);

  // get current time
  const time = Date.now();
  const timestamp = time + seconds * 1000;

  displayTimeRemaining(seconds);
  displayEndTime(timestamp);

  countdown = setInterval(() => {
    const remainingSeconds = Math.round((timestamp - Date.now()) / 1000);

    if (remainingSeconds < 0) {
      clearInterval(countdown);
      return;
    }

    displayTimeRemaining(remainingSeconds);
  }, 1000);
}

// minutes/seconds remaining
function displayTimeRemaining(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = seconds % 60;
  timerDisplay.textContent = `${minutes}:${
    secondsRemaining < 10 ? '0' : ''
  }${secondsRemaining}`;
}

// when time will end
function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const adjustedHour = hour > 12 ? hour - 12 : hour;
  const minutes = end.getMinutes();

  endTime.textContent = `Returning at ${adjustedHour}:${
    minutes < 10 ? '0' : ''
  }${minutes}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time);
  timer(seconds);
}

function submitCustomTime(e) {
  e.preventDefault();
  const mins = this.minutes.value;
  timer(mins * 60);
  this.reset;
}

buttons.forEach((button) => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', submitCustomTime);
