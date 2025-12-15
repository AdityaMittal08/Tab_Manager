import "./App.css";
import { TabPage } from "./components/tabPage";
import { Title } from "./components/Title";
import { Routes, Route } from "react-router";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Title />} />
      <Route path="TabPage" element={<TabPage />} />
    </Routes>
  );
}

export default App;
