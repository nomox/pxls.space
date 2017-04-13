alert("aaa");
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == "getHtml") {
        sendResponse({doc: document});
    } else {
        sendResponse({});
    }
});