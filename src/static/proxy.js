const pages = [];

async function _main() {
    if (!navigator.serviceWorker) throw new Error();
    await navigator.serviceWorker.register(__uv$config.sw); 

    let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
    await BareMux.SetTransport("EpxMod.EpoxyClient", { wisp: wispUrl });
    await new Promise(r => setTimeout(r, 1000));

    const frame = document.getElementById('frame');
    frame.src = __uv$config.prefix + location.href.split('=')[1];
    window.history.pushState('', 'Celestial', location.href.split('?')[0]);

    executeScriptsForStage(1);
    registerKeybinds();

    var overlayOpen = false;

    frame.addEventListener('load', async (ev) => {
        frame.contentDocument.addEventListener('keydown', (ev) => { 
            if (ev.altKey && ev.key == 'o') {
                if (overlayOpen == true) { document.getElementById('overlay').remove(); overlayOpen = false; }
                if (overlayOpen == false) { overlay(() => { document.getElementById('overlay').remove(); overlayOpen = false; }); overlayOpen = true; }
            }
        });
        pages.push(decode(frame.src));
        executeScriptsForStage(2);
    });
}
function decode(x) { return __uv$config.decodeUrl(x.split('uv/service/')[1]); }
function encode(x) { return location.host + '/uv/service/' + encodeUrl(x); }
/**
 * @param {Function} close
 */
function overlay(close) {
    const overlay = createOverlay();

    const topDiv = document.createElement('div');
    topDiv.className = 'overlay-proxy-searchbar';
    const topDiv2 = document.createElement('div');

    const searchBar = document.createElement('input');
    searchBar.value = __uv$config.decodeUrl(frame.src.split('uv/service/')[1]);
    searchBar.addEventListener('keydown', (ev) => {
        if (ev.key == 'Enter') {
            frame.src = frame.src.split('uv/service/')[0] + 'uv/service/' + __uv$config.encodeUrl(processURL(searchBar.value));
        }
    });

    const reload = document.createElement('button');
    reload.innerText = 'Reload';
    reload.addEventListener('click', (ev) => frame.src += '');

    const back = document.createElement('button');
    back.innerText = 'Back';
    back.addEventListener('click', (ex) => iframe.src = pages[pages.length - 1]);

    const forward = document.createElement('button');
    forward.innerText = 'Forward';

    topDiv2.appendChild(reload);
    topDiv2.appendChild(back);
    topDiv2.appendChild(forward);

    topDiv.appendChild(searchBar);
    topDiv.appendChild(topDiv2);

    const closeButton = document.createElement('button');
    close.innerText = 'Close';
    close.addEventListener('click', () => close());


    const history = document.createElement('div');
    history.className = 'overlay-proxy-history';

    pages.forEach((link) => {
        const button = document.createElement('button');
        button.className = 'overlay-proxy-link';
        button.innerText = link;
        button.addEventListener('click', () => frame.src = encode(link));
        history.appendChild(button);
    });

    overlay.appendChild(topDiv);
    overlay.appendChild(history);
    overlay.appendChild(close);
    overlayOpen = true;
}
_main();