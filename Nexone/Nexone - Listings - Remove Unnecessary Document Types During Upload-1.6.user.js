// ==UserScript==
// @name         Nexone - Hide Unnecessary Document Types During Upload
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Filters select options during document upload/edit in Nexone by hiding unnecessary document types
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Remove%20Unnecessary%20Document%20Types%20During%20Upload-1.6.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Remove%20Unnecessary%20Document%20Types%20During%20Upload-1.6.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    console.log("Tampermonkey script loaded.");

    let observer;

    // List of allowed option values
    const validOptions = [
        2, 3, 14, 42, 50, 56, 72, 91, 94, 814, 912, 991, 1064, 1086
    ];

    // Listen for clicks on both "Add documents" and "Edit document" links
    document.body.addEventListener('click', function (event) {
        const addDocumentsButton = event.target.closest('#addDocumentsLink');
        const editDocumentLink = event.target.closest('.editDocumentLink');

        if (addDocumentsButton || editDocumentLink) {
            const clickedLabel = addDocumentsButton ? '"Add documents"' : '"Edit document"';
            console.log(`${clickedLabel} clicked. Script is running...`);

            observeDialog();
            filterAllSelectOptions(); // Immediately filter existing selects
            observeNewSelectElements(); // Start observing for new ones
        }
    });

    function observeDialog() {
        if (observer) observer.disconnect(); // Ensure no duplicate observers

        observer = new MutationObserver(() => {
            const closeButton = document.querySelector('.ui-dialog-titlebar-close');
            if (closeButton) {
                console.log("Close button detected. Waiting for click...");

                // Use event delegation for reliability
                document.body.addEventListener('click', handleCloseClick, true);

                observer.disconnect(); // Stop observing once close button is found
            }
        });

        // Observe for dynamically inserted dialog
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function handleCloseClick(event) {
        const closeButton = event.target.closest('.ui-dialog-titlebar-close');
        if (closeButton) {
            console.log("Dialog closed. Script finished.");
            document.body.removeEventListener('click', handleCloseClick, true);
        }
    }

    function filterAllSelectOptions() {
        document.querySelectorAll('#DocumentTypeId').forEach(filterSelectOptions);
    }

    function observeNewSelectElements() {
        const selectObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches && node.matches('#DocumentTypeId')) {
                        filterSelectOptions(node);
                    } else if (node.nodeType === 1 && node.querySelectorAll) {
                        node.querySelectorAll('#DocumentTypeId').forEach(filterSelectOptions);
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
                option.remove();
            }
        });

        console.log("Filtered select options for a <select> element.");
    }

})();
