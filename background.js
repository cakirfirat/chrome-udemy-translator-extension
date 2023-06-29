chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
    });
});
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.type === 'changeIsActive') {
//         if (request.isActive) {
//             // Observer'ı başlat
//             loadingObserver.observe(document, { childList: true, subtree: true });
//         } else {
//             // Observer'ı durdur
//             loadingObserver.disconnect();
//         }
//     }
// });
chrome.storage.local.get(["isActive"], function (result) {
    console.log(result.isActive)
  });