const toggle_dark = document.getElementById("toggle_darkmode");
const toggle_mask_all = document.getElementById("toggle_mask_all");

const isValidUrl = urlString=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
    '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}

function swapStyleSheet(id, sheet) {
    document.getElementById(id).setAttribute("href", sheet);  
}

function setEltsColor(sheet_ext) {
    swapStyleSheet("all_style", `../css/manage_${sheet_ext}.css`);
}

chrome.storage.local.get().then((result) => {
    if(result.use_dark_mode) {
        toggle_dark.checked = result.use_dark_mode;
        setEltsColor("dark");
    }
    if(result.mask_all) {
        toggle_mask_all.checked = result.mask_all;
        document.getElementById("edit_btn_div").style.display = "none";
    }
});

toggle_dark.addEventListener("click", function() {
    chrome.storage.local.get().then((result) => {
        let bool_val = !result.use_dark_mode;
        chrome.storage.local.set({use_dark_mode: bool_val}).then(() => {
            if(bool_val) {
                setEltsColor("dark");
            } else {
                setEltsColor("light");
            }
        });
    });
})

toggle_mask_all.addEventListener("click", function() {
    chrome.storage.local.get().then((result) => {
        let bool_val = !result.mask_all;
        chrome.storage.local.set({mask_all: bool_val}).then(() => {
            console.log(`Switch the mask all variable to ${bool_val}`)
            if (bool_val) {
                document.getElementById("edit_btn_div").style.display = "none";
            } else {
                document.getElementById("edit_btn_div").style.display = "flex";
            }
        });
    });
})

var dataURIToBlob = function(dataURI, mimetype) {
    var BASE64_MARKER = ';base64,';
    var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    var base64 = dataURI.substring(base64Index);
    var raw = window.atob(base64);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);
  
    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
  
    var bb = new this.BlobBuilder();
    bb.append(uInt8Array.buffer);
    return bb.getBlob(mimetype);
  };

document.getElementById("export_btn").addEventListener("click", function() {
    chrome.storage.local.get().then((result) => {
        result.hardcore_mode = false;
        let data = JSON.stringify(result);
        var blob = new Blob([data], {type: "json"});
        var url = URL.createObjectURL(blob);
        chrome.downloads.download({
            url: url,
            filename: "colorless_browsing_save.txt"
          });
    })
})

const file_input = document.getElementById("dnf_save_file");
file_input.addEventListener('change', (event) => {
    let file = file_input.files[0]
    const reader = new FileReader();
    reader.onload = function() {
        const contents = reader.result;
        try {
            json_data = JSON.parse(contents);
            let new_settings = {};
            chrome.storage.local.set({mask_all: json_data.mask_all});
            chrome.storage.local.set({masked_websites: json_data.masked_websites});
            chrome.storage.local.set({use_dark_mode: json_data.use_dark_mode});
            alert("Loaded this settings with success ! Reload this page to apply changes.");
        } catch (err) {
            alert("This is not a BWBrowsing save file.");
            console.log(err);
        }
    };
    reader.readAsText(file);
});