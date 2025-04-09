<script setup>
import ProfileBlock from "@/components/ProfileBlock.vue";
import {ref} from "vue";
import * as userApi from "@/api/userApi.js";
import * as session from "@/session.js"

const { user, friends, friend_requests } = session;

const username_req = ref('');

const sendFriendRequest= async () => {
  const { message } = await userApi.sendFriendRequest(user._id, username_req.value);
  //TODO check failed
  console.log(message);
}
</script>

<template>
  <div class="container">
    <div class="friend-add">
      <h2>Add friend</h2>
      <input v-model="username_req" placeholder="username" />
      <button @click="sendFriendRequest">Add friend</button>
    </div>
    <div class="separator"></div>
    <div class="friend-block">
      <div class="friend-list">
        <h2>Friends</h2>
        <ProfileBlock v-for="friend in friends" :key="friend._id" :profile-id="friend._id" :profile-name="friend.username"/>
      </div>
      <div class="friend-req-list">
        <h2>Friend Requests</h2>
        <ProfileBlock v-for="friend_req in friend_requests" :key="friend_req._id" :profile-id="friend_req._id" :profile-name="friend_req.username" :request="true" :active="false"/>
      </div>
    </div>


  </div>
</template>

<style scoped>
  .container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
  }
  .separator {
    width: 100%;
    height: 5px;
    background-color: #3e3e3e;
  }
  .friend-list{
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .friend-req-list {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .friend-add{
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  .friend-block{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    padding: 10px;
    gap: 10px;
  }
</style>