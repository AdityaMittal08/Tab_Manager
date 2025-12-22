import { useEffect, useState, useMemo } from "react";
import { LucideImageOff, X, ArrowLeft, Search, Pin } from "lucide-react";
import { Link } from "react-router";

export function TabPage() {
  const [tabsByWindow, setTabsByWindow] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pinActive, setPinActive] = useState(false);
  const [pinnedTabs, setPinnedTabs] = useState([]);

  useEffect(() => {
    setLoading(true);
    chrome.runtime.sendMessage({ action: "getTabsData" }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Popup Error:", chrome.runtime.lastError.message);
        setLoading(false);
        return;
      }

      if (response && response.success) {
        setTabsByWindow(response.groupedTabs || {});
      }

      chrome.storage.local.get(["savedPins"], (result) => {
        if (result.savedPins) {
          setPinnedTabs(result.savedPins);
        }
      });
      setLoading(false);
    });
  }, []);

  const handleTabclick = (tabId) => {
    chrome.runtime.sendMessage(
      { action: "activateTab", tabId: tabId },
      (response) => {
        if (!chrome.runtime.lastError && response?.success) {
          window.close();
        }
      }
    );
  };

  const handleRemoveClick = (e, tabId, windowId) => {
    e.stopPropagation();
    chrome.runtime.sendMessage(
      { action: "removeTab", tabId: tabId },
      (response) => {
        if (response && response.success) {
          setTabsByWindow((prev) => {
            const updatedWindowTabs = prev[windowId].filter(
              (tab) => tab.id !== tabId
            );

            if (updatedWindowTabs.length === 0) {
              const { [windowId]: _, ...rest } = prev;
              return rest;
            }

            return {
              ...prev,
              [windowId]: updatedWindowTabs,
            };
          });
        }
      }
    );
  };

  const handleCloseWindow = (windowId) => {
    const tabIds = tabsByWindow[windowId].map((t) => t.id);
    chrome.tabs.remove(tabIds, () => {
      setTabsByWindow((prev) => {
        const { [windowId]: _, ...rest } = prev;
        return rest;
      });
    });
  };

  const filteredTabsByWindow = useMemo(() => {
    if (!searchQuery.trim()) return tabsByWindow;

    const lowerQuery = searchQuery.toLowerCase();
    return Object.entries(tabsByWindow).reduce((acc, [windowId, tabs]) => {
      const filtered = tabs.filter(
        (tab) =>
          tab.title?.toLowerCase().includes(lowerQuery) ||
          tab.url?.toLowerCase().includes(lowerQuery)
      );

      if (filtered.length > 0) {
        acc[windowId] = filtered;
      }
      return acc;
    }, {});
  }, [searchQuery, tabsByWindow]);

  const pinActivation = () => {
    if (!pinActive) {
      setPinActive(true);
    } else {
      setPinActive(false);
    }
  };

  const handlePinTabs = (tab) => {
    const isAlreadyPinned = pinnedTabs.some((p) => p.url === tab.url);
    let updatedPins;

    if (isAlreadyPinned) {
      updatedPins = pinnedTabs.filter((p) => p.url !== tab.url);
    } else {
      const newPin = {
        id: Date.now(),
        title: tab.title,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
      };
      updatedPins = [...pinnedTabs, newPin];
    }

    setPinnedTabs(updatedPins);
    chrome.storage.local.set({ savedPins: updatedPins });
  };

  const openPinnedTab = (url) => {
    chrome.tabs.create({ url });
  };

  if (loading)
    return <div className="p-4 font-mono bg-[#EBF4DD]">Loading tabs...</div>;

  return (
    <div className="bg-[#EBF4DD] w-150 h-145 overflow-y-auto custom-scrollbar border-8 border-[#3B4953] m-0 p-0">
      <div className="ml-5 mr-5">
        <div className="flex justify-center items-center relative py-2">
          <Link to="/">
            <ArrowLeft className="absolute top-3 left-0 cursor-pointer text-[#3B4953]" />
          </Link>
          <p className="text-[#3B4953] font-mono text-5xl font-bold underline">
            YOUR TABS :P
          </p>
          <Pin
            className="absolute top-3 right-0 cursor-pointer text-[#3B4953]"
            onClick={pinActivation}
          />
        </div>

        {pinActive ? (
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <span className="text-xl font-mono font-bold text-[#3B4953] underline flex items-center gap-2">
                <Pin className="h-5 w-5 fill-[#3B4953]" /> SAVED PINS :-
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4 p-2 bg-[#3B4953] rounded-md border border-[#3B4953]">
              {pinnedTabs.map((pin) => (
                <div
                  key={pin.id}
                  className="flex flex-col items-center p-1 h-17.5 bg-[#90AB8B] rounded-lg relative border border-[#EBF4DD]/30 group"
                >
                  <X
                    className="absolute h-3 w-3 top-1 right-1 cursor-pointer text-[#3B4953] opacity-0 group-hover:opacity-100"
                    onClick={() => handlePinTabs(pin)}
                  />

                  {pin.favIconUrl ? (
                    <img className="w-7 h-7 mt-1" src={pin.favIconUrl} />
                  ) : (
                    <LucideImageOff className="w-7 h-7 mt-1 text-[#3B4953]" />
                  )}
                  <div
                    className="w-full text-center mt-1 px-1 cursor-pointer"
                    onClick={() => openPinnedTab(pin.url)}
                  >
                    <p className="text-[10px] leading-tight font-semibold text-white truncate hover:underline">
                      {pin.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="relative w-full mb-6">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#3B4953]" />
          </div>
          <input
            type="text"
            placeholder="Search by title or URL..."
            className="w-full pl-10 pr-4 py-2 bg-[#90AB8B] border-2 border-[#3B4953] rounded-lg text-[#3B4953] placeholder-[#3B4953]/70 focus:outline-none font-mono"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {Object.keys(filteredTabsByWindow).length === 0 ? (
          <p className="text-center font-mono text-[#3B4953] py-10">
            {searchQuery ? "NO MATCHING TABS FOUND!" : "NO TABS OPEN!"}
          </p>
        ) : (
          Object.entries(filteredTabsByWindow).map(
            ([windowId, tabs], index) => (
              <div key={windowId} className="pb-4">
                <div className="flex items-center mb-2">
                  <span className="text-md font-semibold text-[#3B4953] text-xl underline font-mono">
                    Window {index + 1} :-
                  </span>
                  <button
                    onClick={() => handleCloseWindow(windowId)}
                    className="ml-4 text-xs bg-[#90AB8B] text-[#3B4953] px-2 py-1 rounded cursor-pointer border border-[#3B4953] hover:bg-red-400"
                  >
                    <span className="text-xs font-mono text-white">
                      Close Window
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4 p-2 bg-[#59776A] rounded-md">
                  {tabs.map((tab) => (
                    <div
                      key={tab.id}
                      className="flex flex-col items-center justify-start p-1 h-17.5 overflow-hidden bg-[#90AB8B] rounded-lg relative border border-[#3B4953]/30"
                    >
                      <Pin
                        className={`absolute h-3 w-3 top-1 left-1 cursor-pointer hover:text-white ${
                          pinnedTabs.some((p) => p.url === tab.url)
                            ? "fill-white text-white"
                            : "text-[#3B4953]"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePinTabs(tab);
                        }}
                      />
                      <X
                        className="absolute h-3 w-3 top-1 right-1 cursor-pointer hover:text-red-700 text-[#3B4953]"
                        onClick={(e) => handleRemoveClick(e, tab.id, windowId)}
                      />

                      {tab.favIconUrl ? (
                        <img
                          className="w-7 h-7 shrink-0 mt-1"
                          src={tab.favIconUrl}
                          alt=""
                        />
                      ) : (
                        <LucideImageOff className="w-7 h-7 shrink-0 mt-1 text-[#3B4953]" />
                      )}

                      <div
                        className="w-full text-center mt-1 px-1"
                        onClick={() => handleTabclick(tab.id)}
                      >
                        <p className="text-[10px] leading-tight font-semibold text-white truncate hover:underline cursor-pointer">
                          {tab.title || "Untitled Tab"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          )
        )}
      </div>
    </div>
  );
}
