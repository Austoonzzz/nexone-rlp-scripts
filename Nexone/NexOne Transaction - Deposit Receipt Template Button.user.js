// ==UserScript==
// @name         NexOne Transaction - Deposit Receipt Template Button
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Add Deposit Receipt button to auto-select listing agents, fill memo, and edit subject
// @match        https://legend.nexone.ca/Secure/Faxing/Email/Send.aspx*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/NexOne%20Transaction%20-%20Deposit%20Receipt%20Template%20Button.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/NexOne%20Transaction%20-%20Deposit%20Receipt%20Template%20Button.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function addDepositButton() {
        const container = document.querySelector('div[style*="background: rgb(250, 250, 250);"]');
        if (!container) return;
        if (container.querySelector('#deposit-receipt-btn')) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'deposit-receipt-btn';
        btn.textContent = 'Deposit Receipt';
        btn.style.margin = '5px';

        btn.addEventListener('click', () => {
            // 1. Find and select listing agents
            const selectedNames = [];
            const people = document.querySelectorAll('.personInfo');

            people.forEach(person => {
                const label = person.querySelector('.personNameContainer');
                const checkbox = person.querySelector('.personCheck');

                if (label && checkbox && label.textContent.includes('(Listing agent)')) {
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    checkbox.dispatchEvent(new Event('click', { bubbles: true }));

                    const fullName = label.textContent.trim();
                    const nameOnly = fullName.replace(/\(Listing agent\)/, '').trim();
                    const firstName = nameOnly.split(' ')[0];
                    selectedNames.push(firstName);
                }
            });

            // 2. Get transaction address (first part before comma)
            let address = '';
            const addrField = document.querySelector('.formdetail_v2 .fieldbottom');
            if (addrField) {
                const fullAddress = addrField.textContent.trim();
                address = fullAddress.split(',')[0];
            }

            // 3. Fill memo textarea with template
            const memo = document.querySelector('#ctl00_ContentPlaceHolder1__memoField');
            if (memo) {
                memo.value = `Hi ${selectedNames.join(' and ')},\n\nPlease see the attached deposit receipt for ${address}.\n\nThank you`;
            }

            // 4. Update subject line
            const subjectField = document.querySelector('#ctl00_ContentPlaceHolder1__subjectField');
            if (subjectField && address) {
                subjectField.value = `Deposit Receipt - ${address}`;
            }
        });

        container.appendChild(btn);
    }

    window.addEventListener('load', addDepositButton);
})();


