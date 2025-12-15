chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action == "getTabsData") {
    const fetchTabsAndRespond = async () => {
      try {
        const tabArray = await chrome.tabs.query({ currentWindow: true });

        sendResponse({ tabs: tabArray, success: true });
      } catch (error) {
        console.log("Error executing chrome.tabs.query:", error);
        sendResponse({ error: "Failed to query tabs API." });
      }
    };
    fetchTabsAndRespond();
    return true;
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
