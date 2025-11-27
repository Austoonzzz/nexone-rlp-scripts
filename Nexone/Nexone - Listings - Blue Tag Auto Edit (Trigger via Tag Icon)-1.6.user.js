// ==UserScript==
// @name         Nexone - Transaction - Blue Tag Auto Edit (Trigger via Tag Icon)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Automate profile editing on Nexone by clicking the tag icon. Adds deposit note, replacing "deposit missing" or "missing deposit" phrase.
// @match        https://legend.nexone.ca/Secure/Sale/Transaction/Profile/*
// @downloadURL
// @updateURL
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function waitForTagIcon() {
        console.log("⏳ Waiting for the tag icon...");

        const observer = new MutationObserver((mutations, observer) => {
            mutations.forEach((mutation) => {
                console.log("Mutation detected:", mutation);
            });

            const tagIcon = document.querySelector('.labelleft.table_left_readonly img.iconImage3[src="/Media/Images/Icons/tag_blue.png"]');
            if (tagIcon) {
                console.log("✅ Tag Icon found! Attaching click event.");
                attachToTagIcon(tagIcon);
                observer.disconnect();
            }
        });

        const targetDiv = document.querySelector('.labelleft.table_left_readonly');
        if (targetDiv) {
            observer.observe(targetDiv, { childList: true, subtree: true });
        } else {
            console.warn("⚠️ Parent div not found!");
        }

        const checkInterval = setInterval(() => {
            const tagIconExists = document.querySelector('.labelleft.table_left_readonly img.iconImage3[src="/Media/Images/Icons/tag_blue.png"]');
            if (tagIconExists) {
                console.log("✅ Tag Icon found via setInterval!");
                attachToTagIcon(tagIconExists);
                clearInterval(checkInterval);
            }
        }, 500);

        setTimeout(() => {
            clearInterval(checkInterval);
            const tagIconExists = document.querySelector('.labelleft.table_left_readonly img.iconImage3[src="/Media/Images/Icons/tag_blue.png"]');
            if (!tagIconExists) {
                console.warn("⚠️ Tag Icon not found after 5 seconds. It might not exist on this page.");
            }
        }, 5000);
    }

    function attachToTagIcon(tagIcon) {
        tagIcon.style.cursor = 'pointer';
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
            const depositNote = `deposit in bank by bank ${dateStr} ${emailInitials}`;
            let existingText = tagsTextarea.value;

            // Match either "deposit missing" or "missing deposit", case-insensitive
            const regex = /\b(deposit missing|missing deposit)\b/gi;

            if (regex.test(existingText)) {
                const newText = existingText.replace(regex, depositNote);
                tagsTextarea.value = newText;
                console.log('📝 Replaced "deposit missing" or "missing deposit" with:', depositNote);
            } else {
                tagsTextarea.value = `${depositNote}\n${existingText}`;
                console.log('📝 Prepended to existing Tags textarea:', depositNote);
            }

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
        return `${month} ${day}`;
    }

function getEmailInitials() {
    const emailSpan = document.querySelector('.header_user > div > span:not(.badge)');
    if (emailSpan) {
        const email = emailSpan.textContent.trim().toLowerCase();
        if (email === "lesliec@royallepage.ca") return "LC"; // special case
        return email.slice(0, 2).toUpperCase();
    }
    return "XX";
}

    waitForTagIcon();
})();
