"use strict";

async function gatherIceCandidates(pc) {
  const iceCandidates = [];
  pc.addEventListener("icecandidate", (e) => {
    // console.log(e.candidate);
    iceCandidates.push(e.candidate);
  });

  const iceComplete = new Promise((resolve) => {
    pc.addEventListener("icegatheringstatechange", () => {
      console.log(pc.iceGatheringState);
      switch (pc.iceGatheringState) {
        case "complete":
          console.log("ice gathering complete");
          resolve();
          break;
      }
    });
  });
  const receivedOne = new Promise(async (resolve) => {
    await new Promise((r) => setTimeout(r, 10000));
    console.log(
      "ice gathering takes too long, waiting for at least one candidate"
    );
    while (iceCandidates.length == 0) {
      await new Promise((r) => setTimeout(r, 10));
    }
    resolve();
  });
  await Promise.any([iceComplete, receivedOne]);

  return iceCandidates;
}

const RTC_PEER_CONNECTION_CONFIG = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.stun.twilio.com:3478?transport=udp" },
  ],
};

async function p2pCaller() {
  const pc = new RTCPeerConnection(RTC_PEER_CONNECTION_CONFIG);
  const channel = new Promise((resolve) => {
    const ch = pc.createDataChannel("dataChannel");
    ch.addEventListener("open", (e) => resolve(ch));
  });

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  // console.log(offer);

  const iceCandidates = await gatherIceCandidates(pc);

  const setRemoteSignal = async function (signal) {
    await pc.setRemoteDescription(signal.answer);
    for (const candidate of signal.iceCandidates) {
      await pc.addIceCandidate(candidate);
    }

    this.getReady = async function () {
      this.channel = await channel;
      return this.channel;
    };
  };

  return {
    localSignal: {
      offer: offer,
      iceCandidates: iceCandidates,
    },
    setRemoteSignal: setRemoteSignal,
  };
}

async function p2pCallee() {
  const pc = new RTCPeerConnection(RTC_PEER_CONNECTION_CONFIG);
  const channel = new Promise((resolve) => {
    pc.addEventListener("datachannel", (e) => {
      resolve(e.channel);
    });
  });

  const setRemoteSignal = async function (signal) {
    await pc.setRemoteDescription(signal.offer);
    for (const candidate of signal.iceCandidates) {
      await pc.addIceCandidate(candidate);
    }

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    const iceCandidates = await gatherIceCandidates(pc);

    this.localSignal = {
      answer: answer,
      iceCandidates: iceCandidates,
    };

    this.getReady = async function () {
      this.channel = await channel;
      return this.channel;
    };
  };

  const callee = {
    setRemoteSignal: setRemoteSignal,
  };

  return callee;
}
