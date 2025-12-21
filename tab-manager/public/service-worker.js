chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action == "getTabsData") {
    // 1. Query ALL tabs across ALL windows
    chrome.tabs.query({}, (tabs) => {
      // 2. Group tabs by their windowId
      const groupedTabs = tabs.reduce((acc, tab) => {
        if (!acc[tab.windowId]) {
          acc[tab.windowId] = [];
        }
        acc[tab.windowId].push(tab);
        return acc;
      }, {});

      // 3. Send back the grouped object
      sendResponse({ groupedTabs: groupedTabs, success: true });
    });
    return true; // Keep the message port open for async response
  }

  if (message.action === "activateTab") {
    if (message.tabId) {
      chrome.tabs.update(message.tabId, { active: true }, (tab) => {
        if (chrome.runtime.lastError) {
          console.log(
            "Error activating tab:",
            chrome.runtime.lastError.message
          );
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
        } else {
          sendResponse({ success: true, tabId: tab.id });
        }
      });
      return true;
    } else {
      sendResponse({ success: false, error: "Missing tabId" });
    }
  }

  if (message.action === "removeTab") {
    if (message.tabId) {
      chrome.tabs.remove(message.tabId, () => {
        if (chrome.runtime.lastError) {
          console.error(
            "Error removing tab:",
            chrome.runtime.lastError.message
          );
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
        } else {
          console.log(`Successfully removed tab ID: ${message.tabId}`);
          sendResponse({ success: true, tabId: message.tabId });
        }
      });

      return true;
    } else {
      sendResponse({ success: false, error: "Missing tabId" });
    }
  }
});
