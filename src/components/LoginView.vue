<script setup>
  import {GoogleLogin} from "vue3-google-login";
  import {useRouter} from "vue-router";
  import * as session from "@/session.js";
  import {ref} from "vue";
  const router = useRouter();

  async function handleGoogleLogin(response) {
    console.log("Google Response:", response)
    const idToken = response.credential;
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken })
    });

    const data = await res.json();
    console.log("Backend Response:", data);

    if(data.message === "successful"){
      session.setUser(data.user);
      await router.push('/home/friends');
    }
  }

  const username = ref("");
  const password = ref("");

  async function handleCredentialLogin() {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login/credentials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.value, password: password.value })
    })

    const data = await res.json();
    console.log("Backend Response:", data);
    if(data.message === "successful"){
      session.setUser(data.user);
      await router.push('/home/friends');
    }
  }

</script>

<template>
  <div class="form-container">
    <p class="title">Login</p>
    <div class="form" >
      <div class="input-group">
        <label for="username">Username</label>
        <input type="text" v-model="username" id="username" placeholder="Enter Username">
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" v-model="password" id="password" placeholder="Enter Password">
        <div class="forgot">
          <a rel="noopener noreferrer" href="#">Forgot Password ?</a>
        </div>
      </div>
      <button class="sign" @click="handleCredentialLogin">Sign in</button>
    </div>
    <div class="social-message">
      <div class="line"></div>
      <p class="message">Login with social accounts</p>
      <div class="line"></div>
    </div>
    <div class="social-icons">
      <button style="background-color: #181818">
        <GoogleLogin :callback="handleGoogleLogin"/>
      </button>

    </div>
    <p class="signup">Don't have an account?
      <RouterLink rel="noopener noreferrer" to="/home/friends" class="">Sign up</RouterLink>
    </p>
  </div>
</template>

<style scoped>

  .form-container {
    width: 320px;
    border-radius: 0.75rem;
    background-color: rgba(17, 24, 39, 1);
    padding: 2rem;
    color: rgba(243, 244, 246, 1);
    margin: 0 auto;
    position: relative;
    top: 25vh;
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    line-height: 2rem;
    font-weight: 700;
  }

  .form {
    margin-top: 1.5rem;
  }

  .input-group {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .input-group label {
    display: block;
    color: rgba(156, 163, 175, 1);
    margin-bottom: 4px;
  }

  .input-group input {
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid rgba(55, 65, 81, 1);
    outline: 0;
    background-color: rgba(17, 24, 39, 1);
    padding: 0.75rem 1rem;
    color: rgba(243, 244, 246, 1);
  }

  .input-group input:focus {
    border-color: rgba(167, 139, 250);
  }

  .forgot {
    display: flex;
    justify-content: flex-end;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175,1);
    margin: 8px 0 14px 0;
  }

  .forgot a,.signup a {
    color: rgba(243, 244, 246, 1);
    text-decoration: none;
    font-size: 14px;
  }

  .forgot a:hover, .signup a:hover {
    text-decoration: underline rgba(167, 139, 250, 1);
  }

  .sign {
    display: block;
    width: 100%;
    background-color: rgba(167, 139, 250, 1);
    padding: 0.75rem;
    text-align: center;
    color: rgba(17, 24, 39, 1);
    border: none;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
  }

  .social-message {
    display: flex;
    align-items: center;
    padding-top: 1rem;
  }

  .line {
    height: 1px;
    flex: 1 1 0;
    background-color: rgba(55, 65, 81, 1);
  }

  .social-message .message {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: rgba(156, 163, 175, 1);
  }

  .social-icons {
    display: flex;
    justify-content: center;
  }

  .social-icons {
    border-radius: 0.125rem;
    padding: 0.75rem;
    border: none;
    background-color: transparent;
    margin-left: 8px;
  }

  .social-icons .icon svg {
    height: 1.25rem;
    width: 1.25rem;
    fill: #fff;
  }

  .signup {
    text-align: center;
    font-size: 0.75rem;
    line-height: 1rem;
    color: rgba(156, 163, 175, 1);
  }
</style>