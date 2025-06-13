// ==UserScript==
// @name         Red Tag Follow-Up Tracker (Auto-Fill URL & Address + No Duplicates + Export/Import)
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Tracks red tag follow-ups, autofills current URL and Address, prevents duplicates, allows export/import
// @match        https://legend.nexone.ca/Secure/Sale/Property/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'redTagFollowUpData';

    const styles = `
    #redTagTracker {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        border: 2px solid #ccc;
        padding: 12px;
        z-index: 9999;
        width: 340px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        font-family: sans-serif;
        border-radius: 12px;
    }
    #redTagTracker h2 {
        font-size: 18px;
        margin-top: 0;
        margin-bottom: 10px;
    }
    #tableWrapper {
        max-height: 450px;
        overflow-y: auto;
        border: 1px solid #ddd;
        border-radius: 6px;
    }
    #redTagTable {
        width: 100%;
        border-collapse: collapse;
    }
    #redTagTable th, #redTagTable td {
        padding: 4px;
        font-size: 14px;
        text-align: left;
        background: white;
    }
    #redTagTable thead th {
        position: sticky;
        top: 0;
        background: #f0f0f0;
        z-index: 1;
    }
    #redTagTable td a {
        text-decoration: none;
        color: #0077cc;
    }
    .red-date {
        color: red;
        font-weight: bold;
    }
    #redTagInputForm {
        display: none;
        margin-top: 12px;
        background: #f9f9f9;
        padding: 10px;
        border-radius: 8px;
    }
    #redTagInputForm input {
        width: 100%;
        margin-bottom: 8px;
        padding: 6px;
        font-size: 14px;
    }
    #redTagInputForm button {
        width: 100%;
        padding: 6px;
        background: #0077cc;
        color: white;
        border: none;
        border-radius: 6px;
    }
    .icon-btn {
        background: transparent;
        border: none;
        color: #555;
        font-size: 14px;
        cursor: pointer;
        margin-left: 4px;
    }
    .icon-btn:hover {
        color: #000;
    }
    #addRedTagBtn, #exportBtn, #importBtn {
        margin-top: 10px;
        width: 100%;
        padding: 6px;
        background: #28a745;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
    }
    #exportBtn, #importBtn {
        background: #6c757d;
    }
    .edit-form input {
        width: 95%;
        font-size: 13px;
        margin-bottom: 4px;
    }
    .edit-form button {
        margin-top: 4px;
        width: 100%;
        background: #0077cc;
        color: white;
        border: none;
        padding: 4px;
        font-size: 13px;
        border-radius: 5px;
    }
    `;

    const containerHTML = `
    <div id="redTagTracker">
        <h2>Red Tag Follow-Up Tracker</h2>
        <div id="tableWrapper">
            <table id="redTagTable">
                <thead>
                    <tr><th>Address</th><th>Date</th><th></th></tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <button id="addRedTagBtn">Add</button>
        <button id="exportBtn">Export</button>
        <button id="importBtn">Import</button>
        <input type="file" id="importFileInput" style="display:none" accept=".json" />
        <div id="redTagInputForm">
            <input type="text" id="tagAddress" placeholder="Address">
            <input type="text" id="tagURL" placeholder="URL (https://...)">
            <input type="date" id="tagDate">
            <button id="saveRedTagBtn">Save</button>
        </div>
    </div>
    `;

    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            if (document.querySelector(selector)) {
                clearInterval(interval);
                callback();
            } else if (Date.now() - startTime > timeout) {
                clearInterval(interval);
                console.warn(`Timeout: ${selector} not found.`);
            }
        }, 300);
    }

    function getAddressFromPage() {
        const addrSpan = document.getElementById('addressReadonlyField');
        if (!addrSpan) return '';
        const fullAddress = addrSpan.textContent.trim();
        const firstCommaIndex = fullAddress.indexOf(',');
        if (firstCommaIndex === -1) return fullAddress;
        return fullAddress.slice(0, firstCommaIndex).trim();
    }

    function normalizeUrl(url) {
        return url.trim().toLowerCase().replace(/\/+$/, '');
    }

    function injectUI() {
        const styleEl = document.createElement('style');
        styleEl.innerHTML = styles;
        document.head.appendChild(styleEl);

        const container = document.createElement('div');
        container.innerHTML = containerHTML;
        document.body.appendChild(container);

        // Buttons
        const addBtn = document.getElementById('addRedTagBtn');
        const saveBtn = document.getElementById('saveRedTagBtn');
        const inputForm = document.getElementById('redTagInputForm');
        const exportBtn = document.getElementById('exportBtn');
        const importBtn = document.getElementById('importBtn');
        const importFileInput = document.getElementById('importFileInput');

        addBtn.addEventListener('click', () => {
            inputForm.style.display = inputForm.style.display === 'block' ? 'none' : 'block';
            document.getElementById('tagURL').value = window.location.href;
            document.getElementById('tagAddress').value = getAddressFromPage();
            document.getElementById('tagDate').value = '';
        });

        saveBtn.addEventListener('click', () => {
            const address = document.getElementById('tagAddress').value.trim();
            const url = document.getElementById('tagURL').value.trim();
            const date = document.getElementById('tagDate').value;

            if (!address || !url || !date) {
                alert("All fields are required.");
                return;
            }

            const data = getStoredData();
            const duplicate = data.some(entry => normalizeUrl(entry.url) === normalizeUrl(url));
            if (duplicate) {
                alert("This URL already exists in the tracker.");
                return;
            }

            data.push({ address, url, date });
            saveData(data);
            renderTable();

            document.getElementById('tagAddress').value = '';
            document.getElementById('tagURL').value = '';
            document.getElementById('tagDate').value = '';
            inputForm.style.display = 'none';
        });

        exportBtn.addEventListener('click', () => {
            const data = getStoredData();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'red_tag_backup.json';
            a.click();
        });

        importBtn.addEventListener('click', () => {
            importFileInput.click();
        });

        importFileInput.addEventListener('change', () => {
            const file = importFileInput.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const imported = JSON.parse(reader.result);
                    if (!Array.isArray(imported)) throw new Error('Invalid format');
                    const existing = getStoredData();
                    const merged = [...existing];

                    imported.forEach(item => {
                        if (
                            item.url &&
                            item.address &&
                            item.date &&
                            !merged.some(e => normalizeUrl(e.url) === normalizeUrl(item.url))
                        ) {
                            merged.push(item);
                        }
                    });

                    saveData(merged);
                    renderTable();
                    alert('Import successful!');
                } catch (e) {
                    alert('Invalid file format.');
                }
            };
            reader.readAsText(file);
        });

        renderTable();
    }

    function getStoredData() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        }).toUpperCase().replace(',', '');
    }

    function isOlderThan7Days(dateStr) {
        const inputDate = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - inputDate) / (1000 * 60 * 60 * 24));
        return diffDays > 7;
    }

    function renderTable() {
        const tbody = document.querySelector('#redTagTable tbody');
        tbody.innerHTML = '';
        const data = getStoredData();
        data.sort((a, b) => new Date(a.date) - new Date(b.date)); // oldest first

        data.forEach(entry => {
            const tr = document.createElement('tr');

            const addressTd = document.createElement('td');
            const link = document.createElement('a');
            link.href = entry.url;
            link.target = '_blank';
            link.textContent = entry.address;
            addressTd.appendChild(link);

            const dateTd = document.createElement('td');
            dateTd.textContent = formatDate(entry.date);
            if (isOlderThan7Days(entry.date)) {
                dateTd.classList.add('red-date');
            }

            const actionTd = document.createElement('td');
            actionTd.style.display = 'flex';
            actionTd.style.gap = '6px';

            const editBtn = document.createElement('button');
            editBtn.className = 'icon-btn';
            editBtn.innerHTML = '✏️';
            editBtn.title = 'Edit';
            editBtn.addEventListener('click', () => showEditForm(entry));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'icon-btn';
            deleteBtn.innerHTML = '❌';
            deleteBtn.title = 'Delete';
            deleteBtn.addEventListener('click', () => {
                const current = getStoredData();
                const updated = current.filter(item => normalizeUrl(item.url) !== normalizeUrl(entry.url));
                saveData(updated);
                renderTable();
            });

            actionTd.appendChild(editBtn);
            actionTd.appendChild(deleteBtn);

            tr.appendChild(addressTd);
            tr.appendChild(dateTd);
            tr.appendChild(actionTd);
            tbody.appendChild(tr);
        });
    }

    function showEditForm(entry) {
        const tbody = document.querySelector('#redTagTable tbody');
        const rows = Array.from(tbody.children);
        const tr = rows.find(row => row.querySelector('a')?.href === entry.url);
        if (!tr) return;

        const formRow = document.createElement('tr');
        formRow.classList.add('edit-form');
        const formCell = document.createElement('td');
        formCell.colSpan = 3;

        const addressInput = document.createElement('input');
        addressInput.value = entry.address;

        const urlInput = document.createElement('input');
        urlInput.value = entry.url;

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.value = entry.date;

        const saveBtn = document.createElement('button');
        saveBtn.textContent = 'Save Changes';
        saveBtn.addEventListener('click', () => {
            const updatedAddress = addressInput.value.trim();
            const updatedURL = urlInput.value.trim();
            const updatedDate = dateInput.value;

            if (!updatedAddress || !updatedURL || !updatedDate) {
                alert("All fields required.");
                return;
            }

            const data = getStoredData();
            const duplicate = data.some(e =>
                normalizeUrl(e.url) !== normalizeUrl(entry.url) &&
                normalizeUrl(e.url) === normalizeUrl(updatedURL)
            );
            if (duplicate) {
                alert("This URL already exists in the tracker.");
                return;
            }

            const updated = data.map(e =>
                normalizeUrl(e.url) === normalizeUrl(entry.url)
                    ? { address: updatedAddress, url: updatedURL, date: updatedDate }
                    : e
            );
            saveData(updated);
            renderTable();
        });

        formCell.appendChild(addressInput);
        formCell.appendChild(urlInput);
        formCell.appendChild(dateInput);
        formCell.appendChild(saveBtn);
        formRow.appendChild(formCell);

        const existingForm = tbody.querySelector('.edit-form');
        if (existingForm) existingForm.remove();

        tr.insertAdjacentElement('afterend', formRow);
    }

    waitForElement('body', injectUI);
})();
