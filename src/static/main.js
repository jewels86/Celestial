async function get(path) {
    return (await fetch(path)).text();
}

async function switchTo(style) {
    var root = document.querySelector(':root');
    const data = await get(`/src/static/styles/${style}.txt`);
    data.split("\n").forEach(element => {
        const parts = element.split(":");
        root.style.setProperty(`--${parts[0]}`, parts[1]);
    });
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
    document.cookie = `${name}=${value};`;
}

function createOverlay() {
    const div = document.createElement('div');
    div.id = 'overlay'
    document.body.appendChild(div);
    return div;
}

function settingsHandler() {
    if (settingsActive) {
        document.getElementById('overlay').remove();
        settingsActive = false;
    }
    else {
        const overlay = createOverlay();
        const settings = [
            {
                name: "Style",
                action: "setCookie('style', '[x]'); switchTo('[x]');",
                default: "getCookie('style')",
                type: "dropdown",
                choices: ["Light", "Dark", "Inferno", "Emerald"]
            },
            {
                name: "Mods",
                action: "setCookie('mods-enabled', '[x]');",
                default: "getCookie('mods-enabled');",
                type: "dropdown",
                choices: ["Enabled", "Disabled"]
            }
        ]

        settings.forEach((item) => {
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
        });

        settingsActive = true;

        document.body.appendChild(overlay);
    }
}

let settingsActive = false;

if (getCookie("style") !== null) {
    await switchTo(getCookie("style"));
    console.log(`${getCookie("style")} (found)`);
}
else {
    await switchTo("dark");
    setCookie("style", "dark");
    console.log(`${getCookie("style")} (not found)`);
}

const _s = document.getElementById("settings");
_s.onclick = () => settingsHandler();