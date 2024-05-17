document.getElementById('address').addEventListener('keydown', async (ev) => {
    if (ev.key == 'Enter') {
        try {
            var address = document.getElementById('address').value;
            console.log(`Sending to: ${address}`);
            if (!navigator.serviceWorker) throw new Error();

            await navigator.serviceWorker.register(__uv$config.sw);
            let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
            await BareMux.SetTransport("EpxMod.EpoxyClient", { wisp: wispUrl });

            if (!(address.includes('https://') || address.includes('http://')) && address.includes('.')) {
                address = ["https://", address].join('');
            }
            if (!address.includes('.')) {
                address = getCookie('search-engine').replace('%s', encodeURIComponent(address));
            }
            console.log(address);
            address = new URL(address).toString(); 
            location.replace('/x?y=' + __uv$config.encodeUrl(address));
        }
        catch {

        }
    }
});