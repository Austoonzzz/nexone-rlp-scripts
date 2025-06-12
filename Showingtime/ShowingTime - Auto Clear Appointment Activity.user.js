// ==UserScript==
// @name         ShowingTime - Auto Clear Appointment Activity
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Toggle Auto-Clear, auto-handle appointments in Appointment Activity page. Turns itself off when badge reaches 0.
// @match        https://apptcenter.showingdesk.com/FrontDesk/Tasks/*
// @match        https://apptcenter.showingdesk.com/FrontDesk/Appointments/*
// @match        https://apptcenter.showingtime.com/FrontDesk/Tasks/*
// @match        https://apptcenter.showingtime.com/FrontDesk/Appointments/*
// @downloadURL  https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Showingtime/ShowingTime%20-%20Auto%20Clear%20Appointment%20Activity.user.js
// @updateURL    https://github.com/Austoonzzz/nexone-rlp-scripts/raw/refs/heads/main/Showingtime/ShowingTime%20-%20Auto%20Clear%20Appointment%20Activity.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'autoClearToggle';
    const BASE_URL = window.location.origin;
    const TASKS_PATH = '/FrontDesk/Tasks/';
    const APPOINTMENT_PATH = '/FrontDesk/Appointments/';

    function loadToggleState() {
        return localStorage.getItem(STORAGE_KEY) || 'No';
    }

    function saveToggleState(state) {
        localStorage.setItem(STORAGE_KEY, state);
        updateToggleUI(state);
    }

    function isAutoClearEnabled() {
        return loadToggleState() === 'Yes';
    }

    function updateToggleUI(state) {
        const badge = document.querySelector('#task-menu-4 .badge');
        const helpDiv = document.querySelector('#how-to-use');
        if (badge) {
            badge.textContent = state;
            badge.style.backgroundColor = state === 'Yes' ? 'green' : 'orange';
        }
        if (helpDiv) {
            helpDiv.style.display = state === 'Yes' ? 'block' : 'none';
        }
    }

    function createToggleLink() {
        const container = document.createElement('div');

        const link = document.createElement('a');
        link.id = 'task-menu-4';
        link.className = 'list-group-item smallText';
        link.href = '#';
        link.style.cursor = 'pointer';

        const badge = document.createElement('span');
        badge.className = 'badge ng-binding';

        const currentState = loadToggleState();
        badge.textContent = currentState;
        badge.style.backgroundColor = currentState === 'Yes' ? 'green' : 'orange';

        link.appendChild(badge);
        link.append(' Auto-Clear?');
        container.appendChild(link);

        const helpDiv = document.createElement('div');
        helpDiv.id = 'how-to-use';
        helpDiv.style.cssText = `
            font-size: 13px;
            margin-top: 8px;
            padding: 12px;
            border-left: 4px solid #28a745;
            background-color: #f0fdf4;
            color: #1a1a1a;
            border-radius: 6px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            display: ${currentState === 'Yes' ? 'block' : 'none'};
        `;

        helpDiv.innerHTML = `
            <strong style="color:#198754;">HOW TO USE:</strong>
            <div style="margin-top: 8px;">
                <div style="margin-bottom: 6px;"><strong>1.</strong> Refresh this page after turning Auto-Clear to <strong>YES</strong>.</div>
                <div style="margin-bottom: 6px;"><strong>2.</strong> Wait. The script will detect new appointment activity and handle it automatically.</div>
                <div style="margin-bottom: 10px;"><strong>3.</strong> Once it's done, the script will bring you back here.</div>
            </div>
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 8px 10px; border-radius: 4px; font-size: 13px; color: Black;">
                 <strong>Reminder:</strong> Don’t forget to turn Auto-Clear off afterward to avoid being redirected again.
            </div>
        `;

        container.appendChild(helpDiv);

        link.addEventListener('click', function (event) {
            event.preventDefault();
            const newState = badge.textContent === 'No' ? 'Yes' : 'No';
            saveToggleState(newState);
        });

        return container;
    }

    function appendToggleLink() {
        const listGroup = document.querySelector('div.list-group');
        if (listGroup && !document.querySelector('#task-menu-4')) {
            const toggleLink = createToggleLink();
            listGroup.appendChild(toggleLink);
        }
    }

    function observeAndClickTaskMenu3() {
        const badge = document.querySelector('#task-menu-3 span.badge.ng-binding');
        const menu = document.querySelector('#task-menu-3');
        if (!badge || !menu) return;

        const observer = new MutationObserver(() => {
            const value = parseInt(badge.textContent.trim(), 10);
            console.log(`Badge changed: ${value}`);
            if (isAutoClearEnabled()) {
                if (!isNaN(value) && value > 0) {
                    console.log('Badge > 0 and Auto-Clear is YES, clicking task-menu-3...');
                    menu.click();
                    setTimeout(clickFirstAppointmentRow, 500);
                } else if (value === 0) {
                    console.log('Badge is 0 — turning Auto-Clear OFF.');
                    saveToggleState('No');
                }
            }
        });

        observer.observe(badge, {
            childList: true,
            characterData: true,
            subtree: true,
        });

        // Initial check
        const initialValue = parseInt(badge.textContent.trim(), 10);
        if (isAutoClearEnabled() && !isNaN(initialValue)) {
            if (initialValue > 0) {
                console.log('Initial badge > 0, clicking task-menu-3...');
                menu.click();
                setTimeout(clickFirstAppointmentRow, 500);
            } else if (initialValue === 0) {
                console.log('Initial badge is 0 — turning Auto-Clear OFF.');
                saveToggleState('No');
            }
        }
    }

    function clickFirstAppointmentRow() {
        const tryClickRow = () => {
            const row = document.querySelector('tr.odd, tr.even');
            if (row) {
                console.log('Clicking first appointment row...');
                row.click();
            } else {
                setTimeout(tryClickRow, 500);
            }
        };
        tryClickRow();
    }

    function handleTasksPage() {
        const check = setInterval(() => {
            const listGroup = document.querySelector('div.list-group');
            const badge3 = document.querySelector('#task-menu-3 span.badge.ng-binding');
            const menu3 = document.querySelector('#task-menu-3');

            if (listGroup && badge3 && menu3) {
                clearInterval(check);
                appendToggleLink();
                observeAndClickTaskMenu3();
            }
        }, 300);
    }

    function handleAppointmentPage() {
        if (!isAutoClearEnabled()) return;
        console.log('Auto-Clear is YES. Returning to Tasks page...');
        setTimeout(() => {
            window.location.href = `${BASE_URL}/FrontDesk/Tasks/CallNow`;
        }, 500);
    }

    const currentUrl = window.location.href;

    if (currentUrl.includes(TASKS_PATH)) {
        handleTasksPage();
    } else if (currentUrl.includes(APPOINTMENT_PATH)) {
        handleAppointmentPage();
    }
})();
