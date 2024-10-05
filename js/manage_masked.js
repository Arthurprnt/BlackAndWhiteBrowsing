const elts_blo = document.getElementById("blocked_div");
var texts_blo = [];
var paras_blo = [];
var btns_blo = [];

const isValidUrl = urlString => {
    var urlPattern = new RegExp('^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    return !!urlPattern.test(urlString);
}

function swapStyleSheet(id, sheet) {
    document.getElementById(id).setAttribute("href", sheet);
}

function setEltsColor(sheet_ext) {
    swapStyleSheet("all_style", `../css/manage_${sheet_ext}.css`);
}

var dataURIToBlob = function (dataURI, mimetype) {
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

function rm_elt_blo(texte) {
    chrome.storage.local.get().then((result) => {
        if (result.masked_websites.includes(texte)) {
            let ind = result.masked_websites.indexOf(texte);
            let new_blo_list = result.masked_websites;
            let para = document.getElementById(`${texte}-blo`);
            para.remove();
            new_blo_list.splice(ind, 1);
            chrome.storage.local.set({ masked_websites: new_blo_list }).then(() => {
                console.log("Successfully removed the domain from the blocked list")
            });
        }
    });
}

function showChild(res, paras, texts, btns, elts, rm_f, id_ext) {
    for (i = 0; i < res.length; i += 1) {
        const txt = res[i];
        paras[i] = document.createElement("p");
        paras[i].id = `${txt}-${id_ext}`;
        paras[i].className = "liste";
        texts[i] = document.createTextNode(`- ${res[i]} `);
        paras[i].appendChild(texts[i]);
        btns[i] = document.createElement("button");
        btns[i].textContent = 'x';
        btns[i].id = `button-${i}`;
        btns[i].className = "button";
        btns[i].addEventListener("click", function () {
            rm_f(txt);
        });
        paras[i].appendChild(btns[i]);
        elts.appendChild(paras[i]);
    }
}

function addChild(paras, texts, btns, elts, rm_f, id_ext, btn_id) {
    const domain = document.getElementById(btn_id).value;
    document.getElementById(btn_id).value = "";
    if (isValidUrl(domain)) {
        chrome.storage.local.get().then((result) => {
            let liste;
            let json;
            if (id_ext == "blo") {
                liste = result.masked_websites;
                json = { masked_websites: liste };
            } else {
                liste = result.dfn_limited;
                json = { dfn_limited: liste };
            }
            liste.push(domain);
            chrome.storage.local.set(json).then(() => {
                console.log(`Successfuly added the domain to the ${btn_id} list`);
                let ind = paras.length;
                paras.push(document.createElement("p"));
                paras[ind].id = `${domain}-${id_ext}`;
                paras[ind].className = "liste";
                texts.push(document.createTextNode(`- ${domain} `));
                paras[ind].appendChild(texts[ind]);
                btns.push(document.createElement("button"));
                btns[ind].textContent = 'x';
                btns[ind].id = `button-${i}`;
                btns[ind].className = "button";
                btns[ind].addEventListener("click", function () {
                    rm_f(domain);
                });
                paras[ind].appendChild(btns[ind]);
                elts.appendChild(paras[ind]);
            });
        });
    } else {
        console.log("Didn't add the domain because this is not a valid url");
    }
}

chrome.storage.local.get().then((result) => {
    if (result.use_dark_mode) {
        setEltsColor("dark");
    }
    showChild(result.masked_websites, paras_blo, texts_blo, btns_blo, elts_blo, rm_elt_blo, "blo");
});

document.getElementById("block_btn").addEventListener("click", function () {
    addChild(paras_blo, texts_blo, btns_blo, elts_blo, rm_elt_blo, "blo", "blocking");
})