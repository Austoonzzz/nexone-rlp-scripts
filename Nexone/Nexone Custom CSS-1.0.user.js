// ==UserScript==
// @name         Nexone Custom CSS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Edit CSS of Nexone website
// @match        https://legend.nexone.ca/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .header_middle {
            background: url(https://i.imgur.com/fe8yeID.png);
            width: 925px;
            height: 42px;
            top: 0;
            float: left;
            font-size: 11px;
        }

        .header_right, .header_left, .footer_middle, .footer_right, .footer_left {
            background: black !important;
        }
    `);
})();
