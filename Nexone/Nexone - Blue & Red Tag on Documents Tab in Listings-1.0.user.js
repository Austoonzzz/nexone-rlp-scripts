// ==UserScript==
// @name         Nexone - Listings - Blue & Red Tag on Documents Tab
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fetch blue and red tags from the property profile page and insert them with icons in the profile validation section.
// @author       Austin
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Blue%20&%20Red%20Tag%20on%20Documents%20Tab%20in%20Listings-1.0.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Blue%20&%20Red%20Tag%20on%20Documents%20Tab%20in%20Listings-1.0.user.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', function () {
        // Try both 'propertyid' and 'propertyId' query parameters
        const propertyID = new URLSearchParams(window.location.search).get('propertyid') || new URLSearchParams(window.location.search).get('propertyId');

        if (!propertyID) {
            console.error("Property ID not found in the URL.");
            return;
        }

        const profilePageURL = `https://legend.nexone.ca/Secure/Sale/Property/Profile/${propertyID}`;

        GM_xmlhttpRequest({
            method: "GET",
            url: profilePageURL,
            onload: function (response) {
                if (response.status !== 200) {
                    console.error(`Failed to fetch profile page. Status code: ${response.status}`);
                    return;
                }

                const doc = new DOMParser().parseFromString(response.responseText, "text/html");

                const blueTag = doc.getElementById("tagsDiv")?.textContent.trim() || "Not Available";
                const redTag = doc.getElementById("redTagsDiv")?.textContent.trim() || "Not Available";

                // Locate the target container on the page
                const targetContainer = document.querySelector(".profile_validation_summary_v2");
                if (!targetContainer) {
                    console.error("Target container '.profile_validation_summary_v2' not found.");
                    return;
                }

                // Set the height of the profile validation container to 100%
                targetContainer.style.height = "100%";

                // Locate the div after which to insert the new divs
                const referenceDiv = document.querySelector("#realtorsContainer");
                if (!referenceDiv) {
                    console.error("Reference div '#realtorsContainer' not found.");
                    return;
                }

                // Create a wrapper div for the tags
                const tagsWrapperDiv = document.createElement("div");
                tagsWrapperDiv.classList.add("tags-wrapper");

                // Create and style the blue tag div with an image
                const blueTagDiv = document.createElement("div");
                blueTagDiv.classList.add("tag-div", "blue-tag");
                blueTagDiv.style.backgroundColor = "#e0f7fa"; // Light blue background
                blueTagDiv.style.padding = "10px";
                blueTagDiv.style.marginBottom = "10px";
                blueTagDiv.style.border = "1px solid #0097a7";
                blueTagDiv.innerHTML = `
                    <img class="iconImage3" src="/Media/Images/Icons/tag_blue.png">
                    <span>${blueTag}</span>
                `;

                // If the blue tag is "Not Available", hide the div
                if (blueTag === "Not Available") {
                    console.warn("Blue tag not available. Hiding the blue tag div.");
                    blueTagDiv.style.display = "none";
                }

                // Create and style the red tag div with an image
                const redTagDiv = document.createElement("div");
                redTagDiv.classList.add("tag-div", "red-tag");
                redTagDiv.style.backgroundColor = "#ffebee"; // Light red background
                redTagDiv.style.padding = "10px";
                redTagDiv.style.marginBottom = "10px";
                redTagDiv.style.border = "1px solid #d32f2f";
                redTagDiv.innerHTML = `
                    <img class="iconImage3" src="/Media/Images/Icons/tag_red.png">
                    <span>${redTag}</span>
                `;

                // If the red tag is "Not Available", hide the div
                if (redTag === "Not Available") {
                    console.warn("Red tag not available. Hiding the red tag div.");
                    redTagDiv.style.display = "none";
                }

                // Append the blue and red tags to the wrapper div
                tagsWrapperDiv.appendChild(blueTagDiv);
                tagsWrapperDiv.appendChild(redTagDiv);

                // Insert the tagsWrapperDiv after the reference div
                targetContainer.insertBefore(tagsWrapperDiv, referenceDiv.nextSibling);

                // Set the min-height of #box_content to 600px
                const boxContent = document.querySelector("#box_content");
                if (boxContent) {
                    boxContent.style.minHeight = "600px";
                } else {
                    console.error("Element '#box_content' not found.");
                }
            },
            onerror: function (err) {
                console.error("Failed to fetch the property profile page.", err);
            }
        });
    });
})();
