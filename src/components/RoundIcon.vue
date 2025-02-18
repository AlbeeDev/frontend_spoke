<script setup>
import { Icon } from "@iconify/vue";
</script>

<template>
  <div class="iconbackground">
    <Icon icon="gg:profile"  width="24" height="24"></Icon>
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
  }
</style>