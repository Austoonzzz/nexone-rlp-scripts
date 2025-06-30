// ==UserScript==
// @name         Nexone - Listings - Red Tag Tracking Table
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Sidebar that tracks red tagged listing based on 7 day / 24hr filter
// @match        https://legend.nexone.ca/Secure/Sale/Property/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let currentTab = 'tab1'; // default tab
    const STORAGE_KEYS = {
    tab1: 'redTagFollowUpData_tab1',
    tab2: 'redTagFollowUpData_tab2',
    collapsed: 'redTagTrackerCollapsed',
    selectedTab: 'redTagTrackerSelectedTab' // 👈 add this line
};


    const styles = `
    #redTagTracker {
        position: fixed;
        top: 100px;
        right: 0;
        background: white;
        border-left: 2px solid #ccc;
        padding: 12px;
        z-index: 9999;
        width: 360px;
        box-shadow: -2px 0 6px rgba(0,0,0,0.2);
        font-family: sans-serif;
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
        transition: transform 0.3s ease;
    }
    #redTagTracker.collapsed {
        transform: translateX(100%);
    }
    #collapseToggle {
        position: absolute;
        left: -20px;
        top: 20px;
        width: 20px;
        height: 40px;
        background: black;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        user-select: none;
    }
    .tab-buttons {
        display: flex;
        justify-content: space-around;
        margin-bottom: 10px;
    }
    .tab-btn {
        flex: 1;
        padding: 6px;
        border: none;
        cursor: pointer;
        background: #f0f0f0;
        font-weight: bold;
        border-radius: 8px;
    }
    .tab-btn.active {
        background: #1c1c1e;
        color: white;
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
    `;

    const containerHTML = `
    <div id="redTagTracker">
        <div id="collapseToggle">&lt;</div>
        <div class="tab-buttons">
            <button class="tab-btn active" id="tab1Btn">7 Days</button>
            <button class="tab-btn" id="tab2Btn">24 Hours</button>
        </div>
        <div id="tableWrapper">
            <table id="redTagTable">
                <thead><tr><th>Address</th><th>Date</th><th></th></tr></thead>
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

    function getStorageKey() {
        return STORAGE_KEYS[currentTab];
    }

    function getStoredData() {
        const raw = localStorage.getItem(getStorageKey());
        return raw ? JSON.parse(raw) : [];
    }

    function saveData(data) {
        localStorage.setItem(getStorageKey(), JSON.stringify(data));
    }

    function normalizeUrl(url) {
        return url.trim().toLowerCase().replace(/\/+$/, '');
    }

    function formatDate(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        }).toUpperCase();
    }

    function isDateStale(dateStr) {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        return currentTab === 'tab1'
            ? diffMs > 7 * 24 * 60 * 60 * 1000
            : diffMs > 24 * 60 * 60 * 1000;
    }

    function renderTable() {
        const tbody = document.querySelector('#redTagTable tbody');
        tbody.innerHTML = '';
        const data = getStoredData().sort((a, b) => new Date(a.date) - new Date(b.date));
        data.forEach(entry => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><a href="${entry.url}">${entry.address}</a></td>
                <td class="${isDateStale(entry.date) ? 'red-date' : ''}">${formatDate(entry.date)}</td>
                <td style="display:flex;gap:6px">
                    <button class="icon-btn" title="Edit">✏️</button>
                    <button class="icon-btn" title="Delete">❌</button>
                </td>`;
            tr.querySelector('button[title="Edit"]').onclick = () => showEditForm(entry);
            tr.querySelector('button[title="Delete"]').onclick = () => {
                saveData(getStoredData().filter(e => normalizeUrl(e.url) !== normalizeUrl(entry.url)));
                renderTable();
            };
            tbody.appendChild(tr);
        });
    }

    function showEditForm(entry) {
        const tbody = document.querySelector('#redTagTable tbody');
        const row = Array.from(tbody.children).find(tr => tr.querySelector('a')?.href === entry.url);
        if (!row) return;
        const editRow = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.innerHTML = `
            <input value="${entry.address}" style="width:32%">
            <input value="${entry.url}" style="width:32%">
            <input type="date" value="${entry.date}" style="width:26%">
            <button style="margin-top:4px;width:100%">Save</button>`;
        editRow.appendChild(cell);
        tbody.insertBefore(editRow, row.nextSibling);
        row.style.display = 'none';
        cell.querySelector('button').onclick = () => {
            const [addr, url, date] = [...cell.querySelectorAll('input')].map(i => i.value.trim());
            if (!addr || !url || !date) return alert('All fields required.');
            const data = getStoredData();
            const duplicate = data.some(e => normalizeUrl(e.url) !== normalizeUrl(entry.url) && normalizeUrl(e.url) === normalizeUrl(url));
            if (duplicate) return alert('Duplicate URL.');
            saveData(data.map(e => normalizeUrl(e.url) === normalizeUrl(entry.url) ? { address: addr, url, date } : e));
            renderTable();
        };
    }

    function togglePanel(collapse) {
        const panel = document.getElementById('redTagTracker');
        const toggle = document.getElementById('collapseToggle');
        if (collapse) {
            panel.classList.add('collapsed');
            toggle.innerHTML = '<';
            localStorage.setItem(STORAGE_KEYS.collapsed, 'true');
        } else {
            panel.classList.remove('collapsed');
            toggle.innerHTML = '>';
            localStorage.setItem(STORAGE_KEYS.collapsed, 'false');
        }
    }

    function injectUI() {
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);

        const div = document.createElement('div');
        div.innerHTML = containerHTML;
        document.body.appendChild(div);

        const tab1Btn = document.getElementById('tab1Btn');
        const tab2Btn = document.getElementById('tab2Btn');
        const toggle = document.getElementById('collapseToggle');

        // Tab switching
