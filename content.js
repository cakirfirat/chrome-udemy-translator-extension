$("#language-save").click(function () {
    var lang = $("#language").val();
    chrome.storage.local.set({ 'language': lang }, function () {
        console.log('Veri kaydedildi.');
    });
});



$("#googleapi-save").click(function () {
    var googleapi = $("#googleapi").val();
    chrome.storage.local.set({ 'googleapi': googleapi }, function () {
        console.log('Veri kaydedildi.');
    });
});

chrome.storage.local.get(["language"], function (result) {
    $("#language").val(result.language);
});

chrome.storage.local.get(["googleapi"], function (result) {
    $("#googleapi").val(result.googleapi);
});



function observeCaptionChanges(targetNode) {

    if (targetNode) {
        var observer = new MutationObserver(function (mutationsList) {
            for (var mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    var lang = "tr"
                    var text = $('.captions-display--captions-cue-text--ECkJu').text();
                    $('.captions-display--captions-cue-text--ECkJu').text("");
                    chrome.storage.local.get(["language"], function (result) {
                        lang = result.language;
                    });
                    chrome.storage.local.get(["googleapi"], function (result) {
                        if (result.googleapi != null) {
                            sendCaptionToAPI(text, lang, result.googleapi);
                        } else {
                            console.log("Google API Key is not defined");
                            return
                        }
                    });

                }
            }
        });

        observer.observe(targetNode.parentNode, { childList: true });
    }
}


function sendCaptionToAPI(caption, targetLanguage, googleapi) {
    var API_KEY = googleapi;

    var url = "https://translation.googleapis.com/language/translate/v2";
    var params = {
        key: API_KEY,
        q: caption,
        target: targetLanguage
    };
    axios.get(url, { params: params })
        .then(function (response) {
            var translatedText = response.data.data.translations[0].translatedText;
            $('.captions-display--captions-cue-text--ECkJu').text(translatedText);
        })
        .catch(function (error) {
            console.error("API isteği sırasında bir hata oluştu: lütfen google api keyinizi kontrol edin");
            return
        });
}



// Elementin yüklenmesini bekleyen yeni gözlemci
var loadingObserver = new MutationObserver(function (mutations) {
    var targetNode = document.querySelector('[data-purpose="captions-cue-text"]');
    if (targetNode) {
        loadingObserver.disconnect();  // Element bulunduğunda, gözlemciyi durdurun
        observeCaptionChanges(targetNode);  // Element bulunduğunda, orijinal işlevi çağırın
    }
});

$("#flexSwitchCheckDefault").change(function () {
    if ($(this).is(":checked")) {
        chrome.storage.local.set({ 'isActive': true }, function () {
            console.log('Veri kaydedildi.');
        });
        $("#close").css("display", "none")
        $("#open").css("display", "")

    } else {
        chrome.storage.local.set({ 'isActive': false }, function () {
            console.log('Veri kaydedildi.');
        });
        $("#close").css("display", "")
        $("#open").css("display", "none")
    }
});

loadingObserver.observe(document, { childList: true, subtree: true });

