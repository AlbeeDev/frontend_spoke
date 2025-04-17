<script setup>

import RoundIcon from "@/components/RoundIcon.vue";
import {RouterView} from "vue-router";
import ProfileBlock from "@/components/ProfileBlock.vue";
import {Icon} from "@iconify/vue";
import {onBeforeMount, ref, watch} from "vue";
import * as userApi from "@/api/userApi.js";
import * as session from "@/session.js";

const user = session.getUser();
console.log("user session",user)

const friends = ref([]);

watch(friends, (newVal) => {
  console.log("Updated friends:", newVal);
}, { deep: true });

onBeforeMount(async () => {
  let friend_req;
  ({ friends: friends.value, friend_req } = await userApi.getAllFriendsFromUserId(user._id));
  session.setFriends(friends.value);
  session.setFriendRequests(friend_req);
})

</script>

<template>
  <div class="top-container">
    <div class="left-container">
      <div class="user-profile-control">
        <div class="user-block">
          <RoundIcon :pfp="user.pfp" />
          <h4>{{ user.username }}</h4>
        </div>
        <div class="control-block">
          <button class="control-btn">
            <Icon icon="mdi:microphone" width="24" height="24"></Icon>
          </button>
          <button class="control-btn">
            <Icon icon="ion:headset" width="24" height="24"></Icon>
          </button>
          <RouterLink to="/home/settings">
            <Icon icon="weui:setting-filled" width="24" height="24"></Icon>
          </RouterLink>


        </div>
      </div>
      <RouterLink class="title" style="text-align: center;margin-top: 20px" to="/home/friends"> <h2>Spoke</h2> </RouterLink>
      <h1 class="separator"></h1>
      <h4 class="title" style="text-align: center; margin-top: 10px">Personal Chats</h4>
      <div class="messages" >
        <ProfileBlock v-for="friend in friends" :key="friend._id" :profile-id="friend._id" :profile-name="friend.username" :profile-image="friend.pfp"/>
      </div>

    </div>
    <div class="right-container">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.top-container {
  display: flex;
  height: 100vh;
}
.left-container {
  background-color: #3e3e3e;
  width: 260px;
  height: 100%;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
}
.right-container {
  background-color: #555555;
  width: 85%;
  height: 100%;
}
.messages {
  display: flex;
  padding-top: 20px;
  flex-direction: column;
  overflow-x: clip;
  overflow-y: scroll;
  height: 100%;
}
/* Custom scrollbar styles for WebKit browsers */
.messages::-webkit-scrollbar {
  width: 12px; /* Width of the scrollbar */
}
.messages::-webkit-scrollbar-track {
  background: rgba(1, 1, 1, 0); /* Background of the scrollbar track */
  border-radius: 10px;
}

.messages::-webkit-scrollbar-thumb {
  background: #888; /* Color of the scrollbar thumb */
  border-radius: 6px; /* Rounded corners for the thumb */
}

.messages::-webkit-scrollbar-thumb:hover {
  background: #555; /* Darker color on hover */
}
.user-block {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding-left: 10px;
  flex-wrap: wrap;
}
.separator {
  width: auto;
  height: 5px;
  background-color: #555555;
}
.control-btn{
  color: #dadada;
  background-color: transparent;
  border: none;
  scale: 1.1;
}
.control-btn:hover {
  background-color: #555555;
  color: white;
  border-radius: 4px;
  padding: 3px;
  margin: 2px;
  scale: 1.1;
}
.control-block {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
  height: 40px;
}
</style>