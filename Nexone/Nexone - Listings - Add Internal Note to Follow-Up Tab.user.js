// ==UserScript==
// @name         Nexone - Listings - Add Internal Note to Follow-Up Tab
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Adds "Add internal note", triggers Add Message, unchecks recipients, and simulates click on message container after unchecking.
// @author       You
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Add%20Internal%20Note%20to%20Follow-Up%20Tab.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Add%20Internal%20Note%20to%20Follow-Up%20Tab.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const NOTE_CLASS = "custom-internal-note";

    function injectNote() {
        const container = document.getElementById("messageThreadLinksContainer");
        if (!container || container.querySelector(`.${NOTE_CLASS}`)) return;

        const noteLink = document.createElement("a");
        noteLink.className = NOTE_CLASS;
        noteLink.style.color = "#555";
        noteLink.style.textDecoration = "none";
        noteLink.style.cursor = "pointer";
        noteLink.innerHTML = `
            <img style="vertical-align: top;" src="/Media/Images/Icons/note.png">
            <span style="text-decoration: underline;">Add internal note</span>
        `;

        noteLink.addEventListener("click", () => {
            const realAddLink = document.getElementById("addMessageLink");
            if (realAddLink) {
                realAddLink.click();

                // Uncheck checkboxes with retry logic on each click
                let tries = 0;
                const maxTries = 5;
                const interval = setInterval(() => {
                    const container = document.getElementById("sendMessageKnownRecipients");
                    if (container) {
                        const checkboxes = container.querySelectorAll("input.personCheck[type='checkbox']");
                        if (checkboxes.length > 0) {
                            checkboxes.forEach(cb => {
                                if (cb.checked) {
                                    cb.click(); // Uncheck the checkbox
                                    console.log("Unchecked:", cb);
                                }
                            });
                        }
                    }

                    // Stop the interval after max retries or simulate click on message container
                    if (++tries >= maxTries) {
                        clearInterval(interval);
                        console.warn("Uncheck attempt stopped after max retries.");

                        // Simulate click on #messageContainer after unchecking
                        const messageContainer = document.getElementById("messageContainer");
                        if (messageContainer) {
                            messageContainer.click(); // Simulate the click
                            console.log("Clicked message container");
                        } else {
                            console.warn("#messageContainer not found.");
                        }
                    }
                }, 400); // Retry every 400ms
            } else {
                console.warn("Add Message button not found.");
            }
        });

        container.appendChild(noteLink);
    }

    const observer = new MutationObserver(() => {
        const container = document.getElementById("messageThreadLinksContainer");
        if (container && container.offsetParent !== null) {
            injectNote();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Periodic fallback check (every 3s) in case DOM changes too rapidly
    setInterval(() => {
        const container = document.getElementById("messageThreadLinksContainer");
        if (container && container.offsetParent !== null) {
            injectNote();
        }
    }, 3000);
})();
