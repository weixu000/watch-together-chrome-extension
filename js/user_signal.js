"use strict";

/**
 *
 * @param {HTMLDivElement} div
 */
function UserSignalHelper(div) {
  this.sendSignal = function (name, s) {
    div.querySelector("p").textContent = JSON.stringify(s);
  };

  const signal = new Promise((r) => {
    div.querySelector("button").addEventListener("click", () => {
      r(JSON.parse(div.querySelector("textarea").value));
    });
  });

  this.recvSignal = async function (name) {
    return await signal;
  };
}
