// ==UserScript==
// @name         Nexone - Add The Edit for the Blue Tag in Documents Tab
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Moves the edit button inside the blue tag
// @author       You
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Auto%20Edit%20Blue%20Tag%20in%20Documents%20Tab-0.4.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Auto%20Edit%20Blue%20Tag%20in%20Documents%20Tab-0.4.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addEditButton() {
        const blueTagElement = document.querySelector('.tag-div.blue-tag');

        if (blueTagElement) {
            // Ensure we don't duplicate the edit button
            if (blueTagElement.querySelector('.edit-button')) return;

            // Set up flexbox for proper positioning
            blueTagElement.style.display = 'flex';
            blueTagElement.style.justifyContent = 'space-between';
            blueTagElement.style.alignItems = 'center';

            // Select the span that holds the text
            const spanElement = blueTagElement.querySelector('span');

            // Create edit button
            const editButton = document.createElement('div');
            editButton.classList.add('edit-button');
            editButton.style.cursor = 'pointer';
            editButton.style.display = 'flex';
            editButton.style.alignItems = 'center';
            editButton.style.gap = '5px';

            // Create pencil icon
            const editIcon = document.createElement('img');
            editIcon.src = '/Media/Images/Icons/pencil.png';
            editIcon.alt = '';
            editIcon.style.position = 'relative';
            editIcon.style.top = '3px';

            // Create underlined "Edit" text
            const editText = document.createElement('span');
            editText.textContent = 'Edit';
            editText.style.textDecoration = 'underline';

            // Append icon and text to the button
            editButton.appendChild(editIcon);
            editButton.appendChild(editText);

            // Append edit button inside blue tag (to the right)
            blueTagElement.appendChild(editButton);

            // Add click event for edit button
            editButton.addEventListener('click', function() {
                // Hide blue tag content
                blueTagElement.style.display = 'none';

                // Create a textarea with the existing text
                const textArea = document.createElement('textarea');
                textArea.value = spanElement.textContent.trim();
                textArea.style.backgroundColor = 'rgb(224, 247, 250)';
                textArea.style.border = '1px solid rgb(0, 151, 167)';
                textArea.style.width = '100%';
                textArea.style.height = 'auto';
                textArea.style.minHeight = '50px';
                textArea.style.resize = 'vertical';

                // Create button container
                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.justifyContent = 'flex-end';
                buttonContainer.style.gap = '5px';
                buttonContainer.style.marginTop = '5px';

                // Create 'Save' and 'Cancel' buttons
                const saveBtn = document.createElement('button');
                saveBtn.textContent = 'Save';

                const cancelBtn = document.createElement('button');
                cancelBtn.textContent = 'Cancel';

                // Append buttons to container
                buttonContainer.appendChild(saveBtn);
                buttonContainer.appendChild(cancelBtn);

                // Insert textarea and buttons
                blueTagElement.parentNode.insertBefore(textArea, blueTagElement.nextSibling);
                blueTagElement.parentNode.insertBefore(buttonContainer, textArea.nextSibling);

                // Save button event
                saveBtn.addEventListener('click', function() {
                    spanElement.textContent = textArea.value.trim();
                    blueTagElement.style.display = 'flex';
                    textArea.remove();
                    buttonContainer.remove();
                });

                // Cancel button event
                cancelBtn.addEventListener('click', function() {
                    blueTagElement.style.display = 'flex';
                    textArea.remove();
                    buttonContainer.remove();
                });
            });
        }
    }

    // Observe the page for changes
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                if (document.querySelector('.tag-div.blue-tag')) {
                    addEditButton();
                    observer.disconnect();
                    break;
                }
            }
        }
    });

    // Start observing the document
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
