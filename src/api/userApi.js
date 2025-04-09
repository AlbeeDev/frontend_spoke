const url = import.meta.env.VITE_BACKEND_URL

export async function getAllFriendsFromUserId(id){
    const res = await fetch(`${url}/friend/getAll`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
    });

    return await res.json();
}

export async function sendFriendRequest(id,username){
    const res = await fetch(`${url}/friend/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, username }),
    });

    return await res.json();
}

export async function replyFriendRequest(id,target,accepted){
    const res = await fetch(`${url}/friend/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, target , accepted }),
    });

    return await res.json();
}

export async function updateUserProfile(id,username,pfp){
    const res = await fetch(`${url}/settings/updateprofile`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id, username, pfp}),
    });

    return await res.json();
}