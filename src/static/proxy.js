async function _main() {
    if (!navigator.serviceWorker) throw new Error();
    await navigator.serviceWorker.register(__uv$config.sw); 
    document.getElementById('frame').src = __uv$config.prefix + location.href.split('=')[1];
}
_main();