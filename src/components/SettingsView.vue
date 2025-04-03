<script setup>

import {ref} from "vue";

const user = JSON.parse(sessionStorage.getItem('userdata'));
console.log(user);

const username = ref(user.username);
const pfp = ref(user.pfp);


const updateProfile = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/settings/updateprofile`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({id: user.googleId, username: username.value, pfp: pfp.value}),
  });

  const data = await res.json();
  console.log("Backend Response:", data);
}

</script>

<template>
  <div class="container content text-white mt-4">
    <h4 class="mb-3">Settings</h4>

    <!-- Profile Picture -->
    <div class="mb-3 text-center">
      <img id="profilePicPreview" :src="pfp" class="rounded-circle border" width="120" height="120" alt="Profile Picture">
      <div class="mt-2">
        <label for="profilePicInput" class="btn btn-outline-primary btn-sm">
          Change Profile Picture
        </label>
        <input type="file" id="profilePicInput" class="d-none disabled" disabled @change="handleProfilePicChange">
      </div>
    </div>

    <!-- Username Input -->
    <div class="mb-3">
      <label for="usernameInput" class="form-label">Username</label>
      <input type="text" id="usernameInput" class="form-control" v-model="username">
    </div>

    <!-- Action Buttons -->
    <div class="d-flex justify-content-end gap-2">
      <button class="btn btn-primary" @click="updateProfile">Save Changes</button>
    </div>
  </div>

</template>

<style scoped>
.content{
  background-color: gray;
  height: 100vh;
}
</style>