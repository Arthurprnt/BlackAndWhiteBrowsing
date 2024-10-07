let url = document.URL;
let domain = url.split("//")[1].split("/")[0];
let mask_site = false;
let finishedReading = false;

var displayMode = document.getElementsByTagName("*")[0].style.display;
document.getElementsByTagName("*")[0].style.display = "none";

chrome.storage.local.get().then((result) => {
    if (result.mask_all) {
        mask_site = true;
        finishedReading = true;
    } else {
        for (i = 0; i < result.masked_websites.length; i += 1) {
            if ([result.masked_websites[i], `www.${result.masked_websites[i]}`, result.masked_websites[i].replace("www.", "")].includes(domain)) {
                mask_site = true;
                finishedReading = true;
            }
        }
    }
})

document.addEventListener("DOMContentLoaded", () => {
    while (!finishedReading) {
        //
    }
    if (mask_site) {
        console.log(`//style="filter: grayscale(100%)"`);
        (async () => {
            var baliseHTML = document.getElementsByTagName("*")[0];
            baliseHTML.style.filter = "grayscale(100%)";
        })();
    }
    document.getElementsByTagName("*")[0].style.display = displayMode;
}); 