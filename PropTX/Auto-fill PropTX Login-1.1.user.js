// ==UserScript==
// @name         Auto-fill PropTX Login
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto-fill login on dynamically-loaded Ampre SSO page with retry and logging
// @match        https://sso.ampre.ca/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ✏️ EDIT THESE VALUES BELOW
    const USERNAME = 'XXXX'; // <- Change this to your username
    const PASSWORD = 'XXXX';    // <- Change this to your password

    // 🔁 Retry settings
    const MAX_RETRIES = 5;
    const RETRY_INTERVAL = 500; // in milliseconds
    let attempts = 0;

    console.log('🚀 Script started. Watching for login fields...');

    const interval = setInterval(() => {
        attempts++;
        console.log(`🔍 Attempt #${attempts} to find and fill login fields`);

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (usernameInput && passwordInput) {
            usernameInput.value = USERNAME;
            passwordInput.value = PASSWORD;

            // Dispatch input events
            usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

            console.log('✅ Login fields filled successfully!');
            clearInterval(interval); // Stop checking
        } else if (attempts >= MAX_RETRIES) {
            console.error('❌ Could not find login fields after max retries.');
            clearInterval(interval);
        }
    }, RETRY_INTERVAL);
})();
