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
    const pages = [];

    frame.addEventListener('load', async (ev) => {
        frame.contentDocument.addEventListener('keydown', (ev) => { 
            if (ev.altKey && ev.key == 'o') {
                if (overlayOpen == true) { document.getElementById('overlay').remove(); overlayOpen = false; }
                if (overlayOpen == false) { overlay(() => { document.getElementById('overlay').remove(); overlayOpen = false; }); overlayOpen = true; }
            }
        });
        pages.push(frame.src);
        executeScriptsForStage(2);
    });
}
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

    overlay.appendChild(topDiv);
    overlay.appendChild(closeButton);

    overlayOpen = true;
}
_main();