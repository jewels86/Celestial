document.getElementById('address').addEventListener('keydown', async (ev) => {
    if (ev.key == 'Enter') {
        try {
            var address = document.getElementById('address').value;
            console.log(`Sending to: ${address}`);

            address = processURL(address);
            console.log(address);
            address = new URL(address).toString(); 
            location.replace('/x?y=' + __uv$config.encodeUrl(address));
        }
        catch (err) {
            console.error(err);
        }
    }
});