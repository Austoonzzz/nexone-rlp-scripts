// ==UserScript==
// @name         Auto-fill PropTX Login
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto-fill login credentials on ampre sso with retry and logging
// @match        https://sso.ampre.ca/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ✏️ EDIT THESE VALUES BELOW
    const USERNAME = '9644712'; // <- Change this to your username
    const PASSWORD = '1500';    // <- Change this to your password

    // 🔁 Max number of retries
    const MAX_RETRIES = 5;
    let attempt = 0;

    function fillLogin() {
        attempt++;
        console.log(`🛠️ Attempt #${attempt} to fill login...`);

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (usernameInput && passwordInput) {
            usernameInput.value = USERNAME;
            passwordInput.value = PASSWORD;

            // Dispatch input events to trigger any reactive listeners
            usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

            console.log('✅ Login fields filled successfully!');
        } else {
            if (attempt < MAX_RETRIES) {
                console.warn(`⚠️ Login fields not found. Retrying in 500ms... (${attempt}/${MAX_RETRIES})`);
                setTimeout(fillLogin, 500);
            } else {
                console.error('❌ Failed to find login fields after maximum attempts.');
            }
        }
    }

    window.addEventListener('load', () => {
        console.log('🌐 Page loaded. Starting login fill process...');
        fillLogin();
    });
})();
