// ==UserScript==
// @name         Nexone - Listings - Missing Docs Notifier
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Ensures Notify button appears on page load and after tab switches. Fetches user name from email in header correctly now.
// @author       You
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Missing%20Docs%20Notifier-1.6.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Missing%20Docs%20Notifier-1.6.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to get the user's name based on email
    function getUserName() {
        const emailElement = document.querySelector('.header_user span'); // Target the <span> inside .header_user
        if (!emailElement) return ''; // Default name if not found

        const email = emailElement.textContent.trim();
        const emailToNameMap = {
            'aanderson@royallepage.ca': 'Austin',
            'clewis@performancerealty.ca': 'Tilly',
            'jsouannhaphanh@royallepage.ca': 'Jessica',
            'sAn@performancerealty.ca': 'Serena',
            'lesliec@royallepage.ca': 'Leslie'
        };

        return emailToNameMap[email] || ''; // Default to "BLANK" if email is not in the map
    }

    // Function to create and insert the Notify button
    function addNotifyButton() {
        const container = document.querySelector('.trAverageSeparator');
        if (!container || document.getElementById('missingDocsButton')) return; // Prevent duplicates

        const buttonDiv = document.createElement('div');
        buttonDiv.style.marginTop = '10px';

        const notifyButton = document.createElement('button');
        notifyButton.id = 'missingDocsButton';
        notifyButton.textContent = 'Notify of Missing Required Docs';

        // Apply requested CSS styles
        Object.assign(notifyButton.style, {
            background: '#254346',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            margin: '0',
            overflow: 'visible',
            padding: '3px 6px 5px',
            width: 'auto',
            borderColor: '#254346',
            border: '1px solid black'
        });

        // Button click event
        notifyButton.addEventListener('click', function() {
            triggerNotificationSequence();
        });

        buttonDiv.appendChild(notifyButton);
        container.insertAdjacentElement('afterend', buttonDiv);
    }

    // Function to observe tab content changes
    function observeTabContent() {
        const targetNode = document.querySelector('#ctl00_ContentPlaceHolder1_pnlMainContent'); // Main content area
        if (!targetNode) return;

        const observer = new MutationObserver(() => {
            setTimeout(addNotifyButton, 500); // Ensure button is re-added after tab refresh
        });

        observer.observe(targetNode, { childList: true, subtree: true });
    }

    // Function to observe tab switches
    function observeTabSwitches() {
        document.body.addEventListener('click', (event) => {
            if (event.target.matches('.pageTabLink')) {
                setTimeout(addNotifyButton, 1000); // Delay to allow tab content to load
            }
        });
    }

    // Function to trigger the Follow-Up and Notify actions
    function triggerNotificationSequence() {
        const followUpButton = document.querySelector('#ctl00_ContentPlaceHolder1__setFollowup');
        if (followUpButton) {
            followUpButton.click();

            // Wait for the Notify button to appear
            waitForElement('#notifyRealtor', (notifyButton) => {
                notifyButton.click();

                // Wait for the message container to appear
                waitForElement('#messageContainer', (messageContainer) => {
                    modifyMessage(messageContainer);
                });
            });
        }
    }

    // Function to modify the message
    function modifyMessage(messageContainer) {
        if (!messageContainer) return;

        // Remove "List of required documents missing:" if it exists
        messageContainer.innerHTML = messageContainer.innerHTML.replace("List of required documents missing:", "");

        // Get current time and determine greeting
        const currentTime = new Date();
        const greeting = currentTime.getHours() < 12 ? 'Good morning' : 'Good afternoon';

        // Get the user name from the email
        const userName = getUserName();

        // Insert greeting before auto-populated text
        messageContainer.innerHTML = `${greeting},<br><br>Could you kindly upload the following documents at your earliest convenience:<br>`
                                   + messageContainer.innerHTML
                                   + `<br><br>Thank you,<br><br>${userName}`;
    }

    // Function to wait for an element to exist in the DOM
    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, obs) => {
            const element = document.querySelector(selector);
            if (element) {
                obs.disconnect();
                callback(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Ensure button appears on initial page load
    waitForElement('.trAverageSeparator', addNotifyButton);
    observeTabContent();  // Watch for content changes when switching tabs
    observeTabSwitches(); // Detect tab clicks and restore button
})();
