const url = import.meta.env.VITE_BACKEND_URL;

export async function getChat(id,target) {
    const res = await fetch(`${url}/api/chat/get`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, target })
    });

    return await res.json();
}