"use strict";

/**
 *
 * @param {string} name
 * @param {VideoWrapper} videoWrapper
 * @param {RTCDataChannel} channel
 */
function Controller(name, videoWrapper, channel) {
  const REMOTE_RESPONSE_COOLDOWN_MS = 100;
  const DIFFERENCE_TOLERANCE_SEC = 1;

  let coolDown = false;
  const waitToNotify = () => {
    if (coolDown) return;
    setTimeout(() => {
      coolDown = false;
      channel.send(
        JSON.stringify({ state: videoWrapper.state, time: videoWrapper.time })
      );
    }, REMOTE_RESPONSE_COOLDOWN_MS);
  };

  videoWrapper.on("statechange", (e) => {
    console.log(`${name} ${e.detail.state} ${e.detail.time}`);
    waitToNotify();
  });

  channel.addEventListener("message", (e) => {
    console.log(`${name} received ${e.data}`);
    const msg = JSON.parse(e.data);
    if (msg.state !== videoWrapper.state) {
      console.log(`${name} change state ${msg.state}`);
      videoWrapper.state = msg.state;
    }

    if (Math.abs(msg.time - videoWrapper.time) > DIFFERENCE_TOLERANCE_SEC) {
      console.log(`${name} change time ${msg.state}`);
      videoWrapper.time = msg.time;
    }
  });
}
