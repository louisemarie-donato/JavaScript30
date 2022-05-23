const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const playButton = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('.player__button');
const ranges = player.querySelectorAll('.player__slider');

let mousedown = false;

// play video function
function togglePlayButton() {
  const playMethod = video.paused ? 'play' : 'pause';
  video[playMethod]();
}

// change toggle icon
function updateToggleButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  playButton.textContent = icon;
}

// handle skip video progress
function skipVideo() {
  video.currentTime += parseFloat(this.dataset.skip);
}

// change the volume and playback ranges
function handleRange() {
  video[this.name] = this.value;
}

// show actual video progress
function handleVideoProgress() {
  const videoPercent = (video.currentTime / video.duration) * 100;
  progressBar.style.flexBasis = `${videoPercent}%`;
}

// update video progress when progress bar is clicked/dragged
function scrub(e) {
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

// video event listeners
playButton.addEventListener('click', togglePlayButton);
video.addEventListener('click', togglePlayButton);
video.addEventListener('play', updateToggleButton);
video.addEventListener('pause', updateToggleButton);

video.addEventListener('timeupdate', handleVideoProgress);

skipButtons.forEach((skipButton) =>
  skipButton.addEventListener('click', skipVideo)
);

ranges.forEach((range) => range.addEventListener('change', handleRange));
ranges.forEach((range) => range.addEventListener('mousemove', handleRange));

progress.addEventListener('click', scrub);
progress.addEventListener('mousemove', (e) => mousedown && scrub(e));
progress.addEventListener('mousedown', () => (mousedown = true));
progress.addEventListener('mouseup', () => (mousedown = false));
