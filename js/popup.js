function swapStyleSheet(sheet) {
    document.getElementById("css_style").setAttribute("href", sheet);  
}

function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL("/_favicon/"));
    url.searchParams.set("pageUrl", u);
    url.searchParams.set("size", "64");
    return url.toString();
}

const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}

function rm_site_menu() {
    let icon = document.getElementById("favicon");
    icon.parentNode.removeChild(icon);
    let url = document.getElementById("domain");
    url.parentNode.removeChild(url);
}

let domain = "";

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    chrome.storage.local.get().then((result) => {
        if(result.use_dark_mode) {
            swapStyleSheet("../css/popup_dark.css")
        }
    });
    let full_url = tabs[0].url;
    if(full_url.startsWith("chrome-extension://")) {
        rm_site_menu();
    } else {
        domain = full_url.split("//")[1].split("/")[0];
        if(domain == "url" || !isValidUrl(domain)) {
            rm_site_menu();
        } else {
            document.getElementById("domain").textContent = domain;
            document.getElementById("favicon").src = tabs[0].favIconUrl;
        }
    }
});

const settings_button = document.getElementById("settings");
settings_button.addEventListener("click", function() {
    chrome.tabs.create({ url: "../html/settings.html"});
})