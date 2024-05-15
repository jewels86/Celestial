async function _main() {
    if (!navigator.serviceWorker) throw new Error();
    await navigator.serviceWorker.register('/uv/sw.js'); 
    document.getElementById('frame').src = '/uv/service/' + location.href.split('=')[1];
}
_main();