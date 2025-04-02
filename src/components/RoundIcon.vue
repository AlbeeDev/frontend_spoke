<script setup>
import { Icon } from "@iconify/vue";
import { defineProps } from "vue";

const props = defineProps({
  pfp: String, // Optional image source
});

</script>

<template>
  <div class="iconbackground">
    <img v-if="pfp" :src="pfp" alt="Profile Image" class="profile-img" width="30" height="30" />
    <Icon v-else icon="gg:profile" width="24" height="24" />
  </div>
</template>

<style scoped>
  Icon {
    color: white;
  }
  .iconbackground {
    border-radius: 50%;
    background-color: #b1b1b1;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
</style>