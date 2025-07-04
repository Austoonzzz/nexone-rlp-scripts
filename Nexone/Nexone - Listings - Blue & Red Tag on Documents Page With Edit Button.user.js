// ==UserScript==
// @name         Nexone - Listings - Blue & Red Tag on Documents Page With Edit Button
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Fetches blue/red tags from profile tab, appears in documents tab, allowing you to edit. Once edited, it syncs your changes back to the profile page.
// @author       Austin
// @match        https://legend.nexone.ca/Secure/Sale/Property/Documents.aspx*
// @match        https://legend.nexone.ca/Secure/Sale/Property/Profile*
// @grant        GM_xmlhttpRequest
// @connect      legend.nexone.ca
// ==/UserScript==

(function () {
    'use strict';

    const isDocumentsPage = window.location.href.includes("Documents.aspx");
    const isProfilePage = window.location.href.includes("Profile");

    const propertyID = new URLSearchParams(window.location.search).get('propertyid') || new URLSearchParams(window.location.search).get('propertyId');
    const profilePageURL = `https://legend.nexone.ca/Secure/Sale/Property/Profile/${propertyID}`;

    // Inject CSS height fixes
    const style = document.createElement("style");
    style.textContent = `
        .profile_validation_summary_v2 {
            height: 800px !important;
        }
        #box_content {
            min-height: 650px !important;
        }
    `;
    document.head.appendChild(style);

    if (isDocumentsPage) {
        window.addEventListener('load', () => {
            GM_xmlhttpRequest({
                method: "GET",
                url: profilePageURL,
                onload: function (response) {
                    if (response.status !== 200) return;

                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    const blueTag = doc.getElementById("tagsDiv")?.textContent.trim() || "Not Available";
                    const redTag = doc.getElementById("redTagsDiv")?.textContent.trim() || "Not Available";

                    const targetContainer = document.querySelector(".profile_validation_summary_v2");
                    const referenceDiv = document.querySelector("#realtorsContainer");
                    if (!targetContainer || !referenceDiv) return;

                    const tagsWrapper = document.createElement("div");
                    tagsWrapper.className = "tags-wrapper";

                    // Top-right aligned edit button container
                    const editWrapper = document.createElement("div");
                    editWrapper.style.cssText = "display: flex; justify-content: flex-end; margin-bottom: 8px;";

                    const editButton = document.createElement("div");
                    editButton.className = "edit-button";
                    editButton.style.cssText = "cursor:pointer;display:flex;align-items:center;gap:5px;";
                    editButton.innerHTML = `<img src="/Media/Images/Icons/pencil.png" alt="" style="position: relative; top: 3px;"><span style="text-decoration: underline;">Edit</span>`;
                    editWrapper.appendChild(editButton);

                    if (blueTag !== "Not Available" || redTag !== "Not Available") {
                        tagsWrapper.appendChild(editWrapper);
                    }

                    const blueTagDiv = document.createElement("div");
                    blueTagDiv.className = "tag-div blue-tag";
                    blueTagDiv.style.cssText = "background:#e0f7fa;padding:10px;margin-bottom:10px;border:1px solid #0097a7;display:flex;align-items:center;gap:10px;";
                    blueTagDiv.innerHTML = `<img class="iconImage3" src="/Media/Images/Icons/tag_blue.png"><span>${blueTag}</span>`;
                    if (blueTag === "Not Available") blueTagDiv.style.display = "none";

                    const redTagDiv = document.createElement("div");
                    redTagDiv.className = "tag-div red-tag";
                    redTagDiv.style.cssText = "background:#ffebee;padding:10px;margin-bottom:10px;border:1px solid #d32f2f;display:flex;align-items:center;gap:10px;";
                    redTagDiv.innerHTML = `<img class="iconImage3" src="/Media/Images/Icons/tag_red.png"><span>${redTag}</span>`;
                    if (redTag === "Not Available") redTagDiv.style.display = "none";

                    tagsWrapper.appendChild(blueTagDiv);
                    tagsWrapper.appendChild(redTagDiv);
                    targetContainer.insertBefore(tagsWrapper, referenceDiv.nextSibling);

                    editButton.addEventListener("click", () => {
                        tagsWrapper.style.display = "none";

                        const blueSpan = blueTagDiv.querySelector("span");
                        const redSpan = redTagDiv.querySelector("span");

                        const blueTextarea = document.createElement("textarea");
                        blueTextarea.value = blueSpan?.textContent.trim() === "Not Available" ? "" : blueSpan?.textContent.trim();
                        blueTextarea.style.cssText = "background:#e0f7fa;border:1px solid #0097a7;width:100%;min-height:50px;resize:vertical;margin-bottom:5px;";

                        const redTextarea = document.createElement("textarea");
                        redTextarea.value = redSpan?.textContent.trim() === "Not Available" ? "" : redSpan?.textContent.trim();
                        redTextarea.style.cssText = "background:#ffebee;border:1px solid #d32f2f;width:100%;min-height:50px;resize:vertical;margin-bottom:5px;";

                        const buttonContainer = document.createElement("div");
                        buttonContainer.style.cssText = "display:flex;justify-content:flex-end;gap:10px;";

                        const saveBtn = document.createElement("button");
                        saveBtn.textContent = "Save";

                        const cancelBtn = document.createElement("button");
                        cancelBtn.textContent = "Cancel";

                        buttonContainer.appendChild(saveBtn);
                        buttonContainer.appendChild(cancelBtn);

                        referenceDiv.parentNode.insertBefore(blueTextarea, referenceDiv);
                        referenceDiv.parentNode.insertBefore(redTextarea, referenceDiv);
                        referenceDiv.parentNode.insertBefore(buttonContainer, referenceDiv);

                        cancelBtn.addEventListener("click", () => {
                            tagsWrapper.style.display = "block";
                            blueTextarea.remove();
                            redTextarea.remove();
                            buttonContainer.remove();
                        });

                        saveBtn.addEventListener("click", () => {
                            const blueText = blueTextarea.value.trim();
                            const redText = redTextarea.value.trim();
                            if (blueSpan) blueSpan.textContent = blueText;
                            if (redSpan) redSpan.textContent = redText;
                            localStorage.setItem("blueTag", blueText);
                            localStorage.setItem("redTag", redText);
                            tagsWrapper.style.display = "block";
                            blueTextarea.remove();
                            redTextarea.remove();
                            buttonContainer.remove();
                            const viewListing = document.querySelector("#ctl00_ContentPlaceHolder1__profilePropertyLink");
                            if (viewListing) viewListing.click();
                        });
                    });
                }
            });
        });
    }

    if (isProfilePage) {
        const interval = setInterval(() => {
            const editBtn = document.querySelector("#switchProfileText");
            if (editBtn) {
                clearInterval(interval);
                const blueTag = localStorage.getItem("blueTag");
                const redTag = localStorage.getItem("redTag");

                if (blueTag || redTag) {
                    setTimeout(() => {
                        editBtn.click();
                        setTimeout(() => {
                            if (blueTag) {
                                const isTaggedCheckbox = document.getElementById("IsTagged");
                                const tagsTextarea = document.getElementById("Tags");
                                if (isTaggedCheckbox) isTaggedCheckbox.checked = true;
                                if (tagsTextarea) tagsTextarea.value = blueTag;
                            }

                            if (redTag) {
                                const isRedTaggedCheckbox = document.getElementById("IsRedTagged");
                                const redTagsTextarea = document.getElementById("RedTags");
                                if (isRedTaggedCheckbox) isRedTaggedCheckbox.checked = true;
                                if (redTagsTextarea) redTagsTextarea.value = redTag;
                            }

                            const saveBtn = document.getElementById("mainbutton");
                            if (saveBtn) {
                                saveBtn.click();
                                localStorage.removeItem("blueTag");
                                localStorage.removeItem("redTag");
                                setTimeout(() => {
                                    const profileSpan = document.getElementById("Span1");
                                    if (profileSpan) profileSpan.click();
                                }, 1000);
                            }
                        }, 2000);
                    }, 1000);
                }
            }
        }, 100);
    }

})();
