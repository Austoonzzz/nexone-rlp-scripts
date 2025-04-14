// ==UserScript==
// @name         Nexone - Hide Unnecessary Document Types During Upload
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Logs when "Add documents" and close button are clicked, filters select options dynamically
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Remove%20Unnecessary%20Document%20Types%20During%20Upload-1.6.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Remove%20Unnecessary%20Document%20Types%20During%20Upload-1.6.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey script loaded.");

    let observer;

    // List of allowed option values
    const validOptions = [
        2, 3, 14, 42, 50, 56, 72, 91, 94, 814, 912, 991, 1064
    ];

    // Detect when "Add documents" button is clicked
    document.body.addEventListener('click', function(event) {
        let addDocumentsButton = event.target.closest('#addDocumentsLink');
        if (addDocumentsButton) {
            console.log("Add documents clicked. Script is running...");
            observeDialog();
            filterAllSelectOptions(); // Immediately filter existing selects
            observeNewSelectElements(); // Start observing for new ones
        }
    });

    function observeDialog() {
        if (observer) observer.disconnect(); // Ensure no duplicate observers

        observer = new MutationObserver(() => {
            let closeButton = document.querySelector('.ui-dialog-titlebar-close');
            if (closeButton) {
                console.log("Close button detected. Waiting for click...");

                // Use event delegation for reliability
                document.body.addEventListener('click', handleCloseClick, true);

                observer.disconnect(); // Stop observing since the close button is found
            }
        });

        // Observe changes in the body (since dialogs are dynamically added)
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function handleCloseClick(event) {
        let closeButton = event.target.closest('.ui-dialog-titlebar-close');
        if (closeButton) {
            console.log("Script finished. Stopping execution...");
            document.body.removeEventListener('click', handleCloseClick, true); // Remove listener after first detection
        }
    }

    function filterAllSelectOptions() {
        // Find all select elements and filter them
        document.querySelectorAll('#DocumentTypeId').forEach(filterSelectOptions);
    }

    function observeNewSelectElements() {
        // Observe changes in the body for newly added <select> elements
        let selectObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches && node.matches('#DocumentTypeId')) {
                        filterSelectOptions(node);
                    }
                    // Also check within added nodes if a <select> is inside a new div
                    else if (node.nodeType === 1) {
                        node.querySelectorAll && node.querySelectorAll('#DocumentTypeId').forEach(filterSelectOptions);
                    }
                });
            });
        });

        selectObserver.observe(document.body, { childList: true, subtree: true });
    }

    function filterSelectOptions(selectElement) {
        const options = selectElement.querySelectorAll('option');
        options.forEach(option => {
            const value = parseInt(option.value);
            if (!validOptions.includes(value)) {
                option.remove(); // Remove options that are not in the valid list
            }
        });

        console.log("Filtered select options for a newly detected <select>.");
    }

})();
