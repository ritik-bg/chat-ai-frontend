import { useEffect, useMemo, useState } from "react";
import "./index.css";
import { BASEURL } from "../../config/api.config";
import { useLocation, useNavigate } from "react-router";

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

export default function PreviewChat({ selected, setSelected }) {
  const [chat, setChat] = useState("");
  const [prevousChats, setprevousChats] = useState([]);
  const tags = ["all", "code", "science", "creative", "history"];
  const naviagate = useNavigate();
const { state } = useLocation();


const getchats = async () => {
    try {
      const res = await fetch(`${BASEURL}/getchats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      console.log("response of save chats", data);
      console.log(data?.data, "data?.data");
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


  useEffect(() => {
    setChat(state?.chat)
  }, [state?.chat])
  

  return (
    <>
      <div className="chat-page">
        <div className="content">
          {/* Header */}
          <div className="header">
            <div className="header-top">
              <div>
                <div style={{cursor:"pointer"}}  onClick={()=>naviagate(-1)} className="header-badge cursor-pointer">
                  <span  className="header-badge-dot" />
                  Back
                </div>
                <h1><span>{chat?.prompt}</span></h1>
              </div>
            </div>

            <div className="chat-body chat-preview">
              <span className="chat-title text-wrap overflow-wrap ">
                {chat?.reply}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
