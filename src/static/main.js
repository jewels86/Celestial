let settingsOverlayActive = false;
let modsOverlayActive = false;

function settingsHandler() {
    if (settingsOverlayActive) {
        document.getElementById('overlay').remove();
        settingsOverlayActive = false;
    }
    else if (!settingsOverlayActive && !modsOverlayActive){
        const overlay = createOverlay();

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
    else if (modsOverlayActive) {
        document.getElementById('mods').click();
        document.getElementById('settings').click();
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
        <option value="script">Script</option>
        <option value="overlay">Overlay</option>
        <option value="page">Page</option>
    </select>
</div>
            `

            div.innerHTML = html;
            const button2 = document.createElement('button');
            button2.innerText = 'Create';

            button2.onclick = () => {
                const numberOfMods = getAmountOfMods();
                const name = document.getElementById("sub-overlay-name").value;

                if (document.getElementById('sub-overlay-type').value == "style") {
                    var toWrite1 = 'mod-' + numberOfMods.toString();
                    var toWrite2 = '0-' + (name.length != 0 || name != null ? name : " ") + '-0-' + defaultStyle;
                    setCookie(toWrite1, toWrite2);
                }
                if (document.getElementById('sub-overlay-type').value == "script") {
                    var toWrite1 = 'mod-' + numberOfMods.toString();
                    var toWrite2 = '1-' + (name.length != 0 || name != null ? name : " ") + '-0-1-0-';
                    setCookie(toWrite1, toWrite2);
                }

                div.remove();
                document.getElementById('mods').click();
                document.getElementById('mods').click();
            }
            div.appendChild(button2);
            document.body.appendChild(div);
        };

        overlay.appendChild(button);
        console.log(getAmountOfMods());
        for (let i = 0; i <= getAmountOfMods() - 1; i++) {
            const mod = getCookie(`mod-${i}`).split('-');
            
            const div = document.createElement('div');
            div.className = "overlay-mod";

            const div2 = document.createElement('div');
            const div3 = document.createElement('div');

            const dropdown = document.createElement('select');
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');

            option1.innerText = 'Enabled';
            option2.innerText = 'Disabled';

            option1.value = '1';
            option2.value = '0';

            dropdown.appendChild(option1);
            dropdown.appendChild(option2);

            dropdown.addEventListener('change', () => {
                console.log(`Changed! (${dropdown.value})`);
                if (dropdown.value == '1') {
                    mod[2] = '1';
                    setCookie(`mod-${i}`, mod.join('-'));
                } else {
                    mod[2] = '0';
                    setCookie(`mod-${i}`, mod.join('-'));
                }
            });

            const dropdown2 = document.createElement('select');
            
            modTypes.forEach((element) => {
                const option = document.createElement('option');
                option.innerText = element.name;
                option.value = element.index.toString();
                dropdown2.appendChild(option);
            });

            dropdown2.addEventListener('change', () => {
                mod[0] = dropdown2.value;
                setCookie(`mod-${i}`, mod.join('-'));
                document.getElementById('mods').click();
                document.getElementById('mods').click();
            });
            dropdown2.value = mod[0];

            const text = document.createElement('p');
            text.innerText = `${mod[1]}`;
            div.appendChild(text);
            const textarea = document.createElement('textarea');
            textarea.spellcheck = false;

            const nameInput = document.createElement('input');
            nameInput.value = mod[1];
            nameInput.className = 'name-input';
            nameInput.addEventListener('change', () => {
                mod[1] = nameInput.value;
                setCookie(`mod-${i}`, mod.join('-'));
                text.innerText = mod[1];
            });

            const deleteButton = document.createElement('button');
            deleteButton.innerText = 'Delete';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => {
                document.cookie = `mod-${i}=; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
                div.remove();
            });

            div2.className = 'overlay-mod-sub';
            div3.className = 'overlay-mod-settings';

            div3.appendChild(dropdown);
            div3.appendChild(dropdown2);
            div3.appendChild(nameInput);
            div3.appendChild(deleteButton);

            if (mod[0] == '0') {
                // [type]-[name]-[enabled(1)/disabled(0)]-[content]
                textarea.textContent = mod[3];
                dropdown.value = mod[2] == 1 ? '1' : '0';

                textarea.addEventListener('change', () => {
                    mod[3] = textarea.value;
                    setCookie(`mod-${i}`, mod.join('-'));
                });
            }
            if (mod[0] == '1') {
                // [type]-[name]-[enabled(1)/disabled(0)]-[keybind(0)/stage(1)]-[keybind|stage]-[content]
                textarea.textContent = mod[5];
                dropdown.value = mod[2] == 1 ? '1' : '0';

                if (mod[3] == '1') {
                    const stageDropdown = document.createElement('select');

                    stages.forEach((element) => {
                        const option = document.createElement('option');
                        option.innerText = element.name;
                        option.value = element.index.toString();
                        stageDropdown.appendChild(option);
                    });
                    stageDropdown.value = mod[4];
                    div3.appendChild(stageDropdown);
                }
                if (mod[3] == '0') {
                    const keybindInput = document.createElement('input');
                    keybindInput.style.margin = '0';
                    keybindInput.value = mod[4];
                    div3.appendChild(keybindInput);
                }

                const keybindOrStage = document.createElement('select');
                keybindOrStage.innerHTML = `<option value="0">Keybind</option>\n<option value="1">Stage</option>`;
                keybindOrStage.addEventListener('change', () => {
                    if (keybindOrStage.value == 0) { mod[4] = 'ctrl+alt+1'; }
                    if (keybindOrStage.value == 1) { mod[4] = '0'; }
                    mod[3] = keybindOrStage.value;
                    setCookie(`mod-${i}`, mod.join("-"));
                    document.getElementById('mods').click();
                    document.getElementById('mods').click();
                });
                keybindOrStage.value = mod[3];
                div3.appendChild(keybindOrStage);

                textarea.addEventListener('change', () => {
                    mod[5] = textarea.value;
                    setCookie(`mod-${i}`, mod.join('-'));
                });
            }
            

            div2.appendChild(textarea);
            div2.appendChild(div3);
            div.appendChild(div2);

            overlay.appendChild(div);
        }

        document.body.appendChild(overlay);
        modsOverlayActive = true;
    }
    else if (settingsOverlayActive) {
        document.getElementById('settings').click();
        document.getElementById('mods').click();
    }
}
async function main() {
    if (getCookie("style") != null && getCookie("style").length != 0 && getCookie("style") != "mod") {
        await switchTo(getCookie("style"));
        console.log(`${getCookie("style")} (found)`);
    }
    else if (getCookie("style") != "mod"){
        await switchTo("dark");
        setCookie("style", "dark");
        console.log(`${getCookie("style")} (not found)`);
    }
    else {
        console.log('mod (found)');
        switchTo(null, getStyleFromMod());
    }
    defaultCookie('jokes', 'jokeapi');
    defaultCookie('mods', 'enabled');
    defaultCookie('cloaking', 'disabled');
    defaultCookie('search-engine', 'http://google.com/search?q=%s');

    if (getCookie('jokes') != "disabled") {
        if (getCookie('jokes') == "jokeapi") {
            while (true) {
                const joke = await fetch("https://v2.jokeapi.dev/joke/miscellaneous,dark,pun?type=single");
                const _joke = await joke.json();
                if (!_joke.safe) { continue; }
                document.getElementById('joke').innerText = _joke.joke.replaceAll('\n', " ");
                break;
            }
        }
        else if (getCookie('jokes') == "icanhazdadjoke.com") {
            document.getElementById('joke').innerText = await (await fetch('https://icanhazdadjoke.com/', {
                headers: 
                {
                    "User-Agent": "https://github.com/jewels86/Celestial", 
                    "Accept": "text/plain"
                }
            })).text();
            document.getElementById('joke').innerText = document.getElementById('joke').innerText.replaceAll('\n', " ");
        }
        else if (getCookie('jokes') == "chuck norris") {
            await fetch("https://api.chucknorris.io/jokes/random").then((res) => {
                res.json().then((json) => {document.getElementById('joke').innerText = json.value;});
            })
        }
    }
    
    if (getCookie('mods') == 'enabled') {
        executeScriptsForStage(0);
        registerKeybinds();
    }

    const _s = document.getElementById("settings");
    _s.onclick = () => settingsHandler();
    const _m = document.getElementById("mods");
    _m.onclick = () => modsHandler();
}
main();