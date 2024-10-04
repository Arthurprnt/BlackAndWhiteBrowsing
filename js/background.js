chrome.runtime.onInstalled.addListener(function (){
    chrome.storage.local.get().then((result) => {
        if(result.mask_all === undefined) {
            chrome.storage.local.set({mask_all: true}).then(() => {
                console.log(`Initialised mask_all to false`);
            });        
        }
        if(result.masked_websites === undefined) {
            chrome.storage.local.set({masked_websites: []}).then(() => {
                console.log("Initialised masked list");
            });
        }
        if(result.use_dark_mode === undefined) {
            chrome.storage.local.set({use_dark_mode: true}).then(() => {
                console.log(`Initialised dark mode use to false`);
            });        
        }
    });
    
})