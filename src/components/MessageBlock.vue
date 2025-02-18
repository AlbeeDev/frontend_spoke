<script setup>

import RoundIcon from "@/components/RoundIcon.vue";

const { profileName, message } = defineProps({
  profileName: String,
  message: String
});

console.log(profileName, message)
</script>

<template>
<div class="message-block">
  <RoundIcon />
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