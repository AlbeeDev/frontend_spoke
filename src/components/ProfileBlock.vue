<script setup>

import {Icon} from "@iconify/vue";
import RoundIcon from "@/components/RoundIcon.vue";

const { profileId, profileName, active, request } = defineProps({
  profileId: String,
  profileName: String,
  profileImage: String,
  active: {type: Boolean, default: true}, //true button
  request: {type: Boolean, default: false}
});

const requestReply = async (accepted) => {
  console.log(profileId);
  const user = JSON.parse(sessionStorage.getItem('userdata'));
  //TODO CHANGE
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/friend/reply`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: user.googleId, target: profileId , accepted: accepted }),
  });

  const data = await res.json();
  console.log(data);
}
/*
const profileName = ref("");
const profileImage = ref("");
const friends = JSON.parse(sessionStorage.getItem("friends") || "[]");

function updateProfileData(id) {
  for (const friend of friends) {
    if (friend._id === id) {
      profileName.value = friend.username;
      profileImage.value = friend.pfp;
      break;
    }
  }
}

updateProfileData(profileId);

watch(() => profileId, (newProfileId) => {
  updateProfileData(newProfileId);
});

 */
</script>

<template>
  <RouterLink v-if="active" :to="'/home/chat/'+profileId" class="profile-block">
    <RoundIcon :pfp="profileImage"/>
    <h4>{{profileName}}</h4>

  </RouterLink>
  <div v-else class="profile-block-d">
    <div class="pb-sub">
      <RoundIcon :pfp="profileImage"/>
      <h4>{{profileName}}</h4>
    </div>
    <div v-if="request" class="pb-sub">
      <button class="accept" @click="requestReply(true)"><Icon icon="hugeicons:tick-01" width="24" height="24"></Icon></button>
      <button class="deny" @click="requestReply(false)"><Icon icon="gridicons:cross" width="24" height="24"></Icon></button>
    </div>
  </div>
</template>

<style scoped>
.profile-block {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
}
.profile-block:hover {
  background-color: #a5a5a5;
}
.profile-block-d {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  justify-content: space-between;
}
.pb-sub{
  display: flex;
  align-items: center;
  gap: 10px;
}
.accept{
  color: green;
  border-radius: 20px;
  border: 2px solid #3e3e3e;
  height: 35px;
  background-color: transparent;
}
.accept:hover{
  background-color: #8f8f8f;
  border: 2px solid #555555;
}
.deny{
  color: red;
  border-radius: 20px;
  border: 2px solid #3e3e3e;
  height: 35px;
  background-color: transparent;
}
.deny:hover{
  background-color: #8f8f8f;
  border: 2px solid #555555;
}
</style>