import { useEffect, useState } from "react";
import { LucideImageOff, X } from "lucide-react";

export function TabPage() {
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: "getTabsData" }, (response) => {
      setLoading(true);
      if (chrome.runtime.lastError) {
        console.log("Popup Error:", chrome.runtime.lastError.message);
        setLoading(false);
        return;
      }

      if (response && response.success) {
        console.log(response.tabs);
        setTabs(response.tabs);
      } else {
        console.log("Service Worker failed to return tabs:", response);
      }
      setLoading(false);
    });
  }, []);

  const handleTabclick = (tabId) => {
    chrome.runtime.sendMessage(
      { action: "activateTab", tabId: tabId },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Failed to communicate with service worker:",
            chrome.runtime.lastError
          );
        } else if (response && response.success) {
          window.close();
        }
      }
    );
  };

  return (
    <div className="bg-[#EBF4DD] w-150 h-max m-0 p-0 border-8  border-[#3B4953]">
      <div className="ml-5 mr-5">
        <div className="flex justify-center items-center">
          <p className="flex text-[#3B4953] font-mono mb-4 text-5xl font-bold text-heading md:text-5xl lg:text-6xl underline">
            YOUR TABS :P
          </p>
        </div>

        <div>
          <p className="text-md font-semibold text-[#3B4953] text-xl underline">
            Window 1 :-
          </p>
          <div className="grid grid-cols-4 gap-4 p-2 bg-[#59776A] rounded-md">
            {loading ? (
              <p>Fetching tabs...</p>
            ) : (
              tabs.map((tab) => (
                <div
                  key={tab.id}
                  className="flex flex-col items-center justify-start p-1 h-17.5 overflow-hidden bg-[#90AB8B] rounded-lg relative"
                >
                  <X className="absolute h-3 w-3 top-1 right-1" />
                  {tab.favIconUrl ? (
                    <img className="w-7 h-7 shrink-0" src={tab.favIconUrl} />
                  ) : (
                    <LucideImageOff className="w-7 h-7 shrink-0" />
                  )}
                  <div
                    className="w-full text-center mt-1"
                    onClick={() => handleTabclick(tab.id)}
                  >
                    <p className="text-md font-semibold text-white truncate hover:underline cursor-pointer">
                      {tab.title || "Untitled Tab"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
