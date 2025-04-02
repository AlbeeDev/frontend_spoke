<script setup>

import RoundIcon from "@/components/RoundIcon.vue";

const { profileName, profileImage, message } = defineProps({
  profileName: String,
  profileImage: String,
  message: String
});

console.log(profileName, profileImage, message)
</script>

<template>
<div class="message-block">
  <RoundIcon :pfp="profileImage"/>
  <div class="message-sub">
    <h4>{{profileName}}</h4>
    <p>{{message}}</p>
  </div>

</div>
</template>

<style scoped>
  .message-block {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
  }
  .message-sub {
    display: flex;
    flex-direction: column;
    padding-left: 10px;
  }
</style>