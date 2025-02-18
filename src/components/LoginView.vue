<script setup>
  import {GoogleLogin} from "vue3-google-login";
  import {useRouter} from "vue-router";
  import {nextTick, onMounted} from "vue";
  const router = useRouter();

  async function handleLogin(response) {
    console.log("Google Response:", response)
    const idToken = response.credential;

    const res = await fetch("http://localhost:3000/api/login/google", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: idToken })
    });

    const data = await res.json();
    console.log("Backend Response:", data);

    if(data.message === "successful"){
      sessionStorage.setItem("userdata", JSON.stringify(data.user));
      await router.push('/home/friends');
    }
  }

</script>

<template>
  <div class="form-container">
    <p class="title">Login</p>
    <form class="form" >
      <div class="input-group">
        <label for="username">Username</label>
        <input type="text" name="username" id="username" placeholder="">
      </div>
      <div class="input-group">
        <label for="password">Password</label>
        <input type="password" name="password" id="password" placeholder="">
        <div class="forgot">
          <a rel="noopener noreferrer" href="#">Forgot Password ?</a>
        </div>
      </div>
      <button class="sign">Sign in</button>
    </form>
    <div class="social-message">
      <div class="line"></div>
      <p class="message">Login with social accounts</p>
      <div class="line"></div>
    </div>
    <div class="social-icons">
      <RouterLink aria-label="Log in with Google" class="icon" to='/home/friends'>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" class="w-5 h-5 fill-current">
          <path d="M16.318 13.714v5.484h9.078c-0.37 2.354-2.745 6.901-9.078 6.901-5.458 0-9.917-4.521-9.917-10.099s4.458-10.099 9.917-10.099c3.109 0 5.193 1.318 6.38 2.464l4.339-4.182c-2.786-2.599-6.396-4.182-10.719-4.182-8.844 0-16 7.151-16 16s7.156 16 16 16c9.234 0 15.365-6.49 15.365-15.635 0-1.052-0.115-1.854-0.255-2.651z"></path>
        </svg>
      </RouterLink>
      <button style="background-color: #181818">
        <GoogleLogin :callback="handleLogin"/>
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
  }

  .social-message {
    display: flex;
    align-items: center;
    padding-top: 1rem;
  }

  .line {
    height: 1px;
    flex: 1 1 0%;
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

  .social-icons .icon {
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