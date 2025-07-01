// ==UserScript==
// @name         Nexone - Add The Edit for the Blue Tag in Documents Tab (Disabled)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  ❌ This script has been disabled and does nothing.
// @author       You
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Add%20The%20Edit%20for%20the%20Blue%20Tag%20in%20Documents%20Tab-0.4.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Add%20The%20Edit%20for%20the%20Blue%20Tag%20in%20Documents%20Tab-0.4.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    /*
    🚫 This script has been intentionally disabled.
    The original functionality is preserved below in case reactivation is needed.

    function addEditButton() {
        const blueTagElement = document.querySelector('.tag-div.blue-tag');

        if (blueTagElement) {
            if (blueTagElement.querySelector('.edit-button')) return;

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
            editIcon.alt = '';
            editIcon.style.position = 'relative';
            editIcon.style.top = '3px';

            const editText = document.createElement('span');
            editText.textContent = 'Edit';
            editText.style.textDecoration = 'underline';

            editButton.appendChild(editIcon);
            editButton.appendChild(editText);
            blueTagElement.appendChild(editButton);

            editButton.addEventListener('click', function() {
                blueTagElement.style.display = 'none';

                const textArea = document.createElement('textarea');
                textArea.value = spanElement.textContent.trim();
                textArea.style.backgroundColor = 'rgb(224, 247, 250)';
                textArea.style.border = '1px solid rgb(0, 151, 167)';
                textArea.style.width = '100%';
                textArea.style.height = 'auto';
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

                saveBtn.addEventListener('click', function() {
                    spanElement.textContent = textArea.value.trim();
                    blueTagElement.style.display = 'flex';
                    textArea.remove();
                    buttonContainer.remove();
                });

                cancelBtn.addEventListener('click', function() {
                    blueTagElement.style.display = 'flex';
                    textArea.remove();
                    buttonContainer.remove();
                });
            });
        }
    }

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

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    */

})();
