const modTypes = Object.freeze({
    Style: 0,
    Page: 1,
    Overlay: 2,
    Script: 3
});
const scriptStages = Object.freeze({
    Startup: 0,
    Search: 1
});
const defaultStyle = `
primary:
secondary:
accent:
text:
gradient:
`;

async function get(path) {
    return (await fetch(path)).text();
}

async function switchTo(style, mod=null) {
    if (style != null) {
        var root = document.querySelector(':root');
        const data = await get(`/src/static/styles/${style}.txt`);
        data.split("\n").forEach(element => {
            const parts = element.split(":");
            root.style.setProperty(`--${parts[0]}`, parts[1]);
        });
    } else {
        console.log(mod);
        console.log(style);
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
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}
function setCookie(name, value) {
    document.cookie = `${name}=${value}; expires=${new Date(2147483647 * 1000).toUTCString()};`;
}

function getAmountOfMods() {
    for (let i = 0; i >= 0; i++) {
        const modContent = getCookie(`mod-${i}-content`);
        if (modContent == null || modContent.length == 0) { return i; }
    }
}

function createOverlay() {
    const div = document.createElement('div');
    div.id = 'overlay'
    document.body.appendChild(div);
    return div;
}

let settingsOverlayActive = false;
let modsOverlayActive = false;

function settingsHandler() {
    if (settingsOverlayActive) {
        document.getElementById('overlay').remove();
        settingsOverlayActive = false;
    }
    else if (!settingsOverlayActive && !modsOverlayActive){
        const overlay = createOverlay();
        const settings = [
            {
                _type: "divider",
                content: "Tab"
            },
            {
                _type: "setting",
                name: "Style",
                action: " setCookie('style', '[x]'); if ('[x]' != 'mod') { switchTo('[x]'); } else { window.location.reload(); }",
                default: "getCookie('style')",
                type: "dropdown",
                choices: ["Light", "Dark", "Inferno", "Emerald", "Mod"]
            },
            {
                _type: "setting",
                name: "Cloaking",
                action: "",
                default: "",
                type: "dropdown",
                choices: ["Disabled", "about:blank"]
            },
            {
                _type: "divider",
                content: "Miscellaneous"
            },
            {
                _type: "setting",
                name: "Mods",
                action: "setCookie('mods-enabled', '[x]');",
                default: "getCookie('mods-enabled');",
                type: "dropdown",
                choices: ["Enabled", "Disabled"]
            },
            {
                _type: "setting",
                name: "Jokes",
                action: "setCookie('jokes', '[x]');",
                default: "getCookie('jokes');",
                type: "dropdown",
                choices: ["Enabled", "Disabled"]
            }
        ]

        settings.forEach((item) => {
            if (item._type == "setting") {
                const div = document.createElement('div');
                div.className = 'overlay-setting';

                const text = document.createElement('p');
                text.innerText = item.name

                div.appendChild(text);

                if (item.type == 'dropdown') {
                    const dropdown = document.createElement('select');

                    item.choices.forEach(_item => {
                        const option = document.createElement('option');
                        option.value = _item.toLowerCase();
                        option.innerText = _item;
                        dropdown.appendChild(option);
                    });

                    dropdown.onchange = () => {
                        eval(`${item.action.replaceAll('[x]', dropdown.value)}`);
                    };

                    dropdown.value = eval(item.default);
                    div.appendChild(dropdown);
                }

                overlay.appendChild(div);
            }
            else if (item._type == "divider") {
                const h2 = document.createElement('h2');
                const hr = document.createElement('hr');
                const div = document.createElement('div');
                h2.innerText = item.content;
                div.className = "overlay-divider";
                div.appendChild(h2);
                div.appendChild(hr);
                overlay.appendChild(div);
            }
        });
        settingsOverlayActive = true;

        document.body.appendChild(overlay);
    }
}
function modsHandler() {
    if (modsOverlayActive) {
        document.getElementById('overlay').remove();
        modsOverlayActive = false;
    }
    else if (!modsOverlayActive && !settingsOverlayActive) {
        const overlay = createOverlay();

        const button = document.createElement('button');
        button.innerText = "New";
        button.onclick = () => {
            const div = document.createElement('div');
            div.id = "sub-overlay";
            const html = `
<div class="sub-overlay-option">
    <p>Name</p>
    <input type="text" id="sub-overlay-name">
</div>
<div class="sub-overlay-option">
    <p>Type</p>
    <select id="sub-overlay-type">
        <option value="style">Style</option>
        <option value="script">SCript</option>
    </select>
</div>
            `

            div.innerHTML = html;
            const button2 = document.createElement('button');

            button2.onclick = () => {
                const numberOfMods = getAmountOfMods();
                const name = document.getElementById("sub-overlay-name").value;

                console.log(`mod-${numberOfMods}-content=${defaultStyle};`);
                setCookie(`mod-${numberOfMods}-content=${defaultStyle};`);

                if (document.getElementById('sub-overlay-type').value == "style") {
                    setCookie(`mod-${numberOfMods}-settings`, `0-${name.length != 0 || name == null ? name.value : " "}-0`);
                }

                div.remove();
                window.location.reload();
            }
            div.appendChild(button2);
            document.body.appendChild(div);
        };

        overlay.appendChild(button);
        console.log(getAmountOfMods());
        for (let i = 0; i <= getAmountOfMods() - 1; i++) {
            const modContent = getCookie(`mod-${i}-content`);
            console.log(`Found mod ${i}: ${modContent}`);
            
            const modSettings = getCookie(`mod-${i}-settings`).split('-');
            
            const div = document.createElement('div');
            div.className = "overlay-mod";

            if (modSettings[0] == modTypes.Style) {
                // [type]-[name]-[enabled(1)/disabled(0)]
                if (modSettings[2] != 0) switchTo(null, modContent);
                const text = document.createElement('p');
                text.innerText = `${modSettings[1]} (Style)`;
                div.appendChild(text);

                const textarea = document.createElement('textarea');
                textarea.value = modContent;
                div.appendChild(textarea);
            }
            overlay.appendChild(div);
        }

        document.body.appendChild(overlay);
        modsOverlayActive = true;
    }
}

if (getCookie("style") != null && getCookie("style").length != 0) {
    await switchTo(getCookie("style"));
    console.log(`${getCookie("style")} (found)`);
}
else {
    await switchTo("dark");
    setCookie("style", "dark");
    console.log(`${getCookie("style")} (not found)`);
}
if (getCookie("jokes") == null || getCookie("jokes").length == 0) {
    setCookie('jokes', 'enabled');
}

if (getCookie('jokes') == "enabled") {
    while (true) {
        const joke = await fetch("https://v2.jokeapi.dev/joke/miscellaneous,dark,pun?type=single");
        const _joke = await joke.json();
        if (!_joke.safe) { continue; }
        document.getElementById('joke').innerText = _joke.joke.replaceAll('\n', " ");
        break;
    }
}

const _s = document.getElementById("settings");
_s.onclick = () => settingsHandler();
const _m = document.getElementById("mods");
_m.onclick = () => modsHandler();