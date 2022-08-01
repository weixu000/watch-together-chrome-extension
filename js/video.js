"use strict";

/**
 * Consider HTML5 Video pause and waiting as stop
 * @param {HTMLVideoElement} videoElement
 */
function VideoWrapper(videoElement) {
  Object.defineProperty(this, "time", {
    get: function () {
      return videoElement.currentTime;
    },
    set: function (time) {
      videoElement.currentTime = time;
    },
  });

  let state = "stop";
  Object.defineProperty(this, "state", {
    get: function () {
      return state;
    },
    set: function (state) {
      if (state === "play") {
        videoElement.play();
      } else if (state === "stop") {
        videoElement.pause();
      } else {
        console.log(`VideoWrapper unknown state: ${state}`);
      }
    },
  });

  const eventTarget = new EventTarget();
  this.on = function (type, listener) {
    eventTarget.addEventListener(type, listener);
  };
  const fireEvent = () => {
    const event = new CustomEvent("statechange", {
      detail: { state: state, time: videoElement.currentTime },
    });
    eventTarget.dispatchEvent(event);
  };

  videoElement.addEventListener("pause", () => {
    state = "stop";
    fireEvent();
  });
  videoElement.addEventListener("waiting", () => {
    state = "stop";
    fireEvent();
  });
  videoElement.addEventListener("playing", () => {
    state = "play";
    fireEvent();
  });
  videoElement.addEventListener("seeked", () => {
    state = videoElement.paused ? "stop" : "play";
    fireEvent();
  });
}
