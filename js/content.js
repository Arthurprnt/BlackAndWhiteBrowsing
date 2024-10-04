let url = document.URL;
let domain = url.split("//")[1].split("/")[0];
let date = new Date().getDate();

chrome.storage.local.get().then((result) => {
    var mask_site = false;
    for(i=0; i<result.masked_websites.length; i+=1) {
        if([result.masked_websites[i], `www.${result.masked_websites[i]}`, result.masked_websites[i].replace("www.", "")].includes(domain)) {
            mask_site = true;
        }
    }
    if(result.mask_all || mask_site) {
        console.log(`//style="filter: grayscale(100%)"`);
        (async () => {
            var baliseHTML = document.getElementsByTagName("*")[0];
            baliseHTML.style.filter = "grayscale(100%)";
        })();
    }
})