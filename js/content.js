let url = document.URL;
let domain = url.split("//")[1].split("/")[0];
let date = new Date().getDate();

window.addEventListener("DOMContentLoaded", (event) => {
    console.log(`//style="filter: grayscale(100%)"`);
    (async () => {
        var baliseHTML = document.getElementsByTagName("body")[0];
        baliseHTML.style.filter = "grayscale(100%)";
    })();
});