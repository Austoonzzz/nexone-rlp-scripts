// ==UserScript==
// @name         NexOne - Listings - Verification Sample Table
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Conditionally add sample column and clickable icons for NexOne Docs. Skips if no icons apply. Optimized for performance and dynamic content. Updated icon & target cell logic.
// @author       You
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/NexOne%20-%20Listings%20-%20Verification%20Sample%20Table-1.6.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/NexOne%20-%20Listings%20-%20Verification%20Sample%20Table-1.6.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const iconURL = 'https://i.imgur.com/CY8v6QK.png'; // ✅ Updated icon

    const links = {
        'Lockbox Consent': 'https://portal.performancerealty.ca/api/documents/staff/document-verification-samples/file/form-960-lockbox-disclosure-and-authorization',
        'Listing Agreement & Schedule A': 'https://portal.performancerealty.ca/api/documents/staff/document-verification-samples/file/listing-agreement-form-271-sale',
        'Data Form': 'https://portal.performancerealty.ca/api/documents/staff/document-verification-samples/file/mls-data-information-sheet-proptx-version',
        'MLS Listing Page': 'https://portal.performancerealty.ca/api/documents/staff/document-verification-samples/file/mls-sheet',
        'RECO Information Guide': 'https://portal.performancerealty.ca/api/documents/staff/document-verification-samples/file/reco-information-guide',
        'Showing Instructions': 'https://portal.performancerealty.ca/api/documents/staff/document-verification-samples/file/showing-instructions-form-2022-update',
        'FINTRAC (Seller)': 'https://portal.performancerealty.ca/api/documents/staff/document-verification-samples/file/fintrac-individual',
        'FINTRAC - Politically Exposed Person/Head of International Organization Checklist/Record - (CREA)': 'https://portal.performancerealty.ca/api/documents/staff/document-verification-samples/file/fintrac-pep',
        'Suspension Agreement': 'https://portal.performancerealty.ca/api/documents/staff/document-verification-samples/file/suspension-agreement',
        'Listing Cancellation': 'https://portal.performancerealty.ca/api/documents/staff/document-verification-samples/file/cancellation-agreement',
        'Amendments': 'https://portal.performancerealty.ca/api/documents/staff/document-verification-samples/file/amendment-agreement-lease-or-sale'
    };

    const triggerTexts = Object.keys(links);

    function eligibleRowsForIcons(rows) {
        return Array.from(rows).filter(row => {
            const rowText = row.textContent.trim();
            const matchedText = triggerTexts.find(trigger => rowText.includes(trigger));
            const hasValidatedIcon = row.querySelector('img[title="Validated"][src*="tick.png"]');
            const hasMissingText = rowText.toLowerCase().includes('missing');
            return matchedText && !hasValidatedIcon && !hasMissingText && !row.querySelector('.new-td');
        });
    }

    function addTdToTable() {
        const table = document.getElementById('docTable');
        if (!table) return false;

        const rows = table.getElementsByTagName('tr');
        if (table.querySelector('.new-td')) return false; // already added

        const eligibleRows = eligibleRowsForIcons(rows);
        if (eligibleRows.length === 0) return false; // no icons to show

        Array.from(rows).forEach(row => {
            const documentNameCell = row.cells[2]; // ✅ Insert before 3rd column
            if (!documentNameCell || row.querySelector('.new-td')) return;

            const newTd = document.createElement('td');
            newTd.classList.add('new-td');
            newTd.style.textAlign = 'center';
            newTd.style.verticalAlign = 'middle';

            if (row.classList.contains('tabletitle_v2')) {
                const span = document.createElement('span');
                span.textContent = ''; // ✅ No header text
                newTd.appendChild(span);
            } else {
                const rowText = row.textContent.trim();
                const matchedText = triggerTexts.find(trigger => rowText.includes(trigger));
                const hasValidatedIcon = row.querySelector('img[title="Validated"][src*="tick.png"]');
                const hasMissingText = rowText.toLowerCase().includes('missing');

                if (matchedText && !hasValidatedIcon && !hasMissingText) {
                    const img = document.createElement('img');
                    img.src = iconURL;
                    img.alt = 'Doc Icon';
                    img.style.width = '16px';
                    img.style.height = '16px';
                    img.style.display = 'inline-block';

                    const link = document.createElement('a');
                    link.href = links[matchedText];
                    link.target = '_blank';
                    link.appendChild(img);
                    newTd.appendChild(link);
                }
            }

            row.insertBefore(newTd, documentNameCell);
        });

        return true;
    }

    function observeForTable() {
        const observer = new MutationObserver(() => {
            const table = document.getElementById('docTable');
            if (table) {
                if (addTdToTable()) {
                    observer.disconnect(); // Stop watching after success
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function init() {
        observeForTable(); // Initial watch

        const tabLink = document.querySelector('#ctl00_ContentPlaceHolder1__setDocumentsInformation');
        if (tabLink) {
            tabLink.addEventListener('click', () => {
                observeForTable(); // Rewatch on tab click
            });
        }
    }

    init();
})();
