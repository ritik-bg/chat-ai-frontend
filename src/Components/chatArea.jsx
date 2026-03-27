import { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
} from "reactflow";
import "reactflow/dist/style.css";
import { BASEURL } from "../config/api.config";
import {useNavigate} from "react-router"


function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <defs>
        <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6EE7F7" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <BaseEdge
        path={edgePath}
        style={{
          stroke: `url(#grad-${id})`,
          strokeWidth: 2.5,
          filter: "url(#glow)",
        }}
      />

      {data?.animated && (
        <circle r="5" fill="#6EE7F7" filter="url(#glow)">
          <animateMotion dur="1.8s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      <EdgeLabelRenderer>
        {data?.label && (
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
            className="nodrag nopan"
          >
            <span
              style={{
                background: "rgba(110,231,247,0.15)",
                border: "1px solid rgba(110,231,247,0.4)",
                color: "#6EE7F7",
                fontSize: "10px",
                padding: "2px 8px",
                borderRadius: "99px",
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.05em",
              }}
            >
              {data.label}
            </span>
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
}

function InputNode({ data }) {
  return (
    <div
      style={{
        width: 340,
        background: "linear-gradient(135deg, #0f1729 0%, #0d1f3c 100%)",
        border: "1px solid rgba(110,231,247,0.25)",
        borderRadius: "20px",
        padding: "24px",
        boxShadow:
          "0 0 40px rgba(110,231,247,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #6EE7F7, #60A5FA)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(110,231,247,0.4)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0f1729"
            strokeWidth="2.5"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div>
          <div
            style={{
              color: "#E2E8F0",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.02em",
            }}
          >
            Type Your Query Here
          </div>
          <div
            style={{
              color: "#64748B",
              fontSize: "11px",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            INPUT
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "5px" }}>
          {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => (
            <div
              key={c}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c,
                opacity: 0.8,
              }}
            />
          ))}
        </div>
      </div>

      {/* Textarea */}
      <div style={{ position: "relative" }}>
        <textarea
          value={data.prompt}
          onChange={(e) => data.onChange(e.target.value)}
          placeholder="Type your question here..."
          rows={4}
          className="nodrag"
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(110,231,247,0.15)",
            borderRadius: "12px",
            color: "#E2E8F0",
            padding: "12px 14px",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            resize: "none",
            outline: "none",
            boxSizing: "border-box",
            lineHeight: 1.6,
            transition: "border-color 0.2s",
          }}
          onFocus={(e) =>
            (e.target.style.borderColor = "rgba(110,231,247,0.5)")
          }
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(110,231,247,0.15)")
          }
        />
        {/* char count */}
        <span
          style={{
            position: "absolute",
            bottom: "10px",
            right: "12px",
            fontSize: "10px",
            color: "#475569",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {data.prompt.length}
        </span>
      </div>

      {/* Send Button */}
      <button
        onClick={data.onSend}
        disabled={data.loading || !data.prompt.trim()}
        className="nodrag"
        style={{
          marginTop: "14px",
          width: "100%",
          padding: "11px",
          borderRadius: "12px",
          border: "none",
          cursor:
            data.loading || !data.prompt.trim() ? "not-allowed" : "pointer",
          background:
            data.loading || !data.prompt.trim()
              ? "rgba(110,231,247,0.08)"
              : "linear-gradient(135deg, #6EE7F7, #818CF8)",
          color: data.loading || !data.prompt.trim() ? "#475569" : "#0f1729",
          fontWeight: 700,
          fontSize: "13px",
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: "0.03em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          transition: "all 0.2s",
          boxShadow:
            data.loading || !data.prompt.trim()
              ? "none"
              : "0 0 20px rgba(110,231,247,0.3)",
        }}
      >
        {data.loading ? (
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ animation: "spin 1s linear infinite" }}
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Processing...
          </>
        ) : (
          <>
            Send to AI
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </>
        )}
      </button>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 12,
          height: 12,
          background: "#6EE7F7",
          border: "2px solid #0f1729",
          boxShadow: "0 0 8px #6EE7F7",
          right: -6,
        }}
      />
    </div>
  );
}

