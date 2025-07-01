// ==UserScript==
// @name         Nexone - Listings - Blue & Red Tag on Documents Tab (Disabled)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  ❌ This script has been disabled and does nothing.
// @author       Austin
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Blue%20&%20Red%20Tag%20on%20Documents%20Tab%20in%20Listings-1.0.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Blue%20&%20Red%20Tag%20on%20Documents%20Tab%20in%20Listings-1.0.user.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    'use strict';

    /*
    🚫 This script has been intentionally disabled.
    The original functionality is preserved below in case reactivation is needed.

    window.addEventListener('load', function () {
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

                const targetContainer = document.querySelector(".profile_validation_summary_v2");
                if (!targetContainer) {
                    console.error("Target container '.profile_validation_summary_v2' not found.");
                    return;
                }

                targetContainer.style.height = "100%";

                const referenceDiv = document.querySelector("#realtorsContainer");
                if (!referenceDiv) {
                    console.error("Reference div '#realtorsContainer' not found.");
                    return;
                }

                const tagsWrapperDiv = document.createElement("div");
                tagsWrapperDiv.classList.add("tags-wrapper");

                const blueTagDiv = document.createElement("div");
                blueTagDiv.classList.add("tag-div", "blue-tag");
                blueTagDiv.style.backgroundColor = "#e0f7fa";
                blueTagDiv.style.padding = "10px";
                blueTagDiv.style.marginBottom = "10px";
                blueTagDiv.style.border = "1px solid #0097a7";
                blueTagDiv.innerHTML = `
                    <img class="iconImage3" src="/Media/Images/Icons/tag_blue.png">
                    <span>${blueTag}</span>
                `;
                if (blueTag === "Not Available") {
                    console.warn("Blue tag not available. Hiding the blue tag div.");
                    blueTagDiv.style.display = "none";
                }

                const redTagDiv = document.createElement("div");
                redTagDiv.classList.add("tag-div", "red-tag");
                redTagDiv.style.backgroundColor = "#ffebee";
                redTagDiv.style.padding = "10px";
                redTagDiv.style.marginBottom = "10px";
                redTagDiv.style.border = "1px solid #d32f2f";
                redTagDiv.innerHTML = `
                    <img class="iconImage3" src="/Media/Images/Icons/tag_red.png">
                    <span>${redTag}</span>
                `;

                tagsWrapperDiv.appendChild(blueTagDiv);
                tagsWrapperDiv.appendChild(redTagDiv);

                targetContainer.insertBefore(tagsWrapperDiv, referenceDiv.nextSibling);

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
    */
})();
