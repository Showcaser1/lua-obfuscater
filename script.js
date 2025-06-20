document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const sampleBtn = document.getElementById('sample-btn');
    const junkCodeCheckbox = document.getElementById('junk-code');
    const stringEncodeCheckbox = document.getElementById('string-encode');
    const statusMessage = document.getElementById('status-message');
    const notification = document.getElementById('notification');

    // Sample code
    const sampleCode = `-- Sample Roblox Lua Script
local function greet(player)
    print("Hello, " .. player.Name .. "!")
    return true
end

local success = greet(game:GetService("Players").LocalPlayer)
if success then
    print("Greeting successful!")
end`;

    // Show notification
    function showNotification(message, duration = 3000) {
        notification.textContent = message;
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, duration);
    }

    // Update status
    function updateStatus(message, isError = false) {
        statusMessage.textContent = message;
        statusMessage.style.color = isError ? 'var(--error)' : 'var(--text)';
    }

    // Obfuscate Lua code
    function obfuscateLua(code) {
        if (!code.trim()) {
            updateStatus("Please enter some Lua code to obfuscate", true);
            return '';
        }

        try {
            let obfuscated = code;

            // 1. String encoding
            if (stringEncodeCheckbox.checked) {
                obfuscated = obfuscated.replace(/("(?:\\"|.)*?")/g, (match) => {
                    const content = match.slice(1, -1);
                    const hexCodes = Array.from(content).map(c => 
                        `\\${c.charCodeAt(0).toString(16).padStart(2, '0')}`
                    ).join('');
                    return `"${hexCodes}"`;
                });
            }

            // 2. Variable renaming
            const variables = new Set();
            const varRegex = /\b(?!local\b|function\b|if\b|then\b|else\b|end\b|for\b|while\b|do\b|repeat\b|until\b|return\b|break\b)([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
            
            let match;
            while ((match = varRegex.exec(obfuscated)) {
                if (match[1].length > 1) variables.add(match[1]);
            }

            const varMap = {};
            variables.forEach(v => {
                varMap[v] = `_${Math.floor(Math.random() * 900000 + 100000)}`;
            });

            for (const [old, newVar] of Object.entries(varMap)) {
                obfuscated = obfuscated.replace(new RegExp(`\\b${old}\\b`, 'g'), newVar);
            }

            // 3. Add junk code
            if (junkCodeCheckbox.checked) {
                const junkFuncs = [
                    `local _${Math.floor(Math.random() * 900000 + 100000)}=function() return ${Math.floor(Math.random() * 1000)} end`,
                    `local _${Math.floor(Math.random() * 900000 + 100000)}=function() return "${Math.random().toString(36).substring(2, 10)}" end`
                ].join(';');
                obfuscated = junkFuncs + ';' + obfuscated;
            }

            // 4. Minify
            obfuscated = obfuscated
                .replace(/--.*$/gm, '')
                .replace(/\s+/g, ' ')
                .trim();

            updateStatus(`Obfuscation successful! ${Math.round(obfuscated.length/1024 * 10)/10} KB`);
            return obfuscated;
        } catch (error) {
            console.error("Obfuscation error:", error);
            updateStatus("Obfuscation failed: " + error.message, true);
            return '';
        }
    }

    // Real-time obfuscation
    function handleInput() {
        output.value = obfuscateLua(input.value);
    }

    // Event listeners
    input.addEventListener('input', handleInput);
    junkCodeCheckbox.addEventListener('change', handleInput);
    stringEncodeCheckbox.addEventListener('change', handleInput);

    copyBtn.addEventListener('click', () => {
        if (!output.value) {
            showNotification("No obfuscated code to copy", 2000);
            return;
        }
        navigator.clipboard.writeText(output.value)
            .then(() => showNotification("Copied to clipboard!", 2000))
            .catch(err => {
                console.error("Copy failed:", err);
                showNotification("Failed to copy", 2000);
            });
    });

    downloadBtn.addEventListener('click', () => {
        if (!output.value) {
            showNotification("No obfuscated code to download", 2000);
            return;
        }
        const blob = new Blob([output.value], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'obfuscated.lua';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification("Download started", 2000);
    });

    sampleBtn.addEventListener('click', () => {
        input.value = sampleCode;
        handleInput();
        showNotification("Sample code loaded", 2000);
    });

    // Initialize
    updateStatus("Ready to obfuscate");
});
