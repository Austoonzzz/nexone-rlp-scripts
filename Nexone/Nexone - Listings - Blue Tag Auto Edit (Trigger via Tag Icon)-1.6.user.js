// ==UserScript==
// @name         Nexone - Listings - Blue Tag Auto Edit (Trigger via Tag Icon)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Automate profile editing on Nexone by clicking the tag icon
// @match        https://legend.nexone.ca/Secure/Sale/Property/Profile/*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Blue%20Tag%20Auto%20Edit%20(Trigger%20via%20Tag%20Icon)-1.6.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Blue%20Tag%20Auto%20Edit%20(Trigger%20via%20Tag%20Icon)-1.6.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function waitForTagIcon() {
        console.log("⏳ Waiting for the tag icon...");

        // Use MutationObserver to watch for changes in the parent div where the image might be inserted.
        const observer = new MutationObserver((mutations, observer) => {
            mutations.forEach((mutation) => {
                console.log("Mutation detected:", mutation); // Debugging log to track mutations
            });

            const tagIcon = document.querySelector('.labelleft.table_left_readonly img.iconImage3[src="/Media/Images/Icons/tag_blue.png"]');
            if (tagIcon) {
                console.log("✅ Tag Icon found! Attaching click event.");
                attachToTagIcon(tagIcon);
                observer.disconnect(); // Stop observing once found
            }
        });

        // Observe the parent div where the image is located
        const targetDiv = document.querySelector('.labelleft.table_left_readonly');
        if (targetDiv) {
            observer.observe(targetDiv, { childList: true, subtree: true });
        } else {
            console.warn("⚠️ Parent div not found!");
        }

        // Fallback using setInterval in case MutationObserver doesn't detect the icon right away
        const checkInterval = setInterval(() => {
            const tagIconExists = document.querySelector('.labelleft.table_left_readonly img.iconImage3[src="/Media/Images/Icons/tag_blue.png"]');
            if (tagIconExists) {
                console.log("✅ Tag Icon found via setInterval!");
                attachToTagIcon(tagIconExists);
                clearInterval(checkInterval); // Stop checking once found
            }
        }, 500); // Check every 500ms

        // Log a message if the tag icon isn't found after 5 seconds
        setTimeout(() => {
            clearInterval(checkInterval); // Stop the interval after 5 seconds
            const tagIconExists = document.querySelector('.labelleft.table_left_readonly img.iconImage3[src="/Media/Images/Icons/tag_blue.png"]');
            if (!tagIconExists) {
                console.warn("⚠️ Tag Icon not found after 5 seconds. It might not exist on this page.");
            }
        }, 5000);
    }

    function attachToTagIcon(tagIcon) {
        tagIcon.style.cursor = 'pointer'; // Indicate clickability
        tagIcon.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('🖱️ Tag Icon Clicked');
            startAutomationSequence();
        });
        console.log('🎯 Click event attached to Tag Icon');
    }

    function startAutomationSequence() {
        clickEditButton(() => {
            setTimeout(() => {
                checkIsTaggedCheckbox(() => {
                    setTimeout(() => {
                        fillTagsTextarea(() => {
                            setTimeout(() => {
                                clickSaveButton(() => {
                                    setTimeout(() => {
                                        clickProfileSpan();
                                    }, 1000);
                                });
                            }, 500);
                        });
                    }, 500);
                });
            }, 500);
        });
    }

    function clickEditButton(callback) {
        const editButton = document.querySelector('#switchProfileText');
        if (editButton) {
            editButton.click();
            console.log('✏️ Clicked Edit Button');
            setTimeout(callback, 2000);
        } else {
            console.error('❌ Edit button not found!');
        }
    }

    function checkIsTaggedCheckbox(callback) {
        const tagCheckbox = document.getElementById('IsTagged');
        if (tagCheckbox) {
            tagCheckbox.checked = true;
            console.log('✅ Checked IsTagged checkbox');
            callback();
        } else {
            console.error('❌ IsTagged checkbox not found!');
        }
    }

    function fillTagsTextarea(callback) {
        const tagsTextarea = document.getElementById('Tags');
        if (tagsTextarea) {
            const dateStr = formatDate();
            const emailInitials = getEmailInitials();
            const instructions = 'Add Showing Instructions, Verify Docs, comm/holdover, Create TYL';
            const finalText = `${dateStr} ${instructions}. ${emailInitials}`;
            tagsTextarea.value = finalText;
            console.log('📝 Filled Tags textarea:', finalText);
            callback();
        } else {
            console.error('❌ Tags textarea not found!');
        }
    }

    function clickSaveButton(callback) {
        const saveButton = document.getElementById('mainbutton');
        if (saveButton) {
            saveButton.click();
            console.log('💾 Clicked Save Button');
            setTimeout(callback, 1000);
        } else {
            console.error('❌ Save button not found!');
        }
    }

    function clickProfileSpan() {
        const profileSpan = document.getElementById('Span1');
        if (profileSpan) {
            profileSpan.click();
            console.log('👤 Clicked Profile Span');
        } else {
            console.error('❌ Profile span not found!');
        }
    }

    function formatDate() {
        const today = new Date();
        const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        const month = monthNames[today.getMonth()];
        const day = today.getDate();
        return `${month} ${day}:`;
    }

    function getEmailInitials() {
        const emailSpan = document.querySelector('.header_user span');
        if (emailSpan) {
            const email = emailSpan.textContent.trim();
            if (email.length >= 2) {
                return email.slice(0, 2).toUpperCase();
            }
        }
        return "XX";
    }

    waitForTagIcon(); // Start waiting for the tag icon
})();
