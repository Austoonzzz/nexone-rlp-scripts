// ==UserScript==
// @name         ShowingTime - Branches for Office Filter
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds branches to office filter panel
// @match        https://apptcenter.showingdesk.com/FrontDesk/Tasks/CallNow
// @match        https://apptcenter.showingdesk.com/FrontDesk/Tasks/CallLater
// @match        https://apptcenter.showingdesk.com/FrontDesk/Tasks/ShowingInstructions
// @match        https://apptcenter.showingdesk.com/FrontDesk/Tasks/AppointmentActivity
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const officeGroups = {
        'Bank Street': ['ROYP04', 'ROYP08', 'ROYP09', '506702', '506704'],
        'Pretoria': ['ROYP01', 'RMAR01', '506700', '505800', '506705'],
        'Orleans': ['ROYP03', 'ROYP07', 'ROYP10', '506701', '506703', '506706']
    };

    function waitForButtonAndObserve() {
        const observer = new MutationObserver(() => {
            const targetButton = Array.from(document.querySelectorAll('button.btn.btn-default.ng-binding'))
                .find(btn => /Selected/.test(btn.textContent));
            if (targetButton) {
                observer.disconnect();
                targetButton.addEventListener('click', () => {
                    waitForPanelAndInsert();
                });
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function waitForPanelAndInsert() {
        const observer = new MutationObserver(() => {
            const panel = document.querySelector('.panel.panel-primary');
            const filtersDiv = document.querySelector('.panel.panel-primary .filters');

            if (panel && filtersDiv && !document.getElementById('custom-office-filters')) {
                panel.style.maxHeight = 'none';

                const filterUI = createFilterUI();
                filtersDiv.parentNode.insertBefore(filterUI, filtersDiv);

                syncCustomCheckboxesWithUnderlying();

                // Add listeners to underlying checkboxes to keep syncing on changes
                const underlyingCheckboxes = document.querySelectorAll('.filters .checkbox input[type="checkbox"]');
                underlyingCheckboxes.forEach(cb => {
                    cb.addEventListener('change', () => {
                        syncCustomCheckboxesWithUnderlying();
                    });
                });

                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function createFilterUI() {
        if (document.getElementById('custom-office-filters')) return;

        const container = document.createElement('div');
        container.id = 'custom-office-filters';
        container.style.padding = '10px';
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '10px';
        container.style.alignItems = 'center';

        const title = document.createElement('strong');
        title.textContent = 'Office Filters:';
        title.style.marginRight = '10px';
        container.appendChild(title);

        for (const [office, codes] of Object.entries(officeGroups)) {
            const label = document.createElement('label');
            label.style.display = 'inline-flex';
            label.style.alignItems = 'center';
            label.style.gap = '4px';
            label.style.padding = '4px 8px';
            label.style.border = '1px solid #ccc';
            label.style.borderRadius = '4px';
            label.style.background = '#fff';
            label.style.cursor = 'pointer';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.office = office; // store office name for reference

            checkbox.addEventListener('change', () => {
                toggleCheckboxes(codes, checkbox.checked);
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(office));
            container.appendChild(label);
        }

        return container;
    }

    function toggleCheckboxes(codes, check) {
        const checkboxes = Array.from(document.querySelectorAll('.filters .checkbox input[type="checkbox"]'));
        checkboxes.forEach(cb => {
            const labelText = cb.closest('label')?.textContent || '';
            for (const code of codes) {
                if (labelText.includes(code)) {
                    if (cb.checked !== check) {
                        cb.click(); // triggers Angular bindings
                    }
                    break;
                }
            }
        });
    }

    function syncCustomCheckboxesWithUnderlying() {
        const customCheckboxes = document.querySelectorAll('#custom-office-filters input[type="checkbox"]');
        customCheckboxes.forEach(customCb => {
            const office = customCb.dataset.office;
            const codes = officeGroups[office];
            if (!codes) return;

            // Find all underlying checkboxes for this office group
            const underlyingCheckboxes = Array.from(document.querySelectorAll('.filters .checkbox input[type="checkbox"]'))
                .filter(cb => {
                    const labelText = cb.closest('label')?.textContent || '';
                    return codes.some(code => labelText.includes(code));
                });

            if (underlyingCheckboxes.length === 0) {
                customCb.checked = false;
                customCb.indeterminate = false;
                return;
            }

            const allChecked = underlyingCheckboxes.every(cb => cb.checked);
            const noneChecked = underlyingCheckboxes.every(cb => !cb.checked);

            if (allChecked) {
                customCb.checked = true;
                customCb.indeterminate = false;
            } else if (noneChecked) {
                customCb.checked = false;
                customCb.indeterminate = false;
            } else {
                // Partial selection
                customCb.checked = false;
                customCb.indeterminate = true;  // shows a visual partial check state
            }
        });
    }

    waitForButtonAndObserve();

})();
