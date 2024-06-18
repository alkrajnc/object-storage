const usernameField = document.querySelector("#username-input");
const passwordField = document.querySelector("#password-input");
const loginButton = document.querySelector("#login-button");
const form = document.querySelector("#signin-form");

form.addEventListener("submit", async e => {
    e.preventDefault();
    console.log("submit");
});
