// ==UserScript==
// @name         Nexone - Listings - Manager Notification Email Templates
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Auto-fill memo field with templates, dynamic resizing, and recipient/agent/address auto-fill
// @match        https://legend.nexone.ca/Secure/Faxing/Email/Send.aspx*
// @downloadURL  
// @updateURL    
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const recipients = {
        "Alain De Gagne": "alain@performancerealty.ca",
        "Kerri MaGee": "kerri@performancerealty.ca",
        "Bob McCulloch": "bmcculloch@performancerealty.ca"
    };

    const emailField = document.getElementById('ctl00_ContentPlaceHolder1__recipientsListField');
    const memoField = document.getElementById('ctl00_ContentPlaceHolder1__memoField');

    let selectedRecipientName = '';

    // === Dynamic Resizing for Memo Field ===
    memoField.style.overflow = "hidden";
    memoField.addEventListener('input', () => {
        memoField.style.height = 'auto';
        memoField.style.height = memoField.scrollHeight + 'px';
    });

    // === RECIPIENT SELECT ===
    const recipientContainer = document.createElement('div');
    recipientContainer.style.marginBottom = "10px";
    recipientContainer.innerHTML = `<strong>Manager recipient:</strong><br>`;

    for (const [name, email] of Object.entries(recipients)) {
        const label = document.createElement('label');
        label.style.marginRight = '10px';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'customRecipient';
        radio.addEventListener('change', () => {
            emailField.value = email;
            selectedRecipientName = name.split(" ")[0]; // First name only
        });
        label.appendChild(radio);
        label.append(` ${name}`);
        recipientContainer.appendChild(label);
    }

    // === TEMPLATE BUTTONS ===
    const templates = [
        {
            label: "Total < 4%",
            content: `Agent X for Address X has entered into a Listing Agreement (see attachment) for a total commission of X %.

As appropriate please review this with the agent as this commission % is below brokerage standards.

Thank you,

PASTE LINK TO DOCUMENT(S)`
        },
        {
            label: "Payout < 2%",
            content: `Agent X for Address X has entered into a Listing Agreement (see attachment) for a payout commission of X %.

As appropriate please review this with the agent as this commission % is below brokerage standards.

Thank you,

PASTE LINK TO DOCUMENT(S)`
        },
        {
            label: "Holdover < 60 days",
            content: `Agent X for Address X has entered into a Listing Agreement (see attachment) with a holdover period of less than 60 days.

As appropriate please review this with the agent as this is less than brokerage standards.

Thank you,

PASTE LINK TO DOCUMENT(S)`
        },
        {
            label: "Total < 4% + Payout < 2%",
            content: `Agent X for Address X has entered into a Listing Agreement (see attachment) for a total commission of X % with a payout commission of X %.

As appropriate please review this with the agent as this is less than brokerage standards.

Thank you,

PASTE LINK TO DOCUMENT(S)`
        },
        {
            label: "Total < 4% + Payout < 2% + Holdover <60 days",
            content: `Agent X for Address X has entered into a Listing Agreement (see attachment) for a total commission of X %, with a payout commission of X %, as well as a holdover of less than 60 days.

As appropriate please review this with the agent as this is less than brokerage standards.

Thank you,

PASTE LINK TO DOCUMENT(S)`
        }
    ];

    // === ACCORDION CONTAINER ===
    const accordionContainer = document.createElement('div');
    accordionContainer.style.margin = "10px 0";

    const accordionHeader = document.createElement('div');
    accordionHeader.title = "Click me to see template options";
    accordionHeader.style = "font-weight: bold; cursor: pointer; padding: 10px; background-color: rgb(240, 240, 240); border: 1px solid rgb(204, 204, 204); border-radius: 4px; display: flex; justify-content: space-between; align-items: center;";
    accordionHeader.innerHTML = `Manager Notification Templates:<span id="accordion-arrow" style="font-size: 12px; cursor: pointer;">▼</span>`;

    const accordionContent = document.createElement('div');
    accordionContent.style.display = "none";
    accordionContent.style.border = "1px solid #ccc";
    accordionContent.style.borderTop = "none";
    accordionContent.style.padding = "10px";
    accordionContent.style.borderRadius = "0 0 4px 4px";
    accordionContent.style.background = "#fafafa";

    accordionHeader.addEventListener('click', () => {
        const isOpen = accordionContent.style.display === "block";
        accordionContent.style.display = isOpen ? "none" : "block";
        document.getElementById('accordion-arrow').textContent = isOpen ? "▼" : "▲";
    });

    // === WARNING BOX (initially hidden) ===
    const warningBox = document.createElement('div');
    warningBox.id = 'template-warning-box';
    warningBox.style = 'display: none; background: #ffffaf; color: black; padding: 10px; margin: 10px 0px; border: 1px solid rgb(170, 170, 170); font-weight: bold;';
    warningBox.textContent = '⚠️ Review the message and replace any "X" before sending.';

    templates.forEach(t => {
        const btn = document.createElement('button');
        btn.textContent = t.label;
        btn.type = 'button';
        btn.style.margin = '5px';
        btn.addEventListener('click', () => {
            const agentNames = getListingAgentNames();
            const address = getListingAddress();
            const link = getListingAgreementLink();
            let message = t.content
                .replace(/Agent X/g, agentNames)
                .replace(/Address X/g, address)
                .replace(/PASTE LINK TO DOCUMENT\(S\)/g, link);

            const greeting = selectedRecipientName ? `Hi ${selectedRecipientName},\n\n` : 'Hi,\n\n';
            memoField.value = `${greeting}${message}`;
            memoField.dispatchEvent(new Event('input')); // Trigger resize

            warningBox.style.display = 'block';
        });
        accordionContent.appendChild(btn);
    });

    accordionContainer.appendChild(accordionHeader);
    accordionContainer.appendChild(accordionContent);

    // === UTILITIES ===
    function getListingAgentNames() {
        const labels = document.querySelectorAll('label.personNameContainer');
        const agents = [];
        labels.forEach(label => {
            const text = label.textContent.trim();
            if (text.includes('(Listing agent)')) {
                const name = text.split('(Listing agent)')[0].trim();
                if (name) agents.push(name);
            }
        });
        if (agents.length === 0) return "Agent X";
        if (agents.length === 1) return agents[0];
        return agents.slice(0, -1).join(', ') + ' and ' + agents[agents.length - 1];
    }

    function getListingAddress() {
        const field = [...document.querySelectorAll('.formdetail_v2')].find(div =>
            div.textContent.includes("Listing's address:")
        );
        if (!field) return "Address X";
        const addr = field.querySelector('.fieldbottom')?.textContent.trim();
        return addr ? addr.split(',')[0] : "Address X";
    }

function getListingAgreementLink() {
    const rows = document.querySelectorAll('table tr');
    for (const row of rows) {
        if (row.innerText.toLowerCase().includes("listing agreement & schedule a")) {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox && !checkbox.checked) checkbox.checked = true;

            const anchor = row.querySelector('a[href*="DocumentDownload.ashx"]');
            if (anchor) {
                const href = anchor.getAttribute('href');
                const fullUrl = new URL(href, location.href).toString();
                return fullUrl;
            }
        }
    }
    return "LINK NOT FOUND";
}


    // === INJECT INTO PAGE ===
    const recipientLabel = document.getElementById('ctl00_ContentPlaceHolder1__recipientsListLabel');
    if (recipientLabel?.parentElement) {
        recipientLabel.parentElement.insertBefore(recipientContainer, recipientLabel);
    }

    const memoLabel = document.getElementById('ctl00_ContentPlaceHolder1__memoLabel');
    if (memoLabel?.parentElement) {
        memoLabel.parentElement.insertBefore(accordionContainer, memoLabel);
        memoLabel.parentElement.insertBefore(warningBox, memoLabel);
    }
})();
