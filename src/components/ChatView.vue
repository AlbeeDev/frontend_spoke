<script setup>

import ProfileBlock from "@/components/ProfileBlock.vue";
import {Icon} from "@iconify/vue";
import {useRoute} from "vue-router";
import {onBeforeMount, ref, watch} from "vue";
import MessageBlock from "@/components/MessageBlock.vue";

const getData = (id) =>{
  const friends = JSON.parse(sessionStorage.getItem("friends"));
  for (const friend of friends) {
    if (friend._id === id.value) {
      profileName.value = friend.username;
      profileImage.value = friend.pfp;
      break;
    }
  }
}
const getMessages = async (id,target) =>{
  const res = await fetch("http://localhost:3000/api/chat/get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: id, target: target })
  });

  const data = await res.json();
  console.log("Backend Response:", data);
  messages.value = data.messages;
  console.log(messages.value);
}

const user = JSON.parse(sessionStorage.getItem('userdata'));
const route = useRoute();
const profileId = ref(route.params.profileId);
const profileName = ref('');
const profileImage = ref('');
const messages = ref([]);
getData(profileId);
//getMessages(user.googleId,profileId.value);
watch(() => route.params.profileId, (newId) => {
  profileId.value = newId;
  getData(profileId);
  //getMessages(user.googleId,profileId.value);
});

watch(messages, (newVal) => {
  console.log("Updated messages:", newVal);
}, { deep: true });

onBeforeMount(async () => {
  console.log("beforeMount", user.googleId, profileId.value);
  await getMessages(user.googleId, profileId.value);
})
</script>

<template>
  <div class="chat-view">
    <div class="cv-header">
      <ProfileBlock :profile-id="profileId" :profile-name="profileName" :active="false"/>
      <h1>THIS IS PROFILE ID {{ profileId}}</h1>
      <Icon icon="line-md:phone-call-filled" width="24" height="24"></Icon>
    </div>
    <div class="cv-body">
      <div class="cv-messages">
        <div class="cv-message">
          <MessageBlock v-for="message in messages" :key="message.id" :message="message.content" :profile-name="profileName"/>
        </div>
      </div>

      <div class="separator" ></div>
      <div class="cv-input">
        <h1>Chat</h1>
        <Icon icon="material-symbols-light:send" width="24" height="24"></Icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .chat-view {
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
    background: #555; /* Darker color on hover */
  }
</style>