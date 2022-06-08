const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);

      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error('Did not get video', err);
    });
}

function putVideoToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    let pixels = ctx.getImageData(0, 0, width, height);
    // pixels = redEffect(pixels);
    // pixels = splitRGB(pixels);
    pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const dataType = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = dataType;

  link.setAttribute('download', 'image');
  link.innerHTML = `<img src="${dataType}" alt="JS30 Image from webcam"/>`;

  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] += 100;
    pixels.data[i + 1] -= 100;
    pixels.data[i + 2] *= 0.5;
  }
  return pixels;
}

function splitRGB(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 100] = pixels.data[i];
    pixels.data[i - 50] = pixels.data[i + 1];
    pixels.data[i + 200] = pixels.data[i + 2];
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    const red = pixels.data[i];
    const green = pixels.data[i + 1];
    const blue = pixels.data[i + 2];
    const alpha = pixels.data[i + 3];

    if (
      red >= levels.rmin &&
      red <= levels.rmax &&
      green >= levels.gmin &&
      green <= levels.gmax &&
      blue >= levels.bmin &&
      blue <= levels.bmax
    ) {
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo();
video.addEventListener('canplay', putVideoToCanvas);
