import { Leaf, Mouse } from "lucide-react";
import { Link } from "react-router";

const Features = [
  {
    topic: "📄 View All Tabs: ",
    statement: "See a clean list of every open tab in your current window.",
  },
  {
    topic: "🚀 Fast Switching: ",
    statement: "Click any tab title to instantly jump to that page.",
  },
  {
    topic: "❌ Quick Cleanup: ",
    statement: "Close unwanted tabs individually without leaving the popup.",
  },
  {
    topic: "⚡Lightweight & Fast: ",
    statement: "Built with React for a snappy, responsive experience.",
  },
];

export function Title() {
  return (
    <div className="bg-[#EBF4DD] w-150 h-max m-0 p-0 border-8  border-[#3B4953]">
      <div className=" flex justify-center items-center ">
        <p className="flex text-[#3B4953] font-mono mb-4 text-5xl font-bold text-heading md:text-5xl lg:text-6xl underline">
          <Leaf className="w-10 h-10 mt-2 mr-2" />
          Tab Manager
        </p>
      </div>

      <div className="ml-5 mr-5">
        <div className="mb-2">
          <p className="text-md font-semibold text-[#3B4953] text-xl">
            Q- Do you find yourself lost in a sea of open tabs?
          </p>
          <p className="text-[#5A7863]">
            <span className="text-md font-semibold text-[#3B4953] text-md">
              Solution- <span className="underline">Tab Manager</span>{" "}
            </span>{" "}
            is a lightweight, privacy-focused extension designed to help you
            organize your browsing experience without slowing down your
            computer.
          </p>
          <p className="text-[#5A7863]">
            Built with performance in mind, this extension gives you a clear,
            vertical list of all your active tabs. No more squinting at tiny
            favicons—see the full titles of your pages and manage them with a
            single click.
          </p>
        </div>
        <p className="text-md font-semibold text-[#3B4953] text-xl underline">
          Key Features:
        </p>
        <ol>
          {Features.map((feature) => (
            <li key={feature.topic} className="b-1 text-[#5A7863]">
              <span className="font-semibold text-[#3B4953]">
                {feature.topic}
              </span>
              {feature.statement}
            </li>
          ))}

          <li className="flex b-1 text-[#5A7863]">
            <Mouse className="w-5 h-5 mt-0.5" />
            <span className="font-semibold text-[#3B4953]">
              Scroll to change Tabs:
            </span>
            Change your tabs with the scroll of your mouse.
          </li>
        </ol>
      </div>
      <div className="flex justify-center items-center">
        <Link to="TabPage">
          <button className="border-3 mb-3 mt-4 border-[#3B4953] rounded-lg w-50 h-10 text-lg font-semibold text-[#EBF4DD] cursor-pointer bg-[#3B4953]">
            Let's get started
          </button>
        </Link>
      </div>
    </div>
  );
}
