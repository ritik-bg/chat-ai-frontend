import { useEffect, useState } from "react";
import "./index.css";
import { BASEURL } from "../../config/api.config";
import { useNavigate } from "react-router";

const MOCK_CHATS = [
  {
    id: 1,
    title: "Explain quantum entanglement",
    preview:
      "Quantum entanglement is a phenomenon where two particles become correlated...",
    model: "llama-3.3-70b",
    time: "2m ago",
    messages: 6,
    tag: "science",
  },
  {
    id: 2,
    title: "React Flow custom nodes setup",
    preview:
      "To create custom nodes in React Flow, you need to define a nodeTypes object...",
    model: "deepseek-r1",
    time: "1h ago",
    messages: 14,
    tag: "code",
  },
  {
    id: 3,
    title: "Best way to structure a Node.js API",
    preview:
      "For a production Node.js API, I recommend organizing your project with controllers...",
    model: "gemma-3-27b",
    time: "3h ago",
    messages: 9,
    tag: "code",
  },
  {
    id: 4,
    title: "Write a poem about midnight rain",
    preview:
      "The silver needles fall through dark, Stitching silence to the park...",
    model: "mistral-small",
    time: "Yesterday",
    messages: 4,
    tag: "creative",
  },
  {
    id: 5,
    title: "Difference between TCP and UDP",
    preview:
      "TCP (Transmission Control Protocol) ensures reliable, ordered delivery of data...",
    model: "llama-3.3-70b",
    time: "Yesterday",
    messages: 7,
    tag: "science",
  },
  {
    id: 6,
    title: "How to center a div in CSS",
    preview:
      "The modern way is using flexbox: display flex, align-items center, justify-content center...",
    model: "phi-3-mini",
    time: "2 days ago",
    messages: 3,
    tag: "code",
  },
  {
    id: 7,
    title: "Summarize the French Revolution",
    preview:
      "The French Revolution (1789–1799) was a period of radical political and social transformation...",
    model: "deepseek-chat",
    time: "2 days ago",
    messages: 5,
    tag: "history",
  },
  {
    id: 8,
    title: "Generate startup name ideas",
    preview:
      "Here are some creative startup name ideas: Lumiq, Veloxa, Stratify, Nexora, Driftly...",
    model: "gemma-3-27b",
    time: "3 days ago",
    messages: 11,
    tag: "creative",
  },
  {
    id: 9,
    title: "Fix my Python recursion error",
    preview:
      "The issue is a missing base case in your recursive function. Add: if n <= 0: return 0...",
    model: "deepseek-r1",
    time: "4 days ago",
    messages: 8,
    tag: "code",
  },
  {
    id: 10,
    title: "What is the Fermi paradox?",
    preview:
      "The Fermi Paradox asks: given the high probability of extraterrestrial civilizations...",
    model: "llama-3.3-70b",
    time: "1 week ago",
    messages: 6,
    tag: "science",
  },
];

const TAG_COLORS = {
  code: {
    bg: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.3)",
    text: "#60A5FA",
  },
  science: {
    bg: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.3)",
    text: "#34D399",
  },
  creative: {
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.3)",
    text: "#FBBF24",
  },
  history: {
    bg: "rgba(249,115,22,0.12)",
    border: "rgba(249,115,22,0.3)",
    text: "#F97316",
  },
};

const MODEL_ICONS = {
  llama: "🦙",
  deepseek: "🔍",
  gemma: "💎",
  mistral: "💨",
  phi: "Φ",
};

function getModelIcon(model) {
  for (const [key, icon] of Object.entries(MODEL_ICONS)) {
    if (model.toLowerCase().includes(key)) return icon;
  }
  return "🤖";
}

export default function AllChats() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [prevousChats, setprevousChats] = useState([]);
  const tags = ["all", "code", "science", "creative", "history"];
  const naviagate = useNavigate();

  const filtered = MOCK_CHATS.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.preview.toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === "all" || c.tag === activeTag;
    return matchSearch && matchTag;
  });

  const getchats = async () => {
    try {
      const res = await fetch(`${BASEURL}/getchats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      console.log("response of save chats", data);
console.log(data?.data,"data?.data");
      if (data?.data.length > 0) {
        
        
        setprevousChats(data.data);
      } else {
        alert("no chats found");
      }
    } catch (error) {
      console.error("error while getting chats", error);
    }
  };

  useEffect(() => {
    getchats();
  }, []);

  return (
    <>
      <div className="chat-page">
        <div className="content">
          {/* Header */}
          <div className="header">
            <div className="header-top">
              <div>
                <div className="header-badge">
                  <span className="header-badge-dot" />
                  CHAT HISTORY
                </div>
                <h1>
                  Your <span>Conversations</span>
                </h1>
                <p className="subtitle">
                  {prevousChats.length} chats across all models
                </p>
              </div>
              <button onClick={()=>naviagate("/create-chat")} className="new-chat-btn">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Chat
              </button>
            </div>

            {/* Search */}
            <div className="search-wrap">
              <svg
                className="search-icon"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="search-input"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Tag filters */}
            <div className="tags">
              {tags.map((t) => (
                <button
                  key={t}
                  className={`tag-btn ${activeTag === t ? "active" : "inactive"}`}
                  onClick={() => setActiveTag(t)}
                >
                  {t === "all" ? "All chats" : t}
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="stats-bar">
            <span className="stats-count">
              <span>{filtered.length}</span> result
              {filtered.length !== 1 ? "s" : ""}
            </span>
            <span
              className="stats-count"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
              sorted by recent
            </span>
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🔍</div>
              <div className="empty-text">No chats match your search</div>
            </div>
          ) : (
            <div className="chat-list">
              {prevousChats?.map((chat, i) => {
                const tagColor = TAG_COLORS[chat.tag] || TAG_COLORS.code;
                return (
                  <div
                    key={chat.id}
                    className={`chat-item ${selected === chat.id ? "selected" : ""}`}
                    style={{ animationDelay: `${i * 40}ms` }}
                    onClick={() =>
                      setSelected(chat.id === selected ? null : chat.id)
                    }
                    onMouseEnter={() => setHoveredId(chat.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Icon */}
                    {/* <div className="chat-icon">{getModelIcon(chat.model)}</div> */}

                    {/* Body */}
                    <div className="chat-body">
                      <div className="chat-title-row">
                        <span className="chat-title">{chat?.prompt}</span>
                        {/* <span
                          className="tag-pill"
                          style={{
                            background: tagColor.bg,
                            border: `1px solid ${tagColor.border}`,
                            color: tagColor.text,
                          }}
                        >
                          {chat.reply}
                        </span> */}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span className="chat-preview">{chat?.preview}</span>
                      </div>
                      {/* <div style={{ marginTop: 6 }}>
                        <span className="model-pill">
                          <span>{getModelIcon(chat.model)}</span>
                          {chat.model}
                        </span>
                      </div> */}
                    </div>

                    {/* Meta */}
                    <div className="chat-meta">
                      <span className="chat-time">{chat.time}</span>
                      <span className="chat-msgs">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        {chat.reply}
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={selected === chat.id ? "#818CF8" : "#334155"}
                        strokeWidth="2"
                        style={{ transition: "stroke 0.2s" }}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
