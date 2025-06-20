document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('input');
    const output = document.getElementById('output');
    const obfuscateBtn = document.getElementById('obfuscate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const junkCodeCheckbox = document.getElementById('junk-code');
    const stringEncodeCheckbox = document.getElementById('string-encode');

    // Obfuscate Lua code
    function obfuscateLua(code) {
        if (!code) return '';

        // 1. Encode strings (if enabled)
        if (stringEncodeCheckbox.checked) {
            code = code.replace(/"(.*?)"/g, (_, str) => {
                return `(string.char(${Array.from(str).map(c => c.charCodeAt(0)).join(','))})`;
            });
        }

        // 2. Randomize variable names
        const variables = new Set();
        const varRegex = /\b(?!local\b|function\b|if\b|then\b|else\b|end\b|for\b|while\b|do\b|repeat\b|until\b|return\b|break\b)([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
        let match;

        while ((match = varRegex.exec(code)) !== null) {
            if (match[1].length > 1) variables.add(match[1]);
        }

        const varMap = {};
        variables.forEach(v => {
            varMap[v] = `_${Math.floor(Math.random() * 900000 + 100000)}`;
        });

        for (const [old, newVar] of Object.entries(varMap)) {
            code = code.replace(new RegExp(`\\b${old}\\b`, 'g'), newVar);
        }

        // 3. Add junk code (if enabled)
        if (junkCodeCheckbox.checked) {
            const junkFuncs = [
                `local _${Math.floor(Math.random() * 900000 + 100000)}=function() return ${Math.floor(Math.random() * 1000)} end`,
                `local _${Math.floor(Math.random() * 900000 + 100000)}=function() return math.random() end`
            ].join(';');
            code = junkFuncs + ';' + code;
        }

        // 4. Minify
        code = code.replace(/--.*$/gm, ''); // Remove comments
        code = code.replace(/\s+/g, ' ');   // Collapse whitespace

        return code;
    }

    // Button actions
    obfuscateBtn.addEventListener('click', () => {
        output.value = obfuscateLua(input.value);
    });

    copyBtn.addEventListener('click', () => {
        output.select();
        document.execCommand('copy');
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            copyBtn.textContent = '📋 Copy';
        }, 2000);
    });

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
    });
});