function ResponseNode({ data }) {
  return (
    <div
      style={{
        width: 380,
        background: "linear-gradient(135deg, #0f1729 0%, #1a0d2e 100%)",
        border: "1px solid rgba(167,139,250,0.25)",
        borderRadius: "20px",
        padding: "24px",
        boxShadow:
          "0 0 40px rgba(167,139,250,0.08), inset 0 1px 0 rgba(255,255,255,0.05)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 12,
          height: 12,
          background: "#A78BFA",
          border: "2px solid #0f1729",
          boxShadow: "0 0 8px #A78BFA",
          left: -6,
        }}
      />

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #A78BFA, #EC4899)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 16px rgba(167,139,250,0.4)",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0f1729"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </div>
        <div>
          <div
            style={{
              color: "#E2E8F0",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "0.02em",
            }}
          >
            Beckend Response
          </div>
          <div
            style={{
              color: "#64748B",
              fontSize: "11px",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            OUTPUT
          </div>
        </div>
        {data.model && (
          <div style={{ marginLeft: "auto" }}>
            <span
              style={{
                background: "rgba(167,139,250,0.12)",
                border: "1px solid rgba(167,139,250,0.3)",
                color: "#A78BFA",
                fontSize: "10px",
                padding: "3px 8px",
                borderRadius: "99px",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {data.model.split("/")[1]?.replace(":free", "") || data.model}
            </span>
          </div>
        )}
      </div>

      {/* Content area */}
      <div
        style={{
          minHeight: 140,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(167,139,250,0.12)",
          borderRadius: "12px",
          padding: "14px",
          fontSize: "13px",
          lineHeight: 1.7,
          color: data.response ? "#CBD5E1" : "#334155",
          fontFamily: data.response
            ? "'DM Sans', sans-serif"
            : "'DM Mono', monospace",
          position: "relative",
          overflowY: "auto",
          maxHeight: 260,
        }}
      >
        {data.loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              paddingTop: "6px",
            }}
          >
            {[100, 85, 70, 45].map((w, i) => (
              <div
                key={i}
                style={{
                  height: 10,
                  borderRadius: 6,
                  background: "rgba(167,139,250,0.15)",
                  width: `${w}%`,
                  animation: `pulse 1.5s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        ) : data.error ? (
          <div
            style={{
              display: "flex",
              gap: "10px",
              color: "#F87171",
              alignItems: "flex-start",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ marginTop: 2, flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{data.error}</span>
          </div>
        ) : data.response ? (
          <span style={{ whiteSpace: "pre-wrap" }}>{data.response}</span>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: 110,
              gap: 10,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(167,139,250,0.08)",
                border: "1px dashed rgba(167,139,250,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4B5563"
                strokeWidth="1.5"
              >
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span>Awaiting your question...</span>
          </div>
        )}
      </div>

      {/* Footer stats */}
      {data.response && (
        <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
          {[
            {
              label: "WORDS",
              value: data.response.split(/\s+/).filter(Boolean).length,
            },
            { label: "CHARS", value: data.response.length },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                flex: 1,
                background: "rgba(167,139,250,0.06)",
                border: "1px solid rgba(167,139,250,0.1)",
                borderRadius: "8px",
                padding: "8px 12px",
                textAlign: "center",
              }}
            >
              <div
                style={{ color: "#A78BFA", fontSize: "16px", fontWeight: 700 }}
              >
                {value}
              </div>
              <div
                style={{
                  color: "#475569",
                  fontSize: "9px",
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.08em",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const nodeTypes = { inputNode: InputNode, responseNode: ResponseNode };
const edgeTypes = { animatedEdge: AnimatedEdge };

export default function AIFlowChat() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [model, setModel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  // console.log(prompt,"prompt");

  const handleSaveConvo = async () => {
    if (!prompt.trim() || !response.trim) return;
    try {
      const res = await fetch(`${BASEURL}/savechats`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt, reply: response }),
      });
      const data = await res?.json();

      console.log(data, "data of the save api");

      if (data.error) throw new Error(data.error);
    } catch (error) {
      console.error("error while saving conversation", error);
    }
  };

  const handleSend = useCallback(async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setResponse("");
    setError("");
    setModel("");
    try {
      const res = await fetch(`${BASEURL}/ask-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResponse(data.reply);
      setModel(data.model || "");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [prompt, loading]);

  const initialNodes = [
    {
      id: "input",
      type: "inputNode",
      position: { x: 60, y: 120 },
      data: { prompt, onChange: setPrompt, onSend: handleSend, loading },
    },
    {
      id: "response",
      type: "responseNode",
      position: { x: 500, y: 80 },
      data: { response, model, loading, error },
    },
  ];

  const initialEdges = [
    {
      id: "e1",
      source: "input",
      target: "response",
      type: "animatedEdge",
      data: {
        animated: loading,
        label: loading ? "streaming..." : response ? "received" : "waiting",
      },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state into node data
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === "input")
          return {
            ...n,
            data: {
              ...n.data,
              prompt,
              onChange: setPrompt,
              onSend: handleSend,
              loading,
            },
          };
        if (n.id === "response")
          return { ...n, data: { ...n.data, response, model, loading, error } };
        return n;
      }),
    );
    setEdges((eds) =>
      eds.map((e) => ({
        ...e,
        data: {
          animated: loading,
          label: loading ? "streaming..." : response ? "received" : "waiting",
        },
      })),
    );
  }, [prompt, response, model, loading, error, handleSend]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.9; } }
        .react-flow__background { background: #080d1a !important; }
        .react-flow__attribution { display: none; }
        .react-flow__controls button {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          color: #64748B !important;
        }
        .react-flow__controls button:hover { background: rgba(110,231,247,0.1) !important; }
      `}</style>

      {/* Title bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(8,13,26,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: "linear-gradient(135deg, #6EE7F7, #818CF8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0f1729"
            strokeWidth="2.5"
          >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <div>
          <div style={{ color: "#E2E8F0", fontWeight: 700, fontSize: "15px" }}>
            FUTURE BLINK
          </div>
          <div
            style={{
              color: "#475569",
              fontSize: "11px",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            CHATBOT · ai-powered
          </div>
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: loading
                ? "#FBBF24"
                : response
                  ? "#34D399"
                  : "#475569",
              boxShadow: loading
                ? "0 0 6px #FBBF24"
                : response
                  ? "0 0 6px #34D399"
                  : "none",
              transition: "all 0.3s",
            }}
          />
          <span
            style={{
              color: "#64748B",
              fontSize: "11px",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {loading ? "processing" : response ? "ready" : "idle"}
          </span>
        </div>
      </div>

      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#080d1a",
          position: "relative",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          proOptions={{ hideAttribution: true }}
          style={{ paddingTop: 64 }}
        >
          {/* Grid background */}
          <svg style={{ position: "absolute", width: 0, height: 0 }}>
            <defs>
              <pattern
                id="grid"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 32 0 L 0 0 0 32"
                  fill="none"
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
          </svg>
        </ReactFlow>
        <button
          onClick={handleSaveConvo}
          // disabled={data.loading || !data.prompt.trim()}
          className="nodrag "
          style={{
            marginTop: "50px",
            // width: "150px",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            margin: "auto",
            background:
              //  data.loading || !data.prompt.trim()
              //   ? "rgba(110,231,247,0.08)"
              //   :
              "linear-gradient(135deg, #6EE7F7, #818CF8)",
            color:
              // data.loading || !data.prompt.trim() ? "#475569" :
              "#0f1729",
            fontWeight: 700,
            position: "absolute",
            right: "0px",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.03em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s",
            boxShadow:
              // data.loading || !data.prompt.trim() ? "none" :
              "0 0 20px rgba(110,231,247,0.3)",
            bottom: "80px", // 👈 add this
            right: "10%", // 👈 better spacing
            zIndex: 1000, // 👈 VERY important
            pointerEvents: "all",
          }}
        >
          <>
            Save This Conversation
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          </>
        </button>
         <button
          onClick={()=>naviagate("/")}
          className="nodrag "
          style={{
            marginTop: "50px",
            // width: "150px",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            cursor: "pointer",
            margin: "auto",
            background:
              "linear-gradient(135deg, #6EE7F7, #818CF8)",
            color:
              "#0f1729",
            fontWeight: 700,
            position: "absolute",
            right: "0px",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.03em",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "all 0.2s",
            boxShadow:
              // data.loading || !data.prompt.trim() ? "none" :
              "0 0 20px rgba(110,231,247,0.3)",
            bottom: "80px", 
            right: "10%", 
            zIndex: 1000,
            pointerEvents: "all",
          }}
        >
          <>
           Visit All Chats
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          </>
        </button>
      </div>
    </>
  );
}
