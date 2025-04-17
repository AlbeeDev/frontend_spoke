<script setup>

import {ref} from "vue";
import * as userApi from "@/api/userApi.js";
import * as session from "@/session.js";

const user = session.getUser();
console.log(user);

const username = ref(user.username);
const pfp = ref(user.pfp);

const updateProfile = async () => {
  const { message } = await userApi.updateUserProfile(user._id, username.value, pfp.value)
  console.log("Backend Response:", message);
}

const handlePfpChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Only image files are allowed!");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("Image too large!");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/settings/uploadImage`, {
    method: "POST",
    contentType: "application/json",
    body: formData
  })

  const { url } = await res.json();
  console.log(url);
  pfp.value = url;
  session.getUser().pfp = pfp.value;
}

</script>

<template>
  <div class="container content text-white mt-4">
    <h4 class="mb-3">Settings</h4>

    <!-- Profile Picture -->
    <div class="mb-3 text-center">
      <img id="profilePicPreview" :src="pfp" class="rounded-circle border" width="120" height="120" :alt="pfp">
      <div class="mt-2">
        <label for="profilePicInput" class="btn btn-outline-primary btn-sm">
          Change Profile Picture
        </label>
        <input type="file" id="profilePicInput" class="d-none" @change="handlePfpChange">
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