// ==UserScript==
// @name         Nexone - Replace Icons in Follow-up Tab
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Replace icon source in messageHeader based on the presence of "to" label in messageDetails
// @author       You
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @downloadURL  
// @updateURL 
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to check for messageDetails divs and replace icon source in messageHeader
    function checkAndModify() {
        // Get all messageContainer divs that contain the messageDetails
        const messageContainers = document.querySelectorAll('div.messageContainer');

        messageContainers.forEach((container) => {
            // Find all messageDetails inside this messageContainer
            const messageDetailsDivs = container.querySelectorAll('div.messageDetails');
            let foundToLabel = false;

            // Check each messageDetails div to see if it contains a "to" in a label
            messageDetailsDivs.forEach((div) => {
                const label = div.querySelector('span.label');

                if (label && label.textContent.toLowerCase().includes('to')) {
                    foundToLabel = true; // Found "to" in this messageDetails div
                }
            });

            // Replace the icon based on the presence of "to" label
            const messageHeader = container.querySelector('div.messageHeader');
            const iconImage = messageHeader ? messageHeader.querySelector('img.iconImage3') : null;

            if (messageHeader && iconImage) {
                // Ensure we do not replace the comment.png icon
                if (iconImage.src.includes('/Media/Images/Icons/comment.png')) {
                    return; // Do nothing if the icon is comment.png
                }

                if (foundToLabel) {
                    // If "to" is found, replace with red tag icon
                    iconImage.src = '/Media/Images/Icons/tag_red.png';
                } else {
                    // If "to" is not found, replace with blue tag icon
                    iconImage.src = '/Media/Images/Icons/tag_blue.png';
                }
            }
        });
    }

    // Debounced function to limit how often the check runs
    let debounceTimeout;
    function debouncedCheck() {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(checkAndModify, 300); // 300ms delay before running the check
    }

    // Use a MutationObserver to detect changes in the DOM (e.g., when new divs are added)
    const observer = new MutationObserver(debouncedCheck);

    // Start observing the document body for any changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Reapply the check after switching tabs (added additional event listener to handle this)
    window.addEventListener('focus', () => {
        debouncedCheck();
    });

    // Initial check in case the content is already present when the script loads
    debouncedCheck();
})();
