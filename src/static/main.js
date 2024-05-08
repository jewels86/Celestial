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

await switchTo("dark");