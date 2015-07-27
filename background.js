var on = false;

function updateIcon(tab) {
  chrome.pageAction.setIcon({
    path: on ? 'icon_38x.png' :'icon_38.png',
    tabId: tab.id
  });
}

chrome.pageAction.onClicked.addListener(function (tab) {
  on = !on;
  chrome.tabs.sendRequest(tab.id, {});
  updateIcon(tab);
});

chrome.extension.onRequest.addListener( function (request, sender, sendResponse) {
  var tab = sender.tab;
  on = false;

  // Hides if there is no imagemap.
  if (request.count === 0) {
    chrome.pageAction.hide(tab.id);
    return;
  }

  updateIcon(tab);
  chrome.pageAction.setTitle({
    title: "image mapper\nfound " + request.count + " imagemaps.\nleft-click here to show them, click again to hide.",
    tabId: tab.id
  });
  chrome.pageAction.show(tab.id);
});
