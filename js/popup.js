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

chooseDiv.querySelector("#caller").addEventListener("click", async () => {
  console.log("Caller clicked");
  chooseDiv.classList.add("hidden");
  callerDiv.classList.remove("hidden");

  const signalHelper = new UserSignalHelper(callerDiv);
  const channel = await p2pCaller(signalHelper);
  console.log("caller ready");

  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    channel.send(Date.now());
  }
});
chooseDiv.querySelector("#callee").addEventListener("click", async () => {
  console.log("Callee clicked");
  chooseDiv.classList.add("hidden");
  calleeDiv.classList.remove("hidden");

  const signalHelper = new UserSignalHelper(calleeDiv);
  const channel = await p2pCallee(signalHelper);
  console.log("callee ready");

  channel.addEventListener("message", (e) => {
    console.log(`Received ${e.data} ${Date.now() - e.data}`);
  });
});
