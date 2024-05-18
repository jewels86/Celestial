const modTypes = [
    {name: "Style", index: 0},
    {name: "Script", index: 1},
    {name: "Overlay", index: 2},
    {name: "Page", index: 3}
]
const stages = [
    {name: "Startup", index: 0},
    {name: "Search", index: 1},
    {name: "URL Change", index: 2}
]
const defaultStyle = `primary:
secondary:
accent:
text:
gradient:`;
const settings = [
    {
        _type: "divider",
        content: "Tab"
    },
    {
        _type: "setting",
        name: "Style",
        action: "if ('[x]' != 'mod') { switchTo('[x]'); setCookie('style', '[x]'); } else { switchTo(null, getStyleFromMod()); setCookie('style', '[x]'); }",
        default: "getCookie('style')",
        type: "dropdown",
        choices: ["Light", "Dark", "Azure", "Inferno", "Emerald", "Mod"]
    },
    {
        _type: "setting",
        name: "Cloaking",
        action: "setCookie('cloaking', '[x]');",
        default: "getCookie('cloaking');",
        type: "dropdown",
        choices: ["Disabled", "about:blank"]
    },
    {
        _type: "divider",
        content: "Proxy"
    },
    {
        _type: "setting",
        name: "Search Engine",
        action: "handleSEChangeAction('[x]');",
        default: "handleSEDefault();",
        type: "dropdown",
        choices: ["Google", "Bing"]
    },
    {
        _type: "divider",
        content: "Miscellaneous"
    },
    {
        _type: "setting",
        name: "Mods",
        action: "setCookie('mods', '[x]');",
        default: "getCookie('mods');",
        type: "dropdown",
        choices: ["Enabled", "Disabled"]
    },
    {
        _type: "setting",
        name: "Jokes",
        action: "setCookie('jokes', '[x]');",
        default: "getCookie('jokes');",
        type: "dropdown",
        choices: ["JokeAPI", "icanhazdadjoke.com", "Chuck Norris", "Disabled"]
    }
]
const toReplace = [
    {character: ';', replacement: '\\s\\'},
    {character: '/', replacement: '\\f\\'},
    {character: '?', replacement: '\\q\\'},
    {character: ':', replacement: '\\c\\'},
    {character: '@', replacement: "\\a\\"},
    {character: '&', replacement: "\\a2\\"},
    {character: '=', replacement: "\\e\\"},
    {character: '$', replacement: "\\d\\"},
    {character: ',', replacement: "\\c2\\"},
    {character: '%', replacement: "\\p\\"},
    {character: '#', replacement: "\\h\\"},
    {character: '\n',replacement: "\\n\\"},
    {character: '.', replacement: "\\p2\\"}
]
const scripts = [];

async function get(path) {
    return (await fetch(path)).text();
}

async function switchTo(style, mod = '') {
    if (style != null) {
        var root = document.querySelector(':root');
        const data = await get(`/src/static/styles/${style}.txt`);
        data.split("\n").forEach(element => {
            const parts = element.split(":");
            root.style.setProperty(`--${parts[0]}`, parts[1]);
        });
    } else {
        var root = document.querySelector(':root');
        mod.split("\n").forEach(element => {
            const parts = element.split(":");
            root.style.setProperty(`--${parts[0]}`, parts[1]);
        });
    }
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            var output = c.substring(name.length, c.length);
            toReplace.forEach((r) => {
                output = output.replaceAll(r.replacement, r.character);
            });
            return output;
        }
    }
    return "";
}
function setCookie(name, value) {
    var _name = name;
    var _value = value;
    toReplace.forEach((r) => {
        _name = _name.replaceAll(r.character, r.replacement);
        _value = _value.replaceAll(r.character, r.replacement);
    });

    document.cookie = `${_name}=${_value}; expires=${new Date(2147483647 * 1000).toUTCString()};`;
}

function getAmountOfMods() {
    for (let i = 0; i >= 0; i++) {
        const modContent = getCookie(`mod-${i}`);
        if (modContent == null || modContent.length == 0) { return i; }
    }
}
function getModsWithType(type) {
    var output = [];
    for (let index = 0; index < getAmountOfMods(); index++) {
        if (getCookie(`mod-${index}`).split('-')[0] == type.toString()) output.push(index); 
    }
    return output;
}

function getStyleFromMod() {
    var output = '';
    getModsWithType(0).forEach(i => {
        const mod = getCookie(`mod-${i}`).split("-");
        if (mod[2] == '1') {
            output = mod[3];
        }
    });
    return output;
}

function createOverlay() {
    const div = document.createElement('div');
    div.id = 'overlay'
    document.body.appendChild(div);
    return div;
}

function handleSEChangeAction(se) {
    switch (se) {
        case 'google':
            setCookie('search-engine', 'https://www.google.com/search?q=%s');
            break;
        case 'bing':
            setCookie('search-engine', 'https://www.bing.com/search?q=%s');
            break;
    }
}
function handleSEDefault() {
    switch (getCookie('search-engine')) {
        case 'https://www.google.com/search?q=%s':
            return 'google';
        case 'https://www.bing.com/search?q=%s':
            return 'bing';
    }
}
function defaultCookie(name, defaultValue) {
    if (getCookie(name).length == 0) { setCookie(name, defaultValue); }
}
function getEnabledScriptsForStage(stage) {
    // [type {0}]-[name {1}]-[enabled(1)/disabled(0) {2}]-[keybind(0)/stage(1) {3}]-[keybind|stage {4}]-[content {5}]
    var output = [];

    for (let i = 0; i < getAmountOfMods(); i++) {
        const mod = getCookie(`mod-${i}`).split('-');

        if (mod[0] == '1' && mod[2] == '1' && mod[3] == '1' && mod[4] == stage) {
            output.push(mod[5]);
        }
    }

    return output;
}
function getEnabledKeybindScripts() {
    var output = [];

    for (let i = 0; i < getAmountOfMods(); i++) {
        const mod = getCookie(`mod-${i}`).split('-');

        if (mod[0] == '1' && mod[2] == '1' && mod[3] == '0') {
            output.push(mod.join('-'));
        }
    }

    return output;
}
function registerKeybinds() {
    getEnabledKeybindScripts().forEach((element) => {
        document.addEventListener('keydown', (ev) => {
            const mod = element.split('-');
            const keybind = mod[4].split('+');
            var check = "if (";
            keybind.forEach((part, index) => {
                if (part == 'ctrl' || part == 'alt' || part == 'shift') {
                    check += `ev.${part}Key`;
                }
                else {
                    check += `ev.key == '${part}'`;
                }
                if (index + 1 != keybind.length) { check += ' && '; }
                else { check += ')'}
            });
            var passed = false;
            eval(check + ' { passed = true; }');
            if (passed) { eval(mod[5]); }
        });
    });
}
function executeScriptsForStage(stage) {
    getEnabledScriptsForStage(stage).forEach((element) => eval(element));
}
function processURL(url) {
    var output = url
    if (!(output.includes('https://') || output.includes('http://')) && output.includes('.')) {
        output = ["https://", output].join('');
    }
    if (!output.includes('.')) {
        output = getCookie('search-engine').replace('%s', encodeURIComponent(output));
    }
    return output;
}