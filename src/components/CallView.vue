<script setup>
import {socket} from "@/api/socket.js";
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import * as session from "@/session.js";

const localStream = ref(null);
const remoteStream = ref(new MediaStream());
const localAudio = ref(null);
const remoteAudio = ref(null);
const peerConnection = ref(null);
let iceCandidateQueue = [];

const iceServers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }] // Google's public STUN server
};

const route = useRoute();
const chatId = ref(route.params.chatId);
const userId = session.user._id;
const callerId = ref(route.params.callerId);
const inputDeviceName = ref("");
const inputDeviceId = ref("");
const getInputDeviceName = async () => {
  try {
    navigator.mediaDevices.enumerateDevices().then(devices => {
      console.log('Devices found:', devices);
    }).catch(err => {
      console.error('Error enumerating devices:', err);
    });
    const devices = await navigator.mediaDevices.enumerateDevices();
    // Find the audio input device (microphone)
    const audioInput = devices.find(device => device.kind === "audioinput");
    console.log(devices);
    if (audioInput) {
      inputDeviceName.value = audioInput.label || "Unknown Device";
      inputDeviceId.value = audioInput.deviceId;
    } else {
      inputDeviceName.value = "No audio input device found";
    }
  } catch (error) {
    console.error("Error getting input devices:", error);
    inputDeviceName.value = "Error fetching device name";
  }

  console.log("final device registered: "+inputDeviceName.value);
};

onMounted(async () => {
  await getInputDeviceName();
  console.log("Mounted: Starting call...");
  await startCall();

  socket.on("offer", async ({from, offer}) => {
    console.log("Socket listener - Received offer from:", from);
    if (from !== userId) {
      console.log("Offer is not from the current user. Proceeding with offer handling...");
      await handleOffer(offer, from);
    } else {
      console.log("Ignoring offer from self.");
    }
  });

  socket.on("answer", async ({ from, answer }) => {
    console.log("Socket listener - Received answer from:", from);
    if(from !== userId) {
      try {
        await peerConnection.value.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("Answer set successfully.");
      } catch (error) {
        console.error("Error setting remote description for answer:", error);
      }
    } else {
      console.log("Ignoring offer from self.");
    }

  });

  socket.on("ice-candidate", ({ from, candidate }) => {
    console.log("Socket listener - Received ICE candidate from:", from, "current description status:",peerConnection.value.remoteDescription);
    iceCandidateQueue.push(candidate);
  });
});

async function startCall() {
  console.log("startCall: Initializing peer connection...");
  peerConnection.value = new RTCPeerConnection(iceServers);

  try {
    console.log("startCall: Requesting local media...");
    localStream.value = await navigator.mediaDevices.getUserMedia({ audio: {deviceId: inputDeviceId.value}} );
    console.log("startCall: Local media stream obtained.");
    localStream.value.getTracks().forEach(track => {
      console.log("startCall: Adding local track to peer connection.");
      peerConnection.value.addTrack(track, localStream.value);
    });
    const localAudioElement = this.$refs.localAudio;
    localAudioElement.srcObject = localStream.value;
    localAudioElement.play().catch(e => console.error("Error playing local audio:", e));

    peerConnection.value.ontrack = (event) => {
      console.log("startCall: Received remote track...");
      event.streams[0].getTracks().forEach(track => {
        console.log("startCall: Adding remote track to remote stream.");
        remoteStream.value.addTrack(track);
      });
      const remoteAudioElement = this.$refs.remoteAudio;
      remoteAudioElement.srcObject = remoteStream.value;
      remoteAudioElement.play().catch(e => console.error("Error playing remote audio:", e));
    };

    peerConnection.value.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("startCall: ICE candidate found, sending to target:", chatId.value);
        socket.emit("ice-candidate", { to: chatId.value, from: userId, candidate: event.candidate });
      }
    };
    console.log(callerId.value, userId);
    if (callerId.value === userId) {
      console.log("startCall: This is the caller. Creating offer...");
      const offer = await peerConnection.value.createOffer();
      await peerConnection.value.setLocalDescription(offer);
      console.log("startCall: Offer created, sending offer to target.", chatId.value);
      socket.emit("offer", { to: chatId.value, from: userId, offer });
    } else {
      console.log("startCall: This is the receiver, waiting for offer.");
    }
  } catch (error) {
    console.error("Error during startCall:", error);
  }
}

async function handleOffer(offer, from) {
  console.log("handleOffer: Handling offer from:", from);
  peerConnection.value = new RTCPeerConnection(iceServers);

  try {
    console.log("handleOffer: Requesting local media for offer...");
    localStream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("handleOffer: Local media stream obtained.");
    localStream.value.getTracks().forEach(track => {
      console.log("handleOffer: Adding local track to peer connection.");
      peerConnection.value.addTrack(track, localStream.value);
    });
    const localAudioElement = this.$refs.localAudio;
    localAudioElement.srcObject = localStream.value;
    localAudioElement.play().catch(e => console.error("Error playing local audio:", e));

    peerConnection.value.ontrack = (event) => {
      console.log("handleOffer: Received remote track...");
      event.streams[0].getTracks().forEach(track => {
        console.log("handleOffer: Adding remote track to remote stream.");
        remoteStream.value.addTrack(track);
      });
      const remoteAudioElement = this.$refs.remoteAudio;
      remoteAudioElement.srcObject = remoteStream.value;
      remoteAudioElement.play().catch(e => console.error("Error playing remote audio:", e));
    };

    peerConnection.value.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("handleOffer: ICE candidate found, sending to offeror:", from);
        socket.emit("ice-candidate", { to: chatId.value, from: userId, candidate: event.candidate });
      }
    };

    console.log("handleOffer: Setting remote description for offer...");
    await peerConnection.value.setRemoteDescription(new RTCSessionDescription(offer));
    console.log("handleOffer: Remote description set successfully.");

    iceCandidateQueue.forEach(candidate => {
      console.log("Adding queued ICE candidate:", candidate);
      peerConnection.value.addIceCandidate(new RTCIceCandidate(candidate))
          .catch(error => console.error("Error adding queued ICE candidate:", error));
    });
    iceCandidateQueue=[];

    const answer = await peerConnection.value.createAnswer();
    await peerConnection.value.setLocalDescription(answer);
    console.log("handleOffer: Answer created and set as local description.");
    console.log("sending answer to target:", chatId.value);
    socket.emit("answer", { to: chatId.value, from: userId, answer });
  } catch (error) {
    console.error("Error handling offer:", error);
  }
}

function endCall() {
  console.log("endCall: Ending call...");
  if (peerConnection.value) {
    console.log("endCall: Closing peer connection.");
    peerConnection.value.close();
    peerConnection.value = null;
  }

  if (localStream.value) {
    console.log("endCall: Stopping local media tracks.");
    localStream.value.getTracks().forEach(track => track.stop());
    localStream.value = null;
  }

  remoteStream.value = new MediaStream();
  console.log("endCall: Remote stream reset.");
}

function checkStatus(){
  console.log("peer connection state:",peerConnection.value.connectionState);
  console.log("ice connection state:",peerConnection.value.iceConnectionState);
  console.log("signaling state",peerConnection.value.signalingState);
  console.log("audio tracks", localStream.value.getAudioTracks()[0]);
  console.log("remote tracks", remoteStream.value);
  console.log("enabled",remoteStream.value.getAudioTracks()[0].enabled);
  console.log("muted",remoteStream.value.getAudioTracks()[0].muted);
  const audioElement = document.querySelector(".remoteaudio");
  console.log(audioElement.srcObject); // Should match remoteStream
  console.log(audioElement.paused); // Should be false
}

</script>

<template>
<div class="call-view">
  <h1>CALL VIEW</h1>
  <div v-if="inputDeviceName">
    <p>Current Microphone: {{ inputDeviceName }}</p>
  </div>
  <audio :srcObject="localStream" class="localaudio" autoplay></audio>
  <audio :srcObject="remoteStream" class="remoteaudio" autoplay></audio>
  <button @click="checkStatus">check status</button>
  <button @click="endCall">End Call</button>
</div>
</template>

<style scoped>
  .call-view {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
</style>