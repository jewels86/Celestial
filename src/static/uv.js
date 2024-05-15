document.getElementById('address').addEventListener('keydown', async (ev) => {
    if (ev.key == 'Enter') {
        try {
            var address = document.getElementById('address').value;
            console.log(`Sending to: ${address}`);
            if (!navigator.serviceWorker) throw new Error();

            await navigator.serviceWorker.register('/uv/sw.js');
            let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
            await BareMux.SetTransport("EpxMod.EpoxyClient", { wisp: wispUrl });

            address = address.replace('https://', '');
            address = address.replace('http://', '');
            address = ["https://", address].join('');
            var search = '';
            console.log(address);
            try { search = new URL(address).toString(); }
            catch { search = getCookie('search-engine').replace('%s', encodeURIComponent(address)); }
            location.replace('/x?y=' + __uv$config.encodeUrl(search));
        }
        catch {

        }
    }
});