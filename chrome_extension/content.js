//alert("aaa");
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.action == "startBot") {
        sendResponse({status: "ok"});
    } else {
        sendResponse({});
    }
});