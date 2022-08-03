"use strict";

(async () => {
  const channel = await p2pCallee(new PortSignalHelper());
  console.log("callee ready");
  const videoWrapper = new VideoWrapper(document.querySelector("video"));
  console.log("videoWrapper");
  new Controller("video", videoWrapper, channel);
  console.log("Controller");
})();
