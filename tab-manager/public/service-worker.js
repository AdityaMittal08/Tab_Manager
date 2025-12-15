chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action == "getTabsData") {
    const fetchTabsAndRespond = async () => {
      try {
        const tabArray = await chrome.tabs.query({ currentWindow: true });

        sendResponse({ tabs: tabArray, success: true });
      } catch (error) {
        console.log("Erroe executing chrome.tabs.query:", error);
        sendResponse({ error: "Failed to query tabs API." })
      }
    };
    fetchTabsAndRespond();
    return true;
  }
});
