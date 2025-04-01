// ==UserScript==
// @name         Nexone - Edit & Watch Blue Tag, Auto Update Profile
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds an edit button to the blue tag, watches for changes, stores updates, clicks "View Listing," edits the profile, checks the checkbox, fills the textarea, saves changes, and clicks Profile.
// @author       You
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @match        https://legend.nexone.ca/Secure/Sale/Property/Profile*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("Tampermonkey script running on:", window.location.href);

    if (window.location.href.includes("Documents.aspx")) {
        waitForElement('.tag-div.blue-tag', addEditButton, observeBlueTagChanges);
    }

    if (window.location.href.includes("Profile")) {
        window.addEventListener("load", function () {
            console.log("Profile page fully loaded. Proceeding to edit...");
            setTimeout(() => {
                const blueTag = localStorage.getItem("blueTag");
                if (blueTag && blueTag !== "No stored text found") {
                    setTimeout(() => clickEditButton(checkIsTaggedCheckbox), 1000);
                } else {
                    console.log("❌ No valid blue tag text found in localStorage. Script will not run.");
                }
            }, 1000);
        });
    }

    function waitForElement(selector, callback, nextCallback = null) {
        const observer = new MutationObserver((mutations, obs) => {
            if (document.querySelector(selector)) {
                callback();
                obs.disconnect();
                if (nextCallback) nextCallback();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function addEditButton() {
        console.log("Adding edit button to blue tag...");

        const blueTagElement = document.querySelector('.tag-div.blue-tag');
        if (!blueTagElement || blueTagElement.querySelector('.edit-button')) return;

        blueTagElement.style.display = 'flex';
        blueTagElement.style.justifyContent = 'space-between';
        blueTagElement.style.alignItems = 'center';

        const spanElement = blueTagElement.querySelector('span');

        const editButton = document.createElement('div');
        editButton.classList.add('edit-button');
        editButton.style.cursor = 'pointer';
        editButton.style.display = 'flex';
        editButton.style.alignItems = 'center';
        editButton.style.gap = '5px';

        const editIcon = document.createElement('img');
        editIcon.src = '/Media/Images/Icons/pencil.png';
        editIcon.style.position = 'relative';
        editIcon.style.top = '3px';

        const editText = document.createElement('span');
        editText.textContent = 'Edit';
        editText.style.textDecoration = 'underline';

        editButton.appendChild(editIcon);
        editButton.appendChild(editText);
        blueTagElement.appendChild(editButton);

        editButton.addEventListener('click', function () {
            blueTagElement.style.display = 'none';

            const textArea = document.createElement('textarea');
            textArea.value = spanElement.textContent.trim();
            textArea.style.backgroundColor = 'rgb(224, 247, 250)';
            textArea.style.border = '1px solid rgb(0, 151, 167)';
            textArea.style.width = '100%';
            textArea.style.minHeight = '50px';
            textArea.style.resize = 'vertical';

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'flex-end';
            buttonContainer.style.gap = '5px';
            buttonContainer.style.marginTop = '5px';

            const saveBtn = document.createElement('button');
            saveBtn.textContent = 'Save';

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Cancel';

            buttonContainer.appendChild(saveBtn);
            buttonContainer.appendChild(cancelBtn);

            blueTagElement.parentNode.insertBefore(textArea, blueTagElement.nextSibling);
            blueTagElement.parentNode.insertBefore(buttonContainer, textArea.nextSibling);

            saveBtn.addEventListener('click', function () {
                spanElement.textContent = textArea.value.trim();
                blueTagElement.style.display = 'flex';
                textArea.remove();
                buttonContainer.remove();
                localStorage.setItem("blueTag", textArea.value.trim());
                console.log("Updated blue tag text:", textArea.value.trim());
            });

            cancelBtn.addEventListener('click', function () {
                blueTagElement.style.display = 'flex';
                textArea.remove();
                buttonContainer.remove();
            });
        });
    }

    function observeBlueTagChanges() {
        console.log("Observing blue tag changes...");

        const targetSpan = document.querySelector(".tags-wrapper .tag-div.blue-tag span");
        if (!targetSpan) {
            console.warn("Target span not found. Retrying in 2 seconds...");
            setTimeout(observeBlueTagChanges, 2000);
            return;
        }

        let lastText = targetSpan.innerText.trim();
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "childList" || mutation.type === "characterData") {
                    let newText = targetSpan.innerText.trim();
                    if (newText !== lastText) {
                        console.log("Detected change in blue tag text:", newText);
                        localStorage.setItem("blueTag", newText);
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
        } else {
            console.error("❌ Save button not found!");
        }
    }
})();
