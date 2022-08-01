"use strict";

function DirectSignalHelper() {
  let signals = {};
  this.sendSignal = function (name, signal) {
    console.log(`sent signal from ${name}`);
    signals[name] = signal;
  };
  this.recvSignal = async function (name) {
    while (true) {
      await new Promise((r) => setTimeout(r, 0));
      if (signals[name]) {
        console.log(`received signal from ${name}`);
        return signals[name];
      }
    }
  };
}
