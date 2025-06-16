// ==UserScript==
// @name         AUTO BOT Keys
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  INFO
// @author       NOTHING X
// @match        *://work.ink/*
// @match        https://key.valex.io/*
// @grant        none
// ==/UserScript==

// ==UserScript==
// @name         AUTO BOT Keys
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  INFO
// @author       NOTHING X
// @match        *://work.ink/*
// @match        https://key.valex.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const host = location.hostname;

    if (host.includes("work.ink")) {
        location.replace("https://key.valex.io/");
        return;
    }

    if (host === "key.valex.io") {
        let scanning = true;
        let attempts = 0;
        const maxAttempts = 10;
        let lastSaved = "";

        const overlay = document.createElement("div");
        overlay.style = `
            position:fixed;top:0;left:0;width:100vw;height:100vh;
            background:#000;opacity:0.7;z-index:9999;
            display:flex;justify-content:center;align-items:center;
            font-size:3em;font-weight:bold;color:#0f0;font-family:monospace;
        `;
        overlay.textContent = "^😈^";
        document.body.appendChild(overlay);

        const keyUI = document.createElement("div");
        keyUI.style = `
            position:fixed;top:70px;left:20px;z-index:99999;
            background:#111;color:#0f0;padding:10px 15px;
            border-radius:8px;border:1px solid #0f0;
            font-family:monospace;white-space:pre-wrap;
            max-height:70vh;overflow-y:auto;display:none;
        `;
        document.body.appendChild(keyUI);

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "Show Keys";
        toggleBtn.style = `
            position:fixed;top:20px;right:20px;z-index:99999;
            background:#111;color:#0f0;border:1px solid #0f0;
            padding:8px 16px;border-radius:6px;font-size:16px;
            cursor:pointer;
        `;
        document.body.appendChild(toggleBtn);

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "Copy All Keys";
        copyBtn.style = `
            position:fixed;top:70px;right:20px;z-index:99999;
            background:#111;color:#0f0;border:1px solid #0f0;
            padding:6px 12px;border-radius:6px;font-size:14px;
            cursor:pointer;display:none;
        `;
        document.body.appendChild(copyBtn);

        const clearBtn = document.createElement("button");
        clearBtn.textContent = "Clear All Keys";
        clearBtn.style = `
            position:fixed;top:110px;right:20px;z-index:99999;
            background:#111;color:#0f0;border:1px solid #0f0;
            padding:6px 12px;border-radius:6px;font-size:14px;
            cursor:pointer;display:none;
        `;
        document.body.appendChild(clearBtn);

        const deleteSaveLabels = () => {
            document.querySelectorAll('[class*="save"]').forEach(elem => elem.remove());
        };

        const showKeys = () => {
            const keys = Object.keys(localStorage)
                .filter(k => k.startsWith("key-"))
                .map(k => localStorage[k])
                .filter(k => k.startsWith("valex"));

            keyUI.textContent = keys.length
                ? `😈:\n\n${keys.map((k, i) => `${i + 1}: ${k}`).join("\n")}`
                : "None Keys 😈";
        };

        const copyKeysToClipboard = () => {
            if (keyUI.style.display === "none") return;
            const text = keyUI.textContent.replace(/^\😈.*\n\n/, '').replace(/\d+: /g, '');
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.textContent = "Copied!";
                setTimeout(() => copyBtn.textContent = "Copy All Keys", 1500);
            });
        };

        const clearAllKeys = () => {
            Object.keys(localStorage)
                .filter(k => k.startsWith("key-"))
                .forEach(k => localStorage.removeItem(k));
            showKeys();
            clearBtn.textContent = "Cleared!";
            setTimeout(() => clearBtn.textContent = "Clear All Keys", 1500);
        };

        const saveCode = () => {
            const codeElem = document.querySelector("code");
            if (!codeElem || !scanning) return false;

            const code = codeElem.innerText.trim();
            if (!code || code === lastSaved || !code.startsWith("valex")) return false;

            const exists = Object.values(localStorage).includes(code);
            if (!exists) {
                let id = 1;
                while (localStorage.getItem("key-" + id)) id++;
                localStorage.setItem("key-" + id, code);
                lastSaved = code;

                setTimeout(() => {
                    if (scanning) location.reload();
                }, 800);

                return true;
            }
            return false;
        };

        const interval = setInterval(() => {
            if (!scanning || ++attempts > maxAttempts) {
                clearInterval(interval);
                return;
            }
            deleteSaveLabels();
            saveCode();
        }, 10);

        toggleBtn.onclick = () => {
            if (keyUI.style.display === "none") {
                scanning = false;
                showKeys();
                keyUI.style.display = "block";
                copyBtn.style.display = "inline-block";
                clearBtn.style.display = "inline-block";
                toggleBtn.textContent = "Hide Keys";
            } else {
                keyUI.style.display = "none";
                copyBtn.style.display = "none";
                clearBtn.style.display = "none";
                toggleBtn.textContent = "Show Keys";
                scanning = true;
                attempts = 0;
            }
        };

        copyBtn.onclick = copyKeysToClipboard;
        clearBtn.onclick = clearAllKeys;
    }
})();
