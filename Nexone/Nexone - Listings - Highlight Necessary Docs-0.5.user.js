// ==UserScript==
// @name         Nexone - Listings - Highlight Necessary Docs
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Highlight rows with specific text unless they contain "Missing" or "Validated" images
// @author       You
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx?*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Highlight%20Necessary%20Docs-0.5.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Highlight%20Necessary%20Docs-0.5.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define the list of texts to search for
    const targetTexts = [
        "MLS Listing Page",
        "Listing Agreement & Schedule A",
        "Lockbox Consent",
        "FINTRAC (Seller)",
        "Data Form",
        "FINTRAC - Politically Exposed Person/Head of International Organization Checklist/Record - (CREA)",
        "RECO Information Guide",
        "Showing Instructions"
    ];

    // Function to check if a row contains any target text
    function checkForTextInRow(row) {
        return targetTexts.some(text => row.innerText.includes(text));
    }

    // Function to check if a row contains a "Missing" or "Validated" image
    function rowHasExcludedImage(row) {
        return row.querySelector('img[title="Missing"], img[title="Validated"]') !== null;
    }

    // Function to highlight matching rows
    function highlightRows() {
        document.querySelectorAll('tr').forEach(row => {
            if (checkForTextInRow(row) && !rowHasExcludedImage(row)) {
                const targetTd = row.querySelector('td.column_isdocumentvalidated');
                if (targetTd) {
                    targetTd.style.backgroundColor = 'yellow';
                }
            }
        });
    }

    // Run the function initially in case the page loads with content
    highlightRows();

    // Set up a MutationObserver to watch for changes in the document
    const observer = new MutationObserver(() => {
        highlightRows(); // Run the function whenever the document changes
    });

    // Observe changes in the main content area
    observer.observe(document.body, { childList: true, subtree: true });

})();
