var currentTabId = 0;
var tabStatus = {};
var timeoutMs = 100;
var timerId = 0;
var frameCounter = 0;

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    currentTabId = tabs[0].id;
});

chrome.tabs.onSelectionChanged.addListener(function(tabId) {
    currentTabId = tabId;
});

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo) {
        tabStatus[tabId] = changeInfo.status;
        if (currentTabId == tabId) {
            if (changeInfo.status === 'loading') {
                doAnimation()
                startTimer()
            } else {
                stopTimer()
                doAnimation()
            }
        }
    }
)

function doAnimation() {
    var status = tabStatus[currentTabId] || 'complete';
    if (status === 'loading') {
        showNextFrame()
    } else {
        showStaticFrame()
    }
}

function showNextFrame() {
    chrome.browserAction.setIcon(
            {path: "images/logo-animated-" + frameCounter + ".gif",
             tabId: currentTabId});
    frameCounter = (frameCounter + 1) % 34;
}

function showStaticFrame() {
    chrome.browserAction.setIcon({path: "images/logo.png", tabId: currentTabId});
}

function restartTimer() {
    stopTimer()
    startTimer()
}

function startTimer() {
    timerId = window.setInterval(doAnimation, timeoutMs)
}

function stopTimer() {
    window.clearInterval(timerId)
}


