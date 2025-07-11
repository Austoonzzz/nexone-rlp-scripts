// ==UserScript==
// @name         Nexone - Listings - Edit Functionality for Blue Tag In Documents Tab (Disabled)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  ❌ This script has been disabled and does nothing.
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @match        https://legend.nexone.ca/Secure/Sale/Property/Profile*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Edit%20Functionality%20for%20Blue%20Tag%20In%20Documents%20Tab-1.7.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Edit%20Functionality%20for%20Blue%20Tag%20In%20Documents%20Tab-1.7.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /*
    🚫 This script has been intentionally disabled.
    The original functionality is preserved below in case reactivation is needed.

    console.log("Tampermonkey script running on:", window.location.href);

    if (window.location.href.includes("Documents.aspx")) {
        observeBlueTagChanges();
    }

    if (window.location.href.includes("Profile")) {
        let attempts = 0;
        const maxAttempts = 5;
        const checkInterval = 100;

        const interval = setInterval(() => {
            attempts++;
            console.log(`🔄 Checking if Profile page is ready... Attempt ${attempts}/${maxAttempts}`);

            const editButton = document.querySelector("#switchProfileText");
            if (editButton) {
                console.log("✅ Profile page loaded. Proceeding to edit...");
                clearInterval(interval);
                processProfilePage();
            } else if (attempts >= maxAttempts) {
                console.log("❌ Profile page did not load in time. Stopping script.");
                clearInterval(interval);
            }
        }, checkInterval);
    }

    function observeBlueTagChanges() {
        console.log("Observing blue tag changes on Documents page...");

        const targetSpan = document.querySelector(".tags-wrapper .tag-div.blue-tag span");

        if (!targetSpan) {
            console.warn("Target span not found. Retrying in 2 seconds...");
            setTimeout(observeBlueTagChanges, 2000);
            return;
        }

        console.log("Observing changes to:", targetSpan);

        let lastText = targetSpan.innerText.trim();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList" || mutation.type === "characterData") {
                    let newText = targetSpan.innerText.trim();
                    if (newText !== lastText) {
                        console.log("Detected change in blue tag text:", newText);

                        localStorage.setItem("blueTag", newText);
                        console.log("Stored new blue tag text in localStorage.");

                        clickViewListing();
                    }
                    lastText = newText;
                }
            });
        });

        observer.observe(targetSpan, { childList: true, characterData: true, subtree: true });
    }

    function clickViewListing() {
        let viewListingLink = document.querySelector("#ctl00_ContentPlaceHolder1__profilePropertyLink");

        if (viewListingLink) {
            console.log("Clicking 'View Listing' link...");
            viewListingLink.click();
        } else {
            console.warn("View Listing link not found!");
        }
    }

    function processProfilePage() {
        setTimeout(() => {
            const blueTag = localStorage.getItem("blueTag");
            if (blueTag && blueTag !== "No stored text found") {
                setTimeout(() => clickEditButton(checkIsTaggedCheckbox), 1000);
            } else {
                console.log("❌ No valid blue tag text found in localStorage. Script will not run.");
            }
        }, 1000);
    }

    function clickEditButton(callback) {
        const editButton = document.querySelector("#switchProfileText");
        if (editButton) {
            editButton.click();
            console.log("✏️ Clicked Edit Button");
            setTimeout(callback, 2000);
        } else {
            console.error("❌ Edit button not found!");
        }
    }

    function checkIsTaggedCheckbox() {
        const tagCheckbox = document.getElementById("IsTagged");
        if (tagCheckbox) {
            tagCheckbox.checked = true;
            console.log("✅ Checked IsTagged checkbox");
            setTimeout(fillTagsTextarea, 1000);
        } else {
            console.error("❌ IsTagged checkbox not found!");
        }
    }

    function fillTagsTextarea() {
        const tagsTextarea = document.getElementById("Tags");
        if (tagsTextarea) {
            const blueTag = localStorage.getItem("blueTag") || "No stored text found";
            if (blueTag && blueTag !== "No stored text found") {
                tagsTextarea.value = blueTag;
                console.log("📝 Filled Tags textarea:", blueTag);
                setTimeout(clickSaveButton, 1000);
            } else {
                console.log("❌ No valid blue tag text found. Aborting process.");
            }
        } else {
            console.error("❌ Tags textarea not found!");
        }
    }

    function clickSaveButton() {
        const saveButton = document.getElementById("mainbutton");
        if (saveButton) {
            saveButton.click();
            console.log("💾 Clicked Save Button");
            setTimeout(() => {
                localStorage.removeItem("blueTag");
                console.log("🗑️ Cleared stored blue tag text from localStorage");
                clickProfileSpan();
            }, 1000);
        } else {
            console.error("❌ Save button not found!");
        }
    }

    function clickProfileSpan() {
        const profileSpan = document.getElementById("Span1");
        if (profileSpan) {
            profileSpan.click();
            console.log("👤 Clicked Profile Span");
        } else {
            console.error("❌ Profile span not found!");
        }
    }
    */

})();
