
export function getUser() {
    return JSON.parse(sessionStorage.getItem('userdata'));
}

export function getFriends() {
    return JSON.parse(sessionStorage.getItem('friends') || "[]");
}

export function getFriendRequests() {
    return JSON.parse(sessionStorage.getItem('friend_requests') || "[]");
}

export function setUser(user) {
    sessionStorage.setItem("userdata", JSON.stringify(user));
}
export function setFriends(friends) {
    sessionStorage.setItem("friends", JSON.stringify(friends));
}
export function setFriendRequests(friendRequests) {
    sessionStorage.setItem("friend_requests", JSON.stringify(friendRequests));
}




