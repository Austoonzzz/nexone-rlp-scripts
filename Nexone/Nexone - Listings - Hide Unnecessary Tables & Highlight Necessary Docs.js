// ==UserScript==
// @name         Nexone - Listings - Hide Unnecessary Tables & Highlight Necessary Docs
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Hides unnecessary <td> elements and highlights necessary rows in Nexone Documents
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @downloadURL  https://raw.githubusercontent.com/Austoonzzz/nexone-rlp-scripts/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Hide%20Unnecessary%20Tables%20%26%20Highlight%20Necessary%20Docs.js
// @updateURL    https://raw.githubusercontent.com/Austoonzzz/nexone-rlp-scripts/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Hide%20Unnecessary%20Tables%20%26%20Highlight%20Necessary%20Docs.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide unnecessary columns
    function hideColumns() {
        const selectors = [
            'td.column_documentprivacy[style="width: 15px;"]',
            'td.column_documentprivacy[style="display: table-cell;"]',
            'td.column-agent',
            'td[style="max-width: 40px;"]',
            'td.column_documentsize[style="display: table-cell; text-align: right;"]',
            'td.column_isdocumentrejected[style="display: table-cell;"]',
            'td.column_documentsize.column_documentsize_data',
            'td.column_isdocumentrejected',
            'td.column_realtornumber[style="width: 60px; max-width: 60px;"]',
            'div.legend_documents'
        ];

        document.querySelectorAll(selectors.join(', ')).forEach(td => {
            td.style.display = 'none';
        });
    }

    // Function to highlight necessary rows
    function highlightRows() {
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

        // Highlight matching rows
        document.querySelectorAll('tr').forEach(row => {
            if (checkForTextInRow(row) && !rowHasExcludedImage(row)) {
                const targetTd = row.querySelector('td.column_isdocumentvalidated');
                if (targetTd) {
                    targetTd.style.backgroundColor = 'yellow';
                }
            }
        });
    }

    // Run both functions on page load
    hideColumns();
    highlightRows();

    // Set up MutationObservers to watch for dynamic content changes
    const observer1 = new MutationObserver(hideColumns);
    observer1.observe(document.body, { childList: true, subtree: true });

    const observer2 = new MutationObserver(highlightRows);
    observer2.observe(document.body, { childList: true, subtree: true });

})();
