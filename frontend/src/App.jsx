import CommandExecutor from "./components/CommandExecutor";
import Icon from "./components/Icon";

export default function App() {
  return (
    <div className="fixed w-full h-screen bg-[#0f081e] flex items-center justify-center ">
      {/* Background Icons */}
      <Icon />

      {/* CommandExecutor should be above icons */}
      <div className="relative z-10 w-full max-w-2xl">
        <CommandExecutor />
      </div>
    </div>
  );
}