function switchTab(tab) {
    currentTab = tab;
    localStorage.setItem(STORAGE_KEYS.selectedTab, tab);
    tab1Btn.classList.toggle('active', tab === 'tab1');
    tab2Btn.classList.toggle('active', tab === 'tab2');
    renderTable();
}

tab1Btn.onclick = () => switchTab('tab1');
tab2Btn.onclick = () => switchTab('tab2');

        const savedTab = localStorage.getItem(STORAGE_KEYS.selectedTab);
if (savedTab === 'tab2') {
    switchTab('tab2');
} else {
    switchTab('tab1');
}

        // Collapse toggle
        toggle.onclick = () => {
            const isCollapsed = document.getElementById('redTagTracker').classList.contains('collapsed');
            togglePanel(!isCollapsed);
        };

        // Restore collapsed state
        const savedCollapsed = localStorage.getItem(STORAGE_KEYS.collapsed) === 'true';
        togglePanel(savedCollapsed);

        // Form
        document.getElementById('addRedTagBtn').onclick = () => {
            const form = document.getElementById('redTagInputForm');
            form.style.display = form.style.display === 'block' ? 'none' : 'block';
            document.getElementById('tagAddress').value = document.getElementById('addressReadonlyField')?.textContent?.split(',')[0] || '';
            document.getElementById('tagURL').value = location.href;
        };

        document.getElementById('saveRedTagBtn').onclick = () => {
            const addr = document.getElementById('tagAddress').value.trim();
            const url = document.getElementById('tagURL').value.trim();
            const date = document.getElementById('tagDate').value;
            if (!addr || !url || !date) return alert('All fields required.');
            const data = getStoredData();
            if (data.some(e => normalizeUrl(e.url) === normalizeUrl(url))) return alert('This URL already exists.');
            data.push({ address: addr, url, date });
            saveData(data);
            renderTable();
            document.getElementById('redTagInputForm').style.display = 'none';
        };

        // Export/Import
        document.getElementById('exportBtn').onclick = () => {
            const blob = new Blob([JSON.stringify(getStoredData(), null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `${currentTab}_red_tag_backup.json`;
            a.click();
        };
        document.getElementById('importBtn').onclick = () => {
            document.getElementById('importFileInput').click();
        };
        document.getElementById('importFileInput').onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const imported = JSON.parse(reader.result);
                    const current = getStoredData();
                    const merged = [...current];
                    imported.forEach(i => {
                        if (!merged.some(e => normalizeUrl(e.url) === normalizeUrl(i.url))) merged.push(i);
                    });
                    saveData(merged);
                    renderTable();
                } catch {
                    alert('Invalid file.');
                }
            };
            reader.readAsText(file);
        };

        renderTable();
    }

    const interval = setInterval(() => {
        if (document.body) {
            clearInterval(interval);
            injectUI();
        }
    }, 300);
})();
