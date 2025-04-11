// ==UserScript==
// @name         Nexone - Listings - MLS Copy to Clipboard
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Checks for MLS number and adds copy icon in Nexone if found in specific containers only.
// @author       You
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @match        https://legend.nexone.ca/Secure/Sale/Property/Profile*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20MLS%20Copy%20to%20Clipboard-1.2.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20MLS%20Copy%20to%20Clipboard-1.2.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const MAX_ATTEMPTS = 5;
    const INTERVAL_MS = 1000;
    let attempts = 0;

    // Get the containers once, right away
    const container1 = document.getElementById('ctl00_ContentPlaceHolder1_mlsNoContainer');
    const container2 = document.getElementById('mlsNoContainer');

    // Exit early if neither container exists
    if (!container1 && !container2) {
        console.warn('❌ No MLS container found. Exiting script.');
        return;
    }

    const interval = setInterval(() => {
        attempts++;
        console.log(`🔄 Checking if MLS number is ready... Attempt ${attempts}/${MAX_ATTEMPTS}`);

        let span = null;

        if (container1) {
            span = container1.querySelector('span.profile-summary-field');
            if (span && span.textContent.trim()) {
                handleMLSFound(span);
                clearInterval(interval);
                return;
            }
        }

        if (container2) {
            span = container2.querySelector('span.profile-summary-field');
            if (span && span.textContent.trim()) {
                handleMLSFound(span);
                clearInterval(interval);
                return;
            }
        }

        if (attempts >= MAX_ATTEMPTS) {
            console.warn('⚠️ MLS number not found after 5 attempts. Stopping script.');
            clearInterval(interval);
        }

    }, INTERVAL_MS);

    function handleMLSFound(span) {
        const mlsValue = span.textContent.trim();
        console.log(`✅ MLS number found: ${mlsValue}`);

        // Create copy icon
        const copyImg = document.createElement('img');
        copyImg.src = '/Media/Images/Icons/page_copy.png';
        copyImg.alt = 'Copy';
        copyImg.title = 'Copy MLS to clipboard';
        copyImg.style.cursor = 'pointer';
        copyImg.style.marginLeft = '8px';
        copyImg.style.verticalAlign = 'middle';
        copyImg.width = 16;
        copyImg.height = 16;

        copyImg.addEventListener('click', () => {
            navigator.clipboard.writeText(mlsValue).then(() => {
                console.log(`📋 Copied MLS number: ${mlsValue}`);
            }).catch(err => {
                console.error('❌ Failed to copy MLS number', err);
            });
        });

        // Add icon next to the span (only once)
        if (!span.nextSibling || span.nextSibling.tagName !== 'IMG') {
            span.parentNode.insertBefore(copyImg, span.nextSibling);
        }
    }
})();
