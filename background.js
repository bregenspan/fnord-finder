/*global chrome */

(function () {

    // Inject if nytimes
    function checkForValidUrl(tabId, changeInfo, tab) {

        // hook on during load event only
        if (!changeInfo.status || changeInfo.status !== 'loading')
        {
            return;
        }

        if (tab.url.indexOf('nytimes.com') > -1) {
            chrome.tabs.executeScript(tabId, { file: "lib/jquery-1.7.1.min.js" });
            chrome.tabs.executeScript(tabId, { file: "lib/jquery.color.js" });
            chrome.tabs.executeScript(tabId, { file: "finder.js" });
        }
    }

    chrome.tabs.onUpdated.addListener(checkForValidUrl);

    // Listen for fnords found; show page action if so
    chrome.extension.onRequest.addListener(function (request, sender) {
        if (typeof request === 'object' && request.fnordsFound) {
            chrome.pageAction.show(sender.tab.id);
        }
    });

    // click handler for page action
    chrome.pageAction.onClicked.addListener(function (tab) {
        chrome.tabs.sendRequest(tab.id, { switchFnord: true });
    });

}());
