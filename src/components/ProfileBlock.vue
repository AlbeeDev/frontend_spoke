<script setup>

import {Icon} from "@iconify/vue";
import RoundIcon from "@/components/RoundIcon.vue";
import * as userApi from "@/api/userApi.js";
import * as session from "@/session.js";

let { profileId, profileName, profileImage, active, request } = defineProps({
  profileId: String,
  profileName: String,
  profileImage: String,
  active: {type: Boolean, default: true}, //true button
  request: {type: Boolean, default: false}
});

console.log("debug",profileId, profileName);

const requestReply = async (accepted) => {
  console.log(profileId);
  const { message } = await userApi.replyFriendRequest(session.getUser()._id,profileId,accepted);
  //TODO check failed
  console.log(message);
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

watch(() => profileId, async (newProfileId) => {
  //updateProfileData(newProfileId);
  const { user } = await userApi.getUser(newProfileId);
  profileName = user.username;
  profileImage = user.pfp;
  console.log("newProfileId", newProfileId, user);
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