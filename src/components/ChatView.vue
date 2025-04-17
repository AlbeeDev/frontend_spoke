<script setup>

import ProfileBlock from "@/components/ProfileBlock.vue";
import {Icon} from "@iconify/vue";
import {useRoute, useRouter} from "vue-router";
import {nextTick, onMounted, onUnmounted, ref, watch} from "vue";
import MessageBlock from "@/components/MessageBlock.vue";
import {socket} from "@/api/socket.js";
import * as userApi from "@/api/userApi.js";
import * as chatApi from "@/api/chatApi.js";
import * as session from "@/session.js";

import ringtoneFile from "@/assets/ringtone.mp3";
const ringtone = new Audio(ringtoneFile);
ringtone.loop = true;

const fetchFriendData = async (id) =>{
  const { user } = await userApi.getUser(id)
  profileName.value = user.username;
  profileImage.value = user.pfp;
}

let chatId = ref("");
const getMessages = async (userid,target) =>{
  ({ messages: messages.value, chatId: chatId.value } = await chatApi.getChat(userid,target));
  console.log("joining chat", chatId.value);
  socket.emit("join chat", chatId.value);
}

const user = session.getUser()
const route = useRoute();
const router = useRouter();
const profileId = ref(route.params.profileId);
const profileName = ref('');
const profileImage = ref('');
const messages = ref([]);

let newMessage = ref("")


fetchFriendData(profileId.value);
getMessages(user._id,profileId.value);
watch(() => route.params.profileId, (newId) => {
  profileId.value = newId;
  fetchFriendData(profileId.value);
  getMessages(user._id,profileId.value);

});
/*
onBeforeMount(async () => {
  console.log("beforeMount", user.googleId, profileId.value);
  await getMessages(user.googleId, profileId.value);
})
*/
onMounted(() => {
  socket.on("chat message", (msg) => {
    messages.value.push(msg);
    console.log(msg);
  });
  socket.on("request-call", ({from}) => {
    if (from === user._id) {
      console.log("Ignoring self-call request");
      return;
    }
    callReceived.value = true;
    console.log("call incoming, accept or deny call");
    callResponsePromise.value = new Promise((resolve) => {
      // You could use a UI element that triggers this when the user accepts or denies the call
      // Assuming you have two buttons for accept and deny on the UI
      nextTick(() => {
        const acceptCallButton = document.querySelector(".accept-btn");
        const denyCallButton = document.querySelector(".deny-btn");

        console.log(acceptCallButton, denyCallButton);
        // If the user accepts the call:
        acceptCallButton.onclick = () => {
          console.log("User accepted the call");
          callAccepted.value = true;
          resolve(true); // Resolve with accepted status


        };

        // If the user denies the call:
        denyCallButton.onclick = () => {
          console.log("User denied the call");
          callAccepted.value = false;
          resolve(false); // Resolve with denied status
        };
      });

    });

    // Wait for the user's decision (accept or deny)
    callResponsePromise.value.then((accepted) => {
      if (accepted) {
        console.log("Call accepted by user. Proceeding...");
        callerId.value = from;
        socket.emit("reply-call", { from: user._id, to: chatId.value, accepted: true });
        // Proceed with call setup, like starting the call, creating the offer, etc.
        router.push('/home/call/'+callerId.value+'/'+chatId.value);
      } else {
        console.log("Call denied by user.");
        socket.emit("reply-call", { from: user._id, to: chatId.value, accepted: false });
        // Handle denied call (close the connection or clean up, etc.)
      }
    });
  });
  socket.on("reply-call", ({from, accepted}) => {
    if (from === user._id) {
      console.log("Ignoring self-call reply");
      return;
    }
    callerId.value = user._id;
    toggleCall()
    router.push('/home/call/'+callerId.value+'/'+chatId.value);
    console.log("reply-call", from, accepted);
  });

});

onUnmounted(() => {
  socket.off("chat message");
});

const sendMessage = () => {
  if (newMessage.value.trim() !== "") {
    socket.emit("chat message", { content: newMessage.value, sender: user._id, senderName: user.username, senderPfp: user.pfp, chatId: chatId.value });
    newMessage.value = "";
  }
};

let callActive = ref(false);
let callReceived = ref(false);
const callAccepted = ref(false);
const callResponsePromise = ref(null);
let callerId = ref("");

const toggleCall = async () => {
  const cv = document.querySelector(".chat-view");
  const btn = document.querySelector(".call-btn");
  if(callActive.value){
    cv.style.setProperty("--call-color", "chartreuse")
    btn.style.animationPlayState = "paused";
    ringtone.pause(); // Stop ringtone
    ringtone.currentTime = 0;
    callActive.value = false;
  }else {
    console.log("calling", chatId.value);
    socket.emit("request-call", {from: user._id, to: chatId.value});
    cv.style.setProperty("--call-color", "red")
    btn.style.animationPlayState = "running";
    await ringtone.play();
    callActive.value = true;
  }
}


</script>

<template>
  <div class="chat-view">
    <div class="cv-header">
      <ProfileBlock :profile-id="profileId" :profile-name="profileName" :profile-image="profileImage" :active="false"/>
      <h1>PROFILE ID {{ profileId }}</h1>
      <button v-if="callReceived" class="accept-btn">
        accept
      </button>
      <button v-if="callReceived" class="deny-btn">
        deny
      </button>
      <button class="call-btn" @click="toggleCall"><Icon icon="line-md:phone-call-filled" width="24" height="24"></Icon></button>
    </div>
    <div class="cv-body">
      <div class="cv-messages">
        <div class="cv-message">
          <MessageBlock v-for="message in messages" :key="message.id" :message="message.content" :profile-name="message.senderName" :profile-image="message.senderPfp"/>
        </div>
      </div>

      <div class="separator" ></div>
      <div class="cv-input">
        <input placeholder="Enter Your Message" class="cv-input-box" autocomplete="off" v-model="newMessage" />
        <button class="cv-send" @click="sendMessage"><Icon icon="material-symbols-light:send" width="24" height="24"></Icon></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .chat-view {
    --call-color: chartreuse;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .cv-header {
    background-color: #606060;
    height: 5%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }
  .call-btn{
    background-color: transparent;
    border-radius: 50px;
    color: var(--call-color);
    border: none;

    animation: blink 1s ease infinite;
    animation-play-state: paused;
  }

  .call-btn:hover{
    scale: 1.1;
  }

  @keyframes blink {
    50% {
      scale: 1.2;
    }
  }

  .separator {
    height: 2px;
    width: 99%;
    margin-top: 10px;
  }
  .cv-body {
    display: flex;
    flex-direction: column;
    height: 95%;
    justify-content: end;
    padding-left: 10px;
    padding-bottom: 10px;
  }
  .cv-input {
    background-color: #3e3e3e;
    padding: 5px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-right: 10px;
  }
  .cv-messages {
    overflow-x: clip;
    overflow-y: scroll;
    height: 100%;
    display: flex;
    flex-direction: column-reverse;
  }
  /* Custom scrollbar styles for WebKit browsers */
  .cv-messages::-webkit-scrollbar {
    width: 12px; /* Width of the scrollbar */
  }

  .cv-messages::-webkit-scrollbar-track {
    background: rgba(1, 1, 1, 0); /* Background of the scrollbar track */
    border-radius: 10px;
  }

  .cv-messages::-webkit-scrollbar-thumb {
    background: #888; /* Color of the scrollbar thumb */
    border-radius: 6px; /* Rounded corners for the thumb */
  }

  .cv-messages::-webkit-scrollbar-thumb:hover {
    background: #3e3e3e; /* Darker color on hover */
  }

  .cv-input-box{
    background-color: transparent;
    border: none;
    outline: none;
    color: white;
    font-size: 16px;
  }

  .cv-send {
    background-color: transparent;
    border: none;
    color: white;
    border-radius: 50px;
  }
  .cv-send:hover {
    background-color: #555;
  }
</style>