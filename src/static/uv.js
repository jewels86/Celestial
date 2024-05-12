/**
 * @type string
 */
const address = document.getElementById('address').value;
document.getElementById('address').addEventListener('keydown', async (ev) => {
    if (ev.key == 'Enter') {
        try {
            console.log('Sending to:');
            if (!navigator.serviceWorker) throw new Error();

            await navigator.serviceWorker.register('/uv/sw.js');
            let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
            await BareMux.SetTransport("EpxMod.EpoxyClient", { wisp: wispUrl });

            address.replace('https://', '');
            address.replace('http://', '');
            const _address = ['https://', address].join('');
            var search = '';
            try { search = new URL(_address).toString(); console.log(`Valid URL! ${search}`); }
            catch { search = getCookie('search-engine').replace('%s', encodeURIComponent(_address)); console.log(`Invalid!`); }
            console.log(search);
            console.log('/x?' + __uv$config.encodeUrl(search));
            //location.replace('/x?' + __uv$config.encodeUrl(search));
        }
        catch {

        }
    }
});