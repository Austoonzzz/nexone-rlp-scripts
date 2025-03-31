// ==UserScript==
// @name         Nexone - Message Templates
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Optimized version to detect message dialog and track checked persons with throttling to avoid crashes.
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @downloadURL
// @updateURL
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let selectedNames = []; // Store selected names globally
    let username = ''; // Store username globally
    let isAccordionAdded = false; // Flag to check if accordion is already added

    // Function to get the user's name based on email
    function getUserName() {
        const emailElement = document.querySelector('.header_user span'); // Target the <span> inside .header_user
        if (!emailElement) return ''; // Default name if not found

        const email = emailElement.textContent.trim();
        const emailToNameMap = {
            'aanderson@royallepage.ca': 'Austin',
            'clewis@performancerealty.ca': 'Tilly',
            'jsouannhaphanh@royallepage.ca': 'Jessica',
            'sAn@performancerealty.ca': 'Serena',
            'lesliec@royallepage.ca': 'Leslie',
            'emack@performancerealty.ca': 'Emily',
            'hali@royallepage.ca': 'Hoda',
            'jlecompte@performancerealty.ca': 'Joanne',
            'kcrystal@performancerealty.ca': 'Ken',
            'mguibord@performancerealty.ca': 'Mathilde',
            'mdagenais@performancerealty.ca': 'Mikayla',
            'maladejebi@performancerealty.ca': 'Mojo',
            'semery@performancerealty.ca': 'Silvia',
            'tservage@performancerealty.ca': 'Tiffany',
            'wmallette@royallepage.ca': 'Wendy'
};

        console.log("Found email:", email); // Log the email found

        username = emailToNameMap[email] || ''; // Store username globally
        return username;
    }

    // Function to add the accordion with templates above the message label
    function addAccordionWithTemplatesAboveMessageLabel() {
        const messageLabelDiv = document.querySelector('div[style="padding-top: 17px;"] .send-message-label');

        if (messageLabelDiv && !isAccordionAdded) {
            console.log("Message label detected, adding Templates accordion!");

            // Check if the accordion already exists
            if (!document.querySelector('.templates-accordion')) {
                const accordionContainer = document.createElement('div');
                accordionContainer.classList.add('templates-accordion');
                accordionContainer.style.marginBottom = '10px';
                accordionContainer.style.border = '1px solid #CCCCCC';

                const accordionHeader = document.createElement('div');
                accordionHeader.style.fontWeight = 'bold';
                accordionHeader.style.cursor = 'pointer';
                accordionHeader.style.padding = '10px';
                accordionHeader.style.backgroundColor = '#f1f1f1';
                accordionHeader.style.border = '1px solid #ccc';
                accordionHeader.style.borderRadius = '4px';
                accordionHeader.style.display = 'flex';
                accordionHeader.style.justifyContent = 'space-between';
                accordionHeader.style.alignItems = 'center';
                accordionHeader.innerText = 'Templates:';

                accordionHeader.setAttribute('title', 'Click me to see template options');

                const toggleButton = document.createElement('span');
                toggleButton.style.fontSize = '12px';
                toggleButton.style.cursor = 'pointer';
                toggleButton.innerHTML = '&#x25BC;';

                accordionHeader.appendChild(toggleButton);

                const accordionContent = document.createElement('div');
                accordionContent.style.padding = '10px';
                accordionContent.style.display = 'none';

                const contentHTML = `
<div id="problemWithDocument" style="color: blue; cursor: pointer; display: inline-block;"
     onmouseover="this.style.color='purple';"
     onmouseout="this.style.color='blue';">
    <span>Problem with the Document</span>
</div>
<br><br>

<span style="font-weight: bold; text-decoration: underline;">Listing Agreement Issues</span><br>

<div id="listing_date_issue"
     style="color: blue; cursor: pointer; display: inline-block;"
     onmouseover="this.style.color='purple';"
     onmouseout="this.style.color='blue';">
    &nbsp;&nbsp;&nbsp;<span>Listing Date Not Matching (LA and Form 960)</span>
</div><br>

<div id="form_200_missing"
     style="color: blue; cursor: pointer; display: inline-block;"
     onmouseover="this.style.color='purple';"
     onmouseout="this.style.color='blue';">
    &nbsp;&nbsp;&nbsp;<span>Form 200 is missing Designated Representative section</span>
</div><br>

<div id="form_210_missing"
     style="color: blue; cursor: pointer; display: inline-block;"
     onmouseover="this.style.color='purple';"
     onmouseout="this.style.color='blue';">
    &nbsp;&nbsp;&nbsp;<span>Form 210 is missing Designated Representative section</span>
</div><br><br>

<span style="font-weight: bold; text-decoration: underline;">FINTRAC Issues</span><br>

<div id="fintrac_retired"
     style="color: blue; cursor: pointer; display: inline-block;"
     onmouseover="this.style.color='purple';"
     onmouseout="this.style.color='blue';">
    &nbsp;&nbsp;&nbsp;<span>FINTRAC (Retired)</span>
</div><br>

<div id="fintrac_unemployed"
     style="color: blue; cursor: pointer; display: inline-block;"
     onmouseover="this.style.color='purple';"
     onmouseout="this.style.color='blue';">
    &nbsp;&nbsp;&nbsp;<span>FINTRAC (Unemployed – i.e. Housewife, student, etc.)</span>
</div><br>

<div id="fintrac_incomplete"
     style="color: blue; cursor: pointer; display: inline-block;"
     onmouseover="this.style.color='purple';"
     onmouseout="this.style.color='blue';">
    &nbsp;&nbsp;&nbsp;<span>FINTRAC (Section C & D Incomplete)</span>
</div><br>

<div id="fintrac_corporation"
     style="color: blue; cursor: pointer; display: inline-block;"
     onmouseover="this.style.color='purple';"
     onmouseout="this.style.color='blue';">
    &nbsp;&nbsp;&nbsp;<span>FINTRAC (Corporation)</span>
</div><br><br>

<span style="font-weight: bold; text-decoration: underline;">Amendments, Cancellations and Suspensions</span><br>

<div id="upload_price_change"
     style="color: blue; cursor: pointer; display: inline-block;"
     onmouseover="this.style.color='purple';"
     onmouseout="this.style.color='blue';">
    &nbsp;&nbsp;&nbsp;<span>Upload Price Change Amendment</span>
</div><br>

<div id="upload_expiry_change"
     style="color: blue; cursor: pointer; display: inline-block;"
     onmouseover="this.style.color='purple';"
     onmouseout="this.style.color='blue';">
    &nbsp;&nbsp;&nbsp;<span>Upload Expiry Date Change Amendment</span>
</div><br>

<div id="upload_cancellation"
     style="color: blue; cursor: pointer; display: inline-block;"
     onmouseover="this.style.color='purple';"
     onmouseout="this.style.color='blue';">
    &nbsp;&nbsp;&nbsp;<span>Upload Cancellation Agreement</span>
</div><br><br>

<!-- Updated message with minimal space -->
<div style="background-color: lightyellow; padding: 5px 10px; text-align: left; color: black; font-size: 14px; opacity: 0.8; border: 1px solid grey; border-radius: 5px; display: inline-flex; align-items: center; width: auto;">
    <span style="font-size: 12px; margin-right: 5px;">⚠️</span>
    <span>Review the message for accuracy before sending.</span>
</div>


                `;

                accordionContent.innerHTML = contentHTML;

                function toggleAccordion() {
                    const isContentVisible = accordionContent.style.display === 'block';
                    accordionContent.style.display = isContentVisible ? 'none' : 'block';
                    accordionHeader.style.backgroundColor = isContentVisible ? '#f1f1f1' : '#ddd';

                    toggleButton.innerHTML = isContentVisible ? '&#x25BC;' : '&#x25B2;';

                    const sendMessageContainer = document.getElementById('sendMessageRecipientsContainer');
                    if (sendMessageContainer) {
                        sendMessageContainer.style.display = isContentVisible ? 'block' : 'none';
                    }

                    logCheckedPersons();
                }

                accordionHeader.addEventListener('click', toggleAccordion);
                toggleButton.addEventListener('click', (event) => {
                    event.stopPropagation();
                    toggleAccordion();
                });

                accordionContainer.appendChild(accordionHeader);
                accordionContainer.appendChild(accordionContent);

                const parentDiv = messageLabelDiv.parentElement;
                parentDiv.insertBefore(accordionContainer, messageLabelDiv);
            }

            // Mark accordion as added
            isAccordionAdded = true;
        }
    }

    // Function to log checked persons with proper formatting
    function logCheckedPersons() {
        console.clear();
        console.log("Checking for selected persons...");

        selectedNames = []; // Reset names array

        document.querySelectorAll('.personInfo[style="padding-bottom: 2px;"]').forEach(personDiv => {
            const checkbox = personDiv.querySelector('.personCheck[type="checkbox"]');
            const nameLabel = personDiv.querySelector('.personNameContainer.hand-cursor');

            if (checkbox && checkbox.checked && nameLabel) {
                const fullName = nameLabel.innerText.trim();
                const firstName = fullName.split(" ")[0]; // Extract only the first word
                selectedNames.push(firstName);
            }
        });

        if (selectedNames.length === 1) {
            console.log(`Selected person: ${selectedNames[0]} | Username: ${username}`);
        } else if (selectedNames.length === 2) {
            console.log(`Selected persons: ${selectedNames[0]} and ${selectedNames[1]} | Username: ${username}`);
        } else if (selectedNames.length > 2) {
            const lastPerson = selectedNames.pop();
            console.log(`Selected persons: ${selectedNames.join(", ")}, and ${lastPerson} | Username: ${username}`);
        }
    }

    // Function to handle the click on "Problem with the Document"
    function handleProblemWithDocumentClick() {
        const messageContainer = document.querySelector('#messageContainer');
        if (messageContainer) {
            // Ensure username is up to date
            getUserName();
            // Create the message with the selected names inserted
            let message = `Hi ${selectedNames.join(' and ')},<br><br>The (name of document) is missing X. Could you kindly correct and re-upload at your earliest convenience? <br><br>Thank you,<br><br> ${username}`;
            messageContainer.innerHTML = message; // Use innerHTML to allow HTML formatting
        }
    }

    // Function for each form and message insert functionality
    function addClickListener(id, message) {
        const element = document.querySelector(`#${id}`);
        if (element) {
            element.addEventListener('click', function () {
                const messageContainer = document.querySelector('#messageContainer');
                if (messageContainer) {
                    messageContainer.innerHTML = message;  // Insert custom message
                }
            });
        }
    }

    // Initialize click listeners for each specific div
    function addClickListenersForDivs() {
        addClickListener("problemWithDocument", `Hi ${selectedNames.join(' and ')},<br><br>The (name of document) is missing X. Could you kindly correct and re-upload at your earliest convenience? <br><br>Thank you,<br><br> ${username}`);
        addClickListener("listing_date_issue", `Hi ${selectedNames.join(' and ')},<br><br>Upon reviewing the Listing Agreement, I noticed that the date on the Listing Agreement and Form 960 do not match. Could you kindly add and re-upload at your earliest convenience?<br><br>Thank you,<br><br> ${username}`);
        addClickListener("form_200_missing", `Hi ${selectedNames.join(' and ')},<br><br>The listing agreement you uploaded is missing the designated representative section. Please note that this section is mandatory, and the new Form 200 does not include it. Could you kindly upload Form 271 or the old Form 200 which contains the designated representative section?<br><br>Thank you,<br><br> ${username}`);
        addClickListener("form_210_missing", `Hi ${selectedNames.join(' and ')},<br><br>The listing agreement you uploaded is missing the designated representative section. Please note that this section is mandatory, and the new Form 210 does not include it. Could you kindly upload Form 272 or the old Form 210 which contains the designated representative section?<br><br>Thank you,<br><br> ${username}`);
        addClickListener("fintrac_retired", `Hi ${selectedNames.join(' and ')},<br><br>Upon reviewing the FINTRAC for Seller’s Name, I noticed that the employment is marked as retired. Could you kindly add the Previous Employer’s Name and Nature of Principal Occupation, then re-upload at your earliest convenience?<br><br>Thank you,<br><br> ${username}`);
        addClickListener("fintrac_unemployed", `Hi ${selectedNames.join(' and ')},<br><br>Upon reviewing the FINTRAC for Seller’s Name, I noticed that the employment is marked as XX. Could you kindly add the Previous Employer’s Name and Nature of Principal Occupation then re-upload at your earliest convenience or confirm via email that Seller’s Name, never worked in the past?<br><br>Thank you,<br><br> ${username}`);
        addClickListener("fintrac_incomplete", `Hi ${selectedNames.join(' and ')},<br><br>Upon reviewing the FINTRAC for Seller’s Name, I noticed that the Section C & D haven’t been filled out. Could you kindly fill out those two sections then re-upload at your earliest convenience?<br><br>Thank you,<br><br> ${username}`);
        addClickListener("fintrac_corporation", `Hi ${selectedNames.join(' and ')},<br><br>As the Seller is a business, we would kindly ask to upload the Corporate/Entity Identification Information Record (Corporate FINTRAC), along with supporting documents stating that (Name of Person Signing Listing Agreement) has the authority to bind the corporation. (i.e. Articles of Incorporation, Certificate of Appointment, Certificate of Corporate Status, etc.)<br><br>Thank you,<br><br> ${username}`);
        addClickListener("upload_price_change", `Hi ${selectedNames.join(' and ')},<br><br>Could you kindly upload the fully signed Amendment to Listing Agreement changing the price to XX?<br>Thank you,<br><br> ${username}`);
        addClickListener("upload_expiry_change", `Hi ${selectedNames.join(' and ')},<br><br>Could you kindly upload the fully signed Amendment to Listing Agreement changing the expiry date to XX?<br><br>Thank you,<br><br> ${username}`);
        addClickListener("upload_cancellation", `Hi ${selectedNames.join(' and ')},<br><br>Could you kindly upload the fully signed Cancellation of Listing Agreement to complete the file?<br><br>Thank you,<br><br> ${username}`);
    }

    // Initialize MutationObserver for detecting message dialog
    const observer = new MutationObserver(() => {
        addAccordionWithTemplatesAboveMessageLabel();
        logCheckedPersons();
        addClickListenersForDivs(); // Ensure click listeners are added for divs
    });

    // Add delay to avoid excessive requests and crashes
    let lastMutationTime = 0;
    const mutationDelay = 500; // 500ms delay between observations

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.body.addEventListener('DOMSubtreeModified', function () {
        const now = Date.now();
        if (now - lastMutationTime > mutationDelay) {
            lastMutationTime = now;
            addAccordionWithTemplatesAboveMessageLabel();
            logCheckedPersons();
            addClickListenersForDivs(); // Only add click listeners once
        }
    });

    // Initial execution
    getUserName();
    addAccordionWithTemplatesAboveMessageLabel();
})();
