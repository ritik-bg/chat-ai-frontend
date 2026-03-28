import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { BASEURL } from "../../config/api.config";
import { useNavigate } from "react-router";



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

export default function AllChats({selected,setSelected}) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("all");
  
  const [hoveredId, setHoveredId] = useState(null);
  const [prevousChats, setprevousChats] = useState([]);
  const tags = ["all", "code", "science", "creative", "history"];
  const naviagate = useNavigate();

const filtered = useMemo(() => {
  if (!prevousChats?.length) return [];

  const searchText = search?.toLowerCase() || '';

  return prevousChats.filter((c) => {
    const matchSearch =
      c?.prompt?.toLowerCase().includes(searchText) ||
      c?.reply?.toLowerCase().includes(searchText);

    const matchTag =
      activeTag === 'all' || c?.tag === activeTag;

    return matchSearch && matchTag;
  });
}, [prevousChats, search, activeTag]);

const getPreview = (text = '', wordCount = 8) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(' ') + '...';
};


  const getchats = async () => {
    try {
      const res = await fetch(`${BASEURL}/getchats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
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
              <button
                onClick={() => naviagate("/create-chat")}
                className="new-chat-btn"
              >
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
              <span>{filtered?.length}</span> result
              {filtered?.length !== 1 ? "s" : ""}
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
          {filtered?.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🔍</div>
              <div className="empty-text">No chats match your search</div>
            </div>
          ) : (
            <div className="chat-list">
              {filtered?.map((chat, i) => {

                return (
                  <div
                    key={chat._id}
                    className={`chat-item ${selected === chat._id ? "selected" : ""}`}
                    style={{ animationDelay: `${i * 40}ms` }}
                    onClick={() =>
                     { setSelected(chat._id === selected ? null : chat._id);
                      naviagate("/chat-preview",{  state: {chat}})
                     }
                    }
                    onMouseEnter={() => setHoveredId(chat._id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <div className="chat-body">
                      <div className="chat-title-row">
                        <span className="chat-title">{chat?.prompt}</span>
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
                        {getPreview(chat.reply)}
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
