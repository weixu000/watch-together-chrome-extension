"use strict";

(async () => {
  const channel = await p2pCaller(new PortSignalHelper());
  console.log("caller ready");
  const videoWrapper = new VideoWrapper(document.querySelector("video"));
  console.log("videoWrapper");
  new Controller("video", videoWrapper, channel);
  console.log("Controller");
})();
