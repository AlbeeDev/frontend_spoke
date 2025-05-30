import { reactive } from "vue";
import { io } from "socket.io-client";

export const state = reactive({
    connected: false,
});

const URL =  import.meta.env.VITE_BACKEND_URL;

export const socket = io(URL, { withCredentials: true });

socket.on("connect", () => {
    state.connected = true;
});

socket.on("disconnect", () => {
    state.connected = false;
});
