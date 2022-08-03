const chooseDiv = document.querySelector("div.choose");
const callerDiv = document.querySelector("div.caller");
const calleeDiv = document.querySelector("div.callee");

const setupClipboardCopyButton = (div) => {
  div
    .querySelector("button.copy-to-clipboard")
    .addEventListener("click", async () => {
      const paragraph = div.querySelector("p");
      if (paragraph.textContent) {
        await navigator.clipboard.writeText(paragraph.textContent);
      }
    });
};
setupClipboardCopyButton(callerDiv);
setupClipboardCopyButton(calleeDiv);

const injectContentScript = async (scripts) => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: scripts,
  });

  return await new Promise((r) => {
    chrome.runtime.onConnect.addListener(function (port) {
      r(port);
    });
  });
};

const relaySignal = (port, div) => {
  port.onMessage.addListener(function (msg) {
    div.querySelector("p").textContent = JSON.stringify(msg);
  });

  const button = div.querySelector("button.submit");
  button.addEventListener("click", () => {
    port.postMessage(JSON.parse(div.querySelector("textarea").value));
    button.disabled = true;
  });
};

chooseDiv.querySelector("#caller").addEventListener("click", async () => {
  chooseDiv.classList.add("hidden");
  callerDiv.classList.remove("hidden");

  const port = await injectContentScript([
    "js/port_signal.js",
    "js/p2p.js",
    "js/video.js",
    "js/controller.js",
    "js/caller_content_script.js",
  ]);
  relaySignal(port, callerDiv);
});
chooseDiv.querySelector("#callee").addEventListener("click", async () => {
  const port = await injectContentScript([
    "js/port_signal.js",
    "js/p2p.js",
    "js/video.js",
    "js/controller.js",
    "js/callee_content_script.js",
  ]);
  relaySignal(port, calleeDiv);
  chooseDiv.classList.add("hidden");
  calleeDiv.classList.remove("hidden");
});
