// A Global variable to store ignored Domains.
// Duck Google will not create alerts for
// domains in this list.  This list can be updated by
// message passing from the options script.
var ignoredDomains = [];
var badDomains = ['www.google.com', 'www.yahoo.com'];

// Helper function to get the hostname from a URL
function getHostname(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser.hostname;
}

// Add a listener for ignored Domain Updates
chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        switch (request.greeting) {
            case "updateIgnoredDomains":
                ignoredDomains = request.ignoredDomains;
                sendResponse({
                    farewell: "goodbye"
                });
                break;
            default:
                sendResponse({}); // snub them.
        }
    }
);

$(document).ready(function() {
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            var safe = true;
            if (request.greeting === "inspectPage") {
                // Make sure that the web page is in the browser and not in the extension
                if (sender.tab) {

                    var pageUrl = sender.tab.url;
                    var hostname = getHostname(pageUrl);

                    if (!ignoredDomains.includes(hostname)) {
                        if (badDomains.includes(hostname)) {
                            var safe = false;
                        }
                    } else {
                        console.log("Domain is in ignored domains list.");
                    }
                } else {
                    // It appears as though this occurs when the webpage accessed is the extension
                    console.log("Not processing this page because sender.tab did not exist");
                }
            }
            if (safe) {
              sendResponse({
                  danger: false
              });
            } else {
              sendResponse({
                  danger: true
              });
            }
        }
    );

    // Allow the toggling of the extension
    chrome.browserAction.onClicked.addListener(function(tab) {
        chrome.storage.sync.get('state', function(data) {
            if (data.state === 'on') {
                chrome.storage.sync.set({
                    state: 'off'
                });
                chrome.browserAction.setIcon({
                    path: "../img/icon-off.png"
                });
            } else {
                chrome.storage.sync.set({
                    state: 'on'
                });
                chrome.browserAction.setIcon({
                    path: "../img/icon-on.png"
                });
            }
        });
    });

    // Initial loading determination
    chrome.storage.sync.get('state', function(data) {
        if (data.state === 'on') {
            chrome.browserAction.setIcon({
                path: "../img/icon-on.png"
            });
        } else {
            chrome.browserAction.setIcon({
                path: "../img/icon-off.png"
            });
        }
    });

    // Update ignoredDomains on a reload fixes #20
    chrome.storage.sync.get({
        ignoredDomains: []
    }, function(items) {
        ignoredDomains = items.ignoredDomains;
    });
});
