"use strict";

function PortSignalHelper() {
  const port = chrome.runtime.connect();
  const msg = new Promise((r) => {
    port.onMessage.addListener(function (msg) {
      r(msg);
    });
  });

  this.sendSignal = function (name, signal) {
    port.postMessage(signal);
  };

  this.recvSignal = async function (name) {
    return await msg;
  };
}
