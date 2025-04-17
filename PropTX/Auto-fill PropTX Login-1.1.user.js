// ==UserScript==
// @name         Auto-fill Ampre Login (Reliable Version)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto-fill login credentials on ampre sso with retry logic and easy editing
// @match        https://sso.ampre.ca/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ✏️ EDIT THESE VALUES BELOW
    const USERNAME = 'XXX'; // <- Change this to your username
    const PASSWORD = 'XXX';    // <- Change this to your password
    // 🛑 DO NOT EDIT BELOW THIS LINE UNLESS YOU KNOW WHAT YOU’RE DOING

    const MAX_ATTEMPTS = 5;
    const RETRY_DELAY = 500; // milliseconds
    let attempts = 0;

    function tryFillFields() {
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (usernameInput && passwordInput) {
            usernameInput.value = USERNAME;
            passwordInput.value = PASSWORD;

            // Trigger input events in case there are listeners
            usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
            passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

            console.log('[Ampre Autofill] Username and password set.');
        } else if (attempts < MAX_ATTEMPTS) {
            attempts++;
            console.log(`[Ampre Autofill] Attempt ${attempts} - inputs not found, retrying...`);
            setTimeout(tryFillFields, RETRY_DELAY);
        } else {
            console.warn('[Ampre Autofill] Failed to find login fields after multiple tries.');
        }
    }

    // Wait a moment after page load in case of dynamic content
    window.addEventListener('load', () => {
        setTimeout(tryFillFields, 500);
    });
})();
