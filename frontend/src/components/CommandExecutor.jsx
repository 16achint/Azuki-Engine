import { useState } from "react";
import { Copy, Trash } from "lucide-react";

function Button({ children, onClick, disabled, className }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-semibold transition ${
        disabled
          ? "bg-gray-500 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700"
      } text-white ${className}`}
    >
      {children}
    </button>
  );
}

function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

function Card({ children }) {
  return (
    <div className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
      {children}
    </div>
  );
}

export default function CommandExecutor() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const executeCommand = async () => {
    if (!command.trim()) return;

    setLoading(true);
    const newEntry = { command, output: "Running..." };
    setHistory((prev) => [newEntry, ...prev]);

    try {
      const res = await fetch("http://localhost:3000/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();

      setHistory((prev) =>
        prev.map((entry, idx) =>
          idx === 0 ? { ...entry, output: data.output || data.error } : entry
        )
      );
    } catch (error) {
      setHistory((prev) =>
        prev.map((entry, idx) =>
          idx === 0 ? { ...entry, output: "Failed to execute command." } : entry
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/bg-image.png')] text-white p-6">
      <h2 className="text-4xl font-bold font-[Orbitron] mb-4">AZUKI Engine</h2>

      <div className="flex gap-2 w-full max-w-lg">
        <Input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter a command..."
        />
        <Button onClick={executeCommand} disabled={loading}>
          {loading ? "Executing..." : "Run"}
        </Button>
      </div>

      {history.length > 0 && (
        <Button
          onClick={clearHistory}
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          <Trash className="w-4 h-4 inline-block mr-1" /> Clear History
        </Button>
      )}

      <div className="mt-6 w-full max-w-lg space-y-3">
        {history.map((entry, index) => (
          <Card key={index}>
            <div className="flex justify-between items-center">
              <span className="font-mono text-sm">{entry.command}</span>
              <button
                onClick={() => copyToClipboard(entry.command)}
                className="text-gray-400 hover:text-white transition"
              >
                <Copy className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400">{entry.output}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
