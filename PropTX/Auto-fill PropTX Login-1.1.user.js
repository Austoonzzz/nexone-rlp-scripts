// ==UserScript==
// @name         Auto-fill PropTX Login
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto-fill login credentials on ampre sso with easy editing
// @match        https://sso.ampre.ca/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ✏️ EDIT THESE VALUES BELOW
    const USERNAME = 'XXXX'; // <- Change this to your username
    const PASSWORD = 'XXXX';    // <- Change this to your password
    // 🛑 DO NOT EDIT ANYTHING BELOW THIS LINE UNLESS YOU KNOW WHAT YOU'RE DOING

    function fillLogin() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (usernameInput && passwordInput) {
            usernameInput.value = USERNAME;
            passwordInput.value = PASSWORD;

            // Dispatch input events to ensure any event listeners are triggered
            usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
            // Retry if elements not found yet
            setTimeout(fillLogin, 300);
        }
    }

    window.addEventListener('load', fillLogin);
})();
