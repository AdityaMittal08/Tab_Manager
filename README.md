#  Tab Manager :P

A sleek, lightweight Chrome Extension built with **React** and **Tailwind CSS**. Designed with a calming "Sage and Slate" aesthetic, this tool helps you declutter your browser by organizing open windows, searching through tabs instantly, and pinning your favorites for permanent access.

---

##  Features

- ** Window Grouping**: Automatically organizes your open tabs by browser window for a clean overview.
- ** Persistent Pinning**: Save important tabs to a dedicated section. These stay pinned even after you restart Chrome, powered by `chrome.storage`.
- ** Instant Search**: Filter through dozens of tabs in real-time by title or URL.
- ** Quick Navigation**: One-click switching between active tabs or opening saved pins.
- ** Batch Management**: Close individual tabs or entire browser windows directly from the dashboard.
- ** Custom Aesthetic**: Custom-designed UI featuring a unique color palette and matching custom scrollbars.

---

##  Tech Stack

* **Frontend**: React.js
* **Styling**: Tailwind CSS
* **Icons**: Lucide-React
* **State Management**: React Hooks (useState, useEffect, useMemo)
* **Persistent Storage**: Chrome Extension Storage API (`chrome.storage.local`)
* **API**: Chrome Tabs API

---

##  Installation (Developer Mode)

To run this extension locally:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/tab-manager.git](https://github.com/your-username/tab-manager.git)
    cd tab-manager
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Build the project:**
    ```bash
    npm run build
    ```
4.  **Load into Chrome:**
    * Open Chrome and navigate to `chrome://extensions/`.
    * Enable **Developer mode** (toggle in the top right).
    * Click **Load unpacked** and select the `dist` (or `build`) folder.

---

## Privacy & Security

* **Zero Data Collection**: This extension does not track you or send data to external servers.
* **Local Storage**: Your "Saved Pins" and "Get Started" status are stored locally on your device.
* **Permission Transparency**:
    * `tabs`: To display and manage your open tabs.
    * `storage`: To remember your pinned tabs and onboarding status.



Distributed under the MIT License.
