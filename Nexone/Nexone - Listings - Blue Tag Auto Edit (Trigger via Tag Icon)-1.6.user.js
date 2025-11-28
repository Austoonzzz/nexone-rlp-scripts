// ==UserScript==
// @name         Nexone - Listings - Blue Tag Auto Edit (Trigger via Tag Icon)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Automate profile editing on Nexone by clicking the tag icon
// @match        https://legend.nexone.ca/Secure/Sale/Property/Profile/*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Blue%20Tag%20Auto%20Edit%20(Trigger%20via%20Tag%20Icon)-1.6.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Nexone/Nexone%20-%20Listings%20-%20Blue%20Tag%20Auto%20Edit%20(Trigger%20via%20Tag%20Icon)-1.6.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const TAG_CONFIGS = [
        {
            iconSelector: 'img.iconImage3[src*="tag_blue.png"]',
            menuId: 'blueTagMenu',
            ids: {
                tagCheckbox: 'IsTagged',
                textarea: 'Tags',
                format: 'short'
            },
            menuItemIds: {
                one: 'newBlueTag',
                two: 'updatedBlueTag',
                trash: 'BlueTagTrash'
            },
            messages: {
                one: 'Add Showing Instructions, Verify Docs, comm/holdover, Create TYL',
                two: 'Verify Docs, comm/holdover'
            }
        },
        {
            iconSelector: 'img.iconImage3[src*="tag_red.png"]',
            menuId: 'redTagMenu',
            ids: {
                tagCheckbox: 'IsRedTagged',
                textarea: 'RedTags',
                format: 'long'
            },
            menuItemIds: {
                one: 'newRedTag',
                two: 'updatedRedTag',
                trash: 'RedTagTrash'
            },
            messages: {
                one: 'Missing docs. 1st reminder sent'
            }
        }
    ];

    TAG_CONFIGS.forEach(config => {
        waitForElement(config.iconSelector, (icon) => {
            icon.style.cursor = 'pointer';
            const popup = createPopupMenu(config.menuId, config.menuItemIds);

            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const rect = icon.getBoundingClientRect();
                popup.style.top = `${rect.bottom + window.scrollY + 4}px`;
                popup.style.left = `${rect.left + window.scrollX}px`;
                popup.style.display = 'flex';
            });

            document.addEventListener('click', (e) => {
                if (!popup.contains(e.target) && e.target !== icon) {
                    popup.style.display = 'none';
                }
            });

            popup.querySelector(`#${config.menuItemIds.one}`)?.addEventListener('click', () => {
                const msg = config.messages.one;
                console.log(`▶️ [${config.menuId}] 1 clicked`);
                runAutomation(config, msg, true, true);
            });

            popup.querySelector(`#${config.menuItemIds.two}`)?.addEventListener('click', () => {
                if (config.menuId === 'redTagMenu') {
                    console.log(`▶️ [${config.menuId}] 2 clicked (Reminder Incrementation)`);
                    const updatedMessage = getUpdatedRedReminderMessage();
                    if (!updatedMessage) {
                        alert("⚠️ Could not find or increment the existing red tag message automatically. Please ensure that it is written in the following format example: 1st reminder sent (June 26). AA");
                        return;
                    }
                    runAutomation(config, updatedMessage, true, true);
                } else {
                    const msg = config.messages.two;
                    if (!msg) return;
                    console.log(`▶️ [${config.menuId}] 2 clicked`);
                    runAutomation(config, msg, true, true);
                }
            });

            popup.querySelector(`#${config.menuItemIds.trash}`)?.addEventListener('click', () => {
                console.log(`🗑️ [${config.menuId}] Trash clicked`);
                runAutomation(config, '', false, false);
            });
        });
    });

    function waitForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function createPopupMenu(menuId, ids) {
        const menu = document.createElement('div');
        menu.id = menuId;
        Object.assign(menu.style, {
            position: 'absolute',
            background: '#fff',
            border: '1px solid #ccc',
            padding: '6px',
            borderRadius: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            zIndex: '9999',
            display: 'none',
            gap: '6px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '14px',
            flexDirection: 'row',
            alignItems: 'center',
            display: 'flex'
        });

        const item1 = document.createElement('div');
        item1.textContent = '1';
        item1.id = ids.one;
        item1.style.cursor = 'pointer';

        const item2 = document.createElement('div');
        item2.textContent = '2';
        item2.id = ids.two;
        item2.style.cursor = 'pointer';

        const trash = document.createElement('div');
        trash.innerHTML = '🗑️';
        trash.id = ids.trash;
        trash.style.cursor = 'pointer';

        menu.appendChild(item1);
        menu.appendChild(item2);
        menu.appendChild(trash);

        document.body.appendChild(menu);
        return menu;
    }

    function runAutomation(config, messageText, shouldTag, shouldFill) {
        clickEditButton(() => {
            setTimeout(() => {
                setTaggedCheckbox(config.ids.tagCheckbox, shouldTag, () => {
                    setTimeout(() => {
                        const textareaId = config.ids.textarea;
                        if (!textareaId) {
                            proceedSaveAndReturn();
                            return;
                        }

                        if (shouldFill) {
                            fillTagsTextarea(config.ids.format, textareaId, messageText, () => {
                                proceedSaveAndReturn();
                            });
                        } else {
                            clearTagsTextarea(textareaId, () => {
                                proceedSaveAndReturn();
                            });
                        }
                    }, 500);
                });
            }, 500);
        });
    }

    function clickEditButton(callback) {
        const editButton = document.getElementById('switchProfileText');
        if (editButton) {
            editButton.click();
            console.log('✏️ Clicked Edit Button');
            setTimeout(callback, 2000);
        } else {
            console.error('❌ Edit button not found!');
        }
    }

    function setTaggedCheckbox(id, value, callback) {
        const box = document.getElementById(id);
        if (box) {
            box.checked = value;
            console.log(value ? `✅ Checked ${id}` : `🚫 Unchecked ${id}`);
            callback();
        } else {
            console.error(`❌ Checkbox "${id}" not found!`);
            callback(); // still continue
        }
    }

 function fillTagsTextarea(format, id, message, callback) {
    const area = document.getElementById(id);
    if (area) {
        // For red tag 2 (which sends full formatted message including date/initials), detect that:
        // We'll assume that if message already contains a date format and initials at the end, do not append again.
        const dateRegex = /\((January|February|March|April|May|June|July|August|September|October|November|December|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC) \d{1,2}\)/i;
        const initialsRegex = /[A-Z]{2}$/;
        const hasDate = dateRegex.test(message);
        const hasInitials = initialsRegex.test(message.trim());

        let fullMessage;
        if (format === 'long' && hasDate && hasInitials) {
            // Message already fully formatted for red tag "2", use as-is
            fullMessage = message;
        } else if (format === 'short' && hasDate && hasInitials) {
            // (In case blue tag gets similar input) Just use as-is
            fullMessage = message;
        } else {
            // Normal behavior: add date and initials
            const date = format === 'long' ? formatLongDate() : formatDate();
            const initials = getEmailInitials();
            fullMessage = format === 'long'
                ? `${message} (${date}). ${initials}`
                : `${date} ${message}. ${initials}`;
        }

        area.value = fullMessage;
        console.log(`📝 Filled ${id}:`, fullMessage);
        callback();
    } else {
        console.error(`❌ Textarea "${id}" not found!`);
    }
}


    function clearTagsTextarea(id, callback) {
        const area = document.getElementById(id);
        if (area) {
            area.value = '';
            console.log(`🧹 Cleared ${id}`);
            callback();
        } else {
            console.error(`❌ Textarea "${id}" not found!`);
        }
    }

    function proceedSaveAndReturn() {
        const saveButton = document.getElementById('mainbutton');
        if (saveButton) {
            saveButton.click();
            console.log('💾 Clicked Save');
            setTimeout(() => {
                const profileSpan = document.getElementById('Span1');
                if (profileSpan) {
                    profileSpan.click();
                    console.log('👤 Clicked Profile Span');
                } else {
                    console.error('❌ Profile span not found!');
                }
            }, 1000);
        } else {
            console.error('❌ Save button not found!');
        }
    }

    function formatDate() {
        const d = new Date();
        const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
        return `${months[d.getMonth()]} ${d.getDate()}:`;
    }

    function formatLongDate() {
        const d = new Date();
        const months = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];
        return `${months[d.getMonth()]} ${d.getDate()}`;
    }

function getEmailInitials() {
    const emailSpan = document.querySelector('.header_user > div > span:not(.badge)');
    if (emailSpan) {
        const email = emailSpan.textContent.trim().toLowerCase();
        if (email === "lesliec@royallepage.ca") return "LC"; // special case
        return email.slice(0, 2).toUpperCase();
    }
    return "XX";
}

    function getUpdatedRedReminderMessage() {
        const div = document.querySelector('#redTagsDiv span');
        if (!div) return null;

        const currentText = div.textContent.trim();
        const match = currentText.match(/Missing docs\. (\d+)(?:st|nd|rd|th) reminder sent/i);

        if (!match || !match[1]) return null;

        let currentNum = parseInt(match[1]);
        if (isNaN(currentNum) || currentNum >= 4) return null;

        const nextNum = currentNum + 1;
        const suffix = ['th', 'st', 'nd', 'rd'][(nextNum % 10)] || 'th';
        const date = formatLongDate();
        const initials = getEmailInitials();
        return `Missing docs. ${nextNum}${suffix} reminder sent (${date}). ${initials}`;
    }

})();
