// ==UserScript==
// @name         AUTO BOT Keys
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  Auto collect keys
// @author       NOTHING X
// @match        https://work.ink/3t0/swfduegj
// @match        https://work.ink/3t0/e27ubo96
// @match        https://work.ink/3t0/ozpr1fjz
// @match        *://key.valex.io/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    const host = location.hostname;

    if (host === "work.ink") {
        const allowedPaths = [
            "/3t0/swfduegj",
            "/3t0/e27ubo96",
            "/3t0/ozpr1fjz"
        ];
        if (allowedPaths.includes(location.pathname)) {
            setTimeout(() => {
                location.replace("https://key.valex.io/");
            }, 1);
        }
        return;
    }

    if (host === "key.valex.io") {
        let scanning = true;
        let lastSaved = "";

        const overlay = document.createElement("div");
        overlay.style = `
            position:fixed;top:0;left:0;width:100vw;height:100vh;
            background:#000;opacity:0.3;z-index:9999;
            display:flex;justify-content:center;align-items:center;
            font-size:3em;font-weight:bold;color:#0f0;font-family:monospace;
            transition: all 0.3s ease-in-out;
        `;
        document.body.appendChild(overlay);

        const keyUI = document.createElement("div");
        keyUI.style = `
            position:fixed;top:70px;left:20px;z-index:10000;
            background:rgba(17, 17, 17, 0.95);color:#0f0;padding:14px 18px;
            border-radius:10px;border:1px solid #0f0;
            font-family:monospace;white-space:pre-wrap;
            max-height:70vh;overflow-y:auto;display:none;
            box-shadow: 0 0 20px #0f05;
            transition: all 0.3s ease-in-out;
        `;
        document.body.appendChild(keyUI);

        const toggleBtn = document.createElement("button");
        toggleBtn.textContent = "Show Keys";
        toggleBtn.style = `
            position:fixed;top:20px;right:20px;z-index:10000;
            background:#111;color:#0f0;border:1px solid #0f0;
            padding:10px 16px;border-radius:8px;font-size:16px;
            cursor:pointer;transition:all 0.3s ease-in-out;
        `;
        toggleBtn.onmouseover = () => toggleBtn.style.background = "#222";
        toggleBtn.onmouseout = () => toggleBtn.style.background = "#111";
        document.body.appendChild(toggleBtn);

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "Copy All Keys";
        copyBtn.style = `
            position:fixed;top:70px;right:20px;z-index:10000;
            background:#111;color:#0f0;border:1px solid #0f0;
            padding:8px 14px;border-radius:8px;font-size:14px;
            cursor:pointer;display:none;transition:all 0.3s ease-in-out;
        `;
        document.body.appendChild(copyBtn);

        const clearBtn = document.createElement("button");
        clearBtn.textContent = "Clear All Keys";
        clearBtn.style = `
            position:fixed;top:110px;right:20px;z-index:10000;
            background:#111;color:#0f0;border:1px solid #0f0;
            padding:8px 14px;border-radius:8px;font-size:14px;
            cursor:pointer;display:none;transition:all 0.3s ease-in-out;
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
                ? `Stored Keys:\n\n${keys.map((k, i) => `${i + 1}: ${k}`).join("\n")}`
                : "No keys found";
        };

        const copyKeysToClipboard = () => {
            if (keyUI.style.display === "none") return;
            const text = keyUI.textContent.replace(/^Stored Keys:\n\n/, '').replace(/\d+: /g, '');
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
                }, 1);

                return true;
            }
            return false;
        };

        setInterval(() => {
            if (!scanning) return;
            deleteSaveLabels();
            saveCode();
        }, 5);

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
            }
        };

        copyBtn.onclick = copyKeysToClipboard;
        clearBtn.onclick = clearAllKeys;
    }
})();
