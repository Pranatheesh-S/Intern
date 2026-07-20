import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Pin, PinOff, CheckCircle2, RotateCcw, Play } from "lucide-react";
import VirtualBiodiversityExplorerActivity from "../activities/VirtualBiodiversityExplorer";
import AppreciatingBiodiversityActivity from "../activities/AppreciatingBiodiversityActivity";
import InlineSortingActivity from "../activities/InlineSortingActivity";
import PlantDetectiveActivity from "../activities/PlantDetective";
import LeafVenationLab from "../activities/LeafVenationLab";
import RootSystemsLab from "../activities/RootSystemsLab";
import VenationRootCorrelationLab from "../activities/VenationRootCorrelationLab";
import SeedDissectionLab from "../activities/SeedDissectionLab";
import AnimalHabitatExplorerActivity from "../activities/AnimalHabitatExplorer";
import { useTheme } from "../ThemeContext";

export default function LabWorkspace({
  classNum,
  chapterNum,
  chapterTitle,
  activities,
  onExit,
}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [currentIdx, setCurrentIdx] = useState(0);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  
  // Track completion status for each activity: 'none', 'opened', 'done'
  const [activityStatus, setActivityStatus] = useState(() => {
    const initial = {};
    activities.forEach((act, index) => {
      initial[index] = index === 0 ? "opened" : "none";
    });
    return initial;
  });

  const iframeRef = useRef(null);
  const viewerContainerRef = useRef(null);

  const activeActivity = activities[currentIdx];
  const totalActivities = activities.length;

  // Calculate mastery details
  const doneCount = Object.values(activityStatus).filter(status => status === "done").length;
  const progressPercent = Math.round((doneCount / totalActivities) * 100);

  // Sync completion stats when standard page signals event
  useEffect(() => {
    const handleMessage = (e) => {
      const d = e.data;
      if (d && d.type === "futurax:quizComplete") {
        markActivityDone(currentIdx);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [currentIdx]);

  // Synchronize bridge events inside iframe content window (same origin fallback)
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      try {
        const win = iframe.contentWindow;
        win.addEventListener("futurax:advance", () => {
          setActivityStatus(prev => {
            if (prev[currentIdx] === "none") {
              return { ...prev, [currentIdx]: "opened" };
            }
            return prev;
          });
        });

        win.addEventListener("futurax:quizComplete", (e) => {
          markActivityDone(currentIdx);
        });
      } catch (err) {
        console.warn("Cross-origin or iframe frame block prevented same-origin event listening. Using manual controls.");
      }
    };

    iframe.addEventListener("load", handleLoad);
    return () => {
      if (iframe) iframe.removeEventListener("load", handleLoad);
    };
  }, [currentIdx]);

  const markActivityDone = (idx) => {
    setActivityStatus(prev => ({ ...prev, [idx]: "done" }));
  };

  const toggleActivityDone = () => {
    setActivityStatus(prev => {
      const currentStatus = prev[currentIdx];
      const nextStatus = currentStatus === "done" ? "opened" : "done";
      return { ...prev, [currentIdx]: nextStatus };
    });
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      viewerContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentIdx < totalActivities - 1) {
      setCurrentIdx(currentIdx + 1);
      viewerContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const selectActivity = (idx) => {
    setCurrentIdx(idx);
    setActivityStatus(prev => {
      if (prev[idx] === "none") {
        return { ...prev, [idx]: "opened" };
      }
      return prev;
    });
    viewerContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Synchronize dynamic light/dark mode changes into same-origin iframe document root
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const applyIframeTheme = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc) return;
        const root = doc.documentElement;
        if (!root) return;

        root.setAttribute('data-theme', theme);

        if (theme === "light") {
          root.style.setProperty("--bg", "#f8fafc");
          root.style.setProperty("--bg-raised", "#ffffff");
          root.style.setProperty("--bg-card", "#f1f5f9");
          root.style.setProperty("--ink", "#1e293b");
          root.style.setProperty("--ink-dim", "#475569");
          root.style.setProperty("--ink-faint", "#64748b");
          root.style.setProperty("--border-idle", "#cbd5e1");
          
          // Style toolbar override
          const toolbar = doc.querySelector(".toolbar");
          if (toolbar) {
            toolbar.style.backgroundColor = "rgba(248, 250, 252, 0.92)";
            toolbar.style.borderBottom = "1px solid #cbd5e1";
          }
          
          // Style sheet modal override
          const sheets = doc.querySelectorAll(".sheet");
          sheets.forEach(s => {
            s.style.backgroundColor = "#ffffff";
            s.style.borderColor = "#cbd5e1";
          });
        } else {
          // Reset to default dark style variables
          root.style.removeProperty("--bg");
          root.style.removeProperty("--bg-raised");
          root.style.removeProperty("--bg-card");
          root.style.removeProperty("--ink");
          root.style.removeProperty("--ink-dim");
          root.style.removeProperty("--ink-faint");
          root.style.removeProperty("--border-idle");

          const toolbar = doc.querySelector(".toolbar");
          if (toolbar) {
            toolbar.style.backgroundColor = "";
            toolbar.style.borderBottom = "";
          }

          const sheets = doc.querySelectorAll(".sheet");
          sheets.forEach(s => {
            s.style.backgroundColor = "";
            s.style.borderColor = "";
          });
        }
      } catch (err) {
        console.warn("Theme sync failed: ", err);
      }
    };

    applyIframeTheme();
    iframe.addEventListener("load", applyIframeTheme);
    return () => {
      if (iframe) iframe.removeEventListener("load", applyIframeTheme);
    };
  }, [theme, currentIdx]);

  // Map each activityId to its corresponding custom React activity component
  const renderCustomSandbox = () => {
    const actId = activeActivity.activityId;
    if (!actId) return null;

    // Standard no-op dashboard router mock
    const dummyRouterBack = () => {
      markActivityDone(currentIdx);
    };

    switch (actId) {
      case "virtual_biodiversity":
        return <VirtualBiodiversityExplorerActivity onBackToDashboard={dummyRouterBack} />;
      case "appreciating_biodiversity":
        return <AppreciatingBiodiversityActivity onBackToDashboard={dummyRouterBack} />;
      case "inline_sorting":
        return <InlineSortingActivity onBackToDashboard={dummyRouterBack} />;
      case "plant_detective_stem":
        return <PlantDetectiveActivity onBackToDashboard={dummyRouterBack} />;
      case "leaf_venation_lab":
        return <LeafVenationLab onBackToDashboard={dummyRouterBack} />;
      case "root_systems_lab":
        return <RootSystemsLab onBackToDashboard={dummyRouterBack} />;
      case "venation_root_correlation":
        return <VenationRootCorrelationLab onBackToDashboard={dummyRouterBack} />;
      case "seed_dissection_lab":
        return <SeedDissectionLab onBackToDashboard={dummyRouterBack} />;
      case "animal_locomotion":
        return <AnimalHabitatExplorerActivity key="animal_locomotion" onBackToDashboard={dummyRouterBack} initialPhase={3} />;
      case "animal_habitat_matching":
        return <AnimalHabitatExplorerActivity key="animal_habitat_matching" onBackToDashboard={dummyRouterBack} initialPhase={1} />;
      default:
        return null;
    }
  };

  // Group activities by section header
  const getSections = () => {
    const sections = [];
    let currentSec = null;
    
    activities.forEach((act, index) => {
      if (!currentSec || currentSec.header !== act.sectionHeader) {
        currentSec = {
          header: act.sectionHeader,
          items: []
        };
        sections.push(currentSec);
      }
      currentSec.items.push({ ...act, index });
    });
    return sections;
  };

  const sections = getSections();

  return (
    <div style={{
      display: "flex",
      width: "100%",
      minHeight: "100vh",
      overflow: "hidden",
      background: "var(--lab-bg)",
      color: "var(--lab-text)",
      fontFamily: 'system-ui, -apple-system, sans-serif',
      "--lab-bg": isDark ? "#0b1020" : "#f8fafc",
      "--lab-text": isDark ? "#e8ebff" : "#1e293b",
      "--sidebar-bg": isDark ? "linear-gradient(180deg, rgba(20, 32, 58, 0.96), rgba(7, 13, 27, 0.98))" : "linear-gradient(180deg, #ffffff, #f1f5f9)",
      "--sidebar-border": isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
      "--sidebar-shadow": isDark ? "inset -2px 0 18px rgba(255,255,255,0.03)" : "inset -2px 0 20px rgba(15, 23, 42, 0.06)",
      "--item-bg": isDark ? "rgba(255,255,255,0.05)" : "#ffffff",
      "--item-border": isDark ? "rgba(255,255,255,0.12)" : "#e2e8f0",
      "--item-hover-bg": isDark ? "rgba(79,70,229,0.14)" : "rgba(79,70,229,0.12)",
      "--item-hover-border": isDark ? "rgba(79,70,229,0.4)" : "rgba(79,70,229,0.35)",
      "--item-active-bg": "rgba(79,70,229,0.16)",
      "--item-active-border": "rgba(79,70,229,0.65)",
      "--item-done-bg": "rgba(61,214,195,0.12)",
      "--item-text-muted": isDark ? "#9aa3c7" : "#64748b",
      "--section-color": isDark ? "#3dd6c3" : "#0d9488",
      "--node-bg": isDark ? "radial-gradient(circle at top left, rgba(61,214,195,0.24), rgba(40,115,189,0.22) 45%, rgba(9,28,55,1) 120%)" : "radial-gradient(circle at top left, rgba(99,102,241,0.16), rgba(148,163,184,0.18) 45%, rgba(255,255,255,1) 120%)",
      "--node-text": isDark ? "#eaf4ff" : "#111827",
      "--header-bg": isDark ? "rgba(8, 14, 30, 0.9)" : "rgba(255,255,255,0.88)",
      "--header-border": isDark ? "rgba(255,255,255,0.08)" : "rgba(226,232,240,0.8)",
      "--tooltip-bg": isDark ? "rgba(15, 23, 42, 0.92)" : "#ffffff",
      "--tooltip-border": isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0",
      "--tooltip-color": isDark ? "#eaf4ff" : "#111827",
      "--tooltip-shadow": isDark ? "0 4px 12px rgba(0,0,0,0.2)" : "0 8px 22px rgba(15,23,42,0.12)",
      "--sandbox-sep-bg": isDark ? "radial-gradient(circle at center, #1b254b 0%, #0b1020 100%)" : "radial-gradient(circle at center, #e2e8f0 0%, #f8fafc 100%)",
      "--sandbox-sep-border": isDark ? "#232b4d" : "#cbd5e1"
    }}>
      <style>{`
        /* Sidebar layout styling */
        .workspace-sidebar {
          background: var(--sidebar-bg);
          border-right: 1px solid var(--sidebar-border);
          box-shadow: var(--sidebar-shadow);
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 50;
          transition: width 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
          overflow: hidden;
          height: 100%;
          padding: 22px 0;
          backdrop-filter: blur(18px);
        }
        .workspace-sidebar *, .workspace-sidebar {
          scrollbar-width: none;
        }
        .workspace-sidebar *::-webkit-scrollbar, .workspace-sidebar::-webkit-scrollbar {
          display: none;
        }
        
        /* Candy Crush Level Node Map center connector path */
        .dot-thread {
          display: none;
        }

        .dot-path-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          padding: 28px 0;
          z-index: 5;
          position: relative;
          overflow-y: auto;
          flex: 1;
          width: 100%;
        }

        .level-circle-node {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s, border-color 0.2s, box-shadow 0.2s;
          border: 2px solid rgba(255,255,255,0.15);
          background: var(--node-bg);
          color: var(--node-text);
          position: relative;
          z-index: 10;
          flex-shrink: 0;
          transform: translateX(var(--zigzag-x, 0px));
          box-shadow: 0 18px 40px rgba(0,0,0,0.18);
        }

        .level-circle-node:hover {
          transform: translateX(var(--zigzag-x, 0px)) scale(1.15);
          box-shadow: 0 0 12px rgba(139, 124, 246, 0.5);
        }

        .level-circle-node.active {
          border-color: #8b7cf6;
          background: #8b7cf6;
          color: #ffffff;
          box-shadow: 0 0 14px rgba(139, 124, 246, 0.7);
        }

        .level-circle-node.opened {
          border-color: #f5b74e;
          background: rgba(245, 183, 78, 0.25);
          color: #f5b74e;
        }

        .level-circle-node.done {
          border-color: #3dd6c3;
          background: #3dd6c3;
          color: var(--dot-done-text);
        }

        /* Tooltip styling for collapsed state nodes */
        .node-tooltip {
          position: absolute;
          left: 54px;
          background: var(--tooltip-bg);
          border: 1px solid var(--tooltip-border);
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--tooltip-color);
          white-space: nowrap;
          box-shadow: var(--tooltip-shadow);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s;
          z-index: 100;
        }
        .level-circle-node:hover .node-tooltip {
          opacity: 1;
        }

        /* Expanded TOC Styling */
        .sidebar-expanded-content {
          display: flex;
          flex-direction: column;
          width: 340px;
          height: 100%;
          flex-shrink: 0;
          opacity: 0;
          animation: fadeIn 0.2s forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }

        .toc-list-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--item-bg);
          border: 1px solid var(--item-border);
          border-radius: 16px;
          padding: 12px 14px;
          margin: 6px 14px;
          cursor: pointer;
          transition: transform 0.2s, border-color 0.2s, background 0.2s, box-shadow 0.2s;
          user-select: none;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.02);
        }
        .toc-list-item:hover {
          background: var(--item-hover-bg);
          border-color: var(--item-hover-border);
          transform: translateX(4px);
          box-shadow: 0 20px 40px rgba(30,41,59,0.12);
        }
        .toc-list-item.active {
          border-color: var(--item-active-border);
          background: var(--item-active-bg);
          box-shadow: 0 24px 60px rgba(49,47,129,0.16);
          transform: translateX(4px);
        }
        .toc-list-item.done {
          border-color: rgba(61,214,195,0.68);
          background: var(--item-done-bg);
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: 2px solid var(--item-text-muted);
          background: transparent;
          flex-shrink: 0;
        }
        .status-dot.opened {
          border-color: #f5b74e;
          background: rgba(245,183,78,0.35);
        }
        .status-dot.done {
          border-color: #3dd6c3;
          background: #3dd6c3;
        }

        /* Mastery Progress Ring */
        .progress-ring {
          position: relative;
          width: 56px;
          height: 56px;
        }
        .progress-ring svg {
          transform: rotate(-90deg);
        }

        /* Sandbox Separator Banner */
        .sandbox-separator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 2rem 1.5rem;
          background: var(--sandbox-sep-bg);
          border-top: 2px dashed var(--sandbox-sep-border);
          border-bottom: 2px dashed var(--sandbox-sep-border);
          margin: 3rem 0;
        }
        
        .sandbox-separator h3 {
          font-family: Georgia, serif;
          font-weight: 700;
          font-size: 1.35rem;
          color: #3dd6c3;
          margin: 0;
          letter-spacing: 0.05em;
        }
      `}</style>

      {/* LEFT SIDEBAR (Hover-Expandable, Click-Pinnable) */}
      <nav 
        className="workspace-sidebar" 
        style={{ width: (sidebarExpanded || sidebarPinned) ? "340px" : "68px" }}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        {/* Top Control Bar */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: (sidebarExpanded || sidebarPinned) ? "space-between" : "center", 
          padding: "16px 14px", 
          borderBottom: "1.5px solid var(--sidebar-border)", 
          height: "64px",
          flexShrink: 0
        }}>
          {(sidebarExpanded || sidebarPinned) ? (
            <>
              <button 
                onClick={onExit} 
                className="outline" 
                style={{ fontSize: "0.8rem", padding: "4px 10px", display: "inline-flex", alignItems: "center", gap: "4px" }}
              >
                <ArrowLeft size={12} /> Exit Lab
              </button>
              <button 
                onClick={() => setSidebarPinned(!sidebarPinned)} 
                className="outline" 
                style={{ padding: "4px", display: "inline-flex", color: sidebarPinned ? "var(--section-color)" : "var(--item-text-muted)" }}
                title={sidebarPinned ? "Unpin Sidebar" : "Pin Sidebar"}
              >
                {sidebarPinned ? <PinOff size={14} /> : <Pin size={14} />}
              </button>
            </>
          ) : (
            <button onClick={onExit} className="outline" style={{ padding: "6px", display: "flex" }} title="Exit Lab">
              <ArrowLeft size={16} />
            </button>
          )}
        </div>

        {/* INNER TOC CONTENT */}
        {(sidebarExpanded || sidebarPinned) ? (
          <div className="sidebar-expanded-content" style={{ flex: 1, overflowY: "auto", padding: "12px 0 30px 0" }}>
            {sections.map((sec, sIdx) => (
              <div key={sIdx} style={{ marginBottom: "14px" }}>
                <div style={{
                  fontSize: "11px",
                  fontWeight: "800",
                  letterSpacing: "0.04em",
                  color: "#3dd6c3",
                  textTransform: "uppercase",
                  padding: "4px 18px",
                  marginBottom: "4px",
                  borderLeft: "3px solid #3dd6c3"
                }}>
                  {sec.header}
                </div>
                {sec.items.map((item) => (
                  <div 
                    key={item.index} 
                    className={`toc-list-item ${currentIdx === item.index ? "active" : ""} ${activityStatus[item.index] === "done" ? "done" : ""}`}
                    onClick={() => selectActivity(item.index)}
                  >
                    <span style={{ fontSize: "18px", flexShrink: 0 }}>{item.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "12.5px", fontWeight: "700", lineHeight: "1.2", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: "10.5px", color: "var(--item-text-muted)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.desc}
                      </div>
                    </div>
                    <span style={{ fontSize: "10px", color: "var(--item-text-muted)", flexShrink: 0 }}>{item.pg}</span>
                    <span className={`status-dot ${activityStatus[item.index]}`} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* COLLAPSED NODE MAP */
          <div style={{ flex: 1, position: "relative", overflowX: "hidden", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            {/* Dynamic Candy Crush winding road connecting path */}
            <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: `${activities.length * 66 + 48}px`, pointerEvents: "none", zIndex: 1 }}>
              <path 
                d={activities.map((act, index) => {
                  const zigzagX = index % 3 === 1 ? -12 : index % 3 === 2 ? 12 : 0;
                  const x = 34 + zigzagX;
                  const y = 24 + index * 66 + 19;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                fill="none"
                stroke="#8b7cf6"
                strokeWidth="2.5"
                strokeDasharray="5 5"
                strokeOpacity="0.5"
              />
            </svg>
            <div className="dot-path-container">
              {activities.map((act, index) => {
                const status = activityStatus[index];
                const zigzagX = index % 3 === 1 ? -12 : index % 3 === 2 ? 12 : 0;
                return (
                  <div 
                    key={index} 
                    className={`level-circle-node ${currentIdx === index ? "active" : ""} ${status}`}
                    onClick={() => selectActivity(index)}
                    style={{ "--zigzag-x": `${zigzagX}px` }}
                  >
                    {act.icon}
                    <div className="node-tooltip">
                      {act.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* RIGHT VIEWER AND CONTENT AREA */}
      <div 
        ref={viewerContainerRef}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          height: "100%",
          position: "relative"
        }}
      >
        {/* HEADER VIEWER BAR */}
        <header style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          background: "var(--header-bg)",
          borderBottom: "1px solid var(--header-border)",
          position: "sticky",
          top: 0,
          zIndex: 40,
          backdropFilter: "blur(20px)",
          boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.04)"
        }}>
          <div style={{ flex: 1, minWidth: 0, marginRight: "16px" }}>
            <div style={{ fontSize: "10.5px", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--section-color)", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Chapter {chapterNum} — {chapterTitle}
            </div>
            <h2 style={{ fontSize: "15px", fontWeight: "800", marginTop: "2px", display: "flex", alignItems: "center", gap: "6px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeActivity.title}</span>
              <span style={{ fontSize: "11px", color: "var(--item-text-muted)", fontWeight: "normal", flexShrink: 0 }}>({activeActivity.pg})</span>
            </h2>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button 
              className="outline" 
              onClick={handlePrev} 
              disabled={currentIdx === 0} 
              style={{ padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--item-text-muted)" }}
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <button 
              className="outline" 
              onClick={handleNext} 
              disabled={currentIdx === totalActivities - 1}
              style={{ padding: "6px 12px", display: "inline-flex", alignItems: "center", gap: "4px", color: "var(--item-text-muted)" }}
            >
              Next <ChevronRight size={14} />
            </button>
            <button 
              onClick={toggleActivityDone}
              className={activityStatus[currentIdx] === "done" ? "outline done" : "outline"}
              style={{ 
                padding: "6px 14px", 
                fontWeight: "700", 
                borderColor: activityStatus[currentIdx] === "done" ? "var(--success)" : "var(--item-border)",
                color: activityStatus[currentIdx] === "done" ? "var(--success)" : "var(--item-text-muted)",
                background: activityStatus[currentIdx] === "done" ? "rgba(52, 211, 153, 0.12)" : "transparent"
              }}
            >
              {activityStatus[currentIdx] === "done" ? "✓ Done" : "Mark done"}
            </button>

            {/* Mastery ring stats */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "8px" }}>
              <div className="progress-ring">
                <svg width="56" height="56" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="23" fill="none" stroke="var(--item-border)" strokeWidth="5"></circle>
                  <circle 
                    cx="28" 
                    cy="28" 
                    r="23" 
                    fill="none" 
                    stroke="var(--section-color)" 
                    strokeWidth="5" 
                    strokeLinecap="round" 
                    strokeDasharray={144.5} 
                    strokeDashoffset={144.5 - (144.5 * progressPercent) / 100}
                    style={{ transition: "stroke-dashoffset 0.4s" }}
                  ></circle>
                </svg>
                <div style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  <span style={{ fontSize: "12px", fontWeight: "900", color: "var(--section-color)" }}>{progressPercent}%</span>
                  <span style={{ fontSize: "7px", color: "var(--item-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>mastery</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <b style={{ fontSize: "16px", color: "var(--section-color)" }}>{doneCount}</b>
                <span style={{ fontSize: "9px", color: "var(--item-text-muted)", textTransform: "uppercase" }}>of {totalActivities} done</span>
              </div>
            </div>
          </div>
        </header>

        {/* CORE WORKSPACE IFRAME AND SANDBOX */}
        <div style={{ display: "flex", flexDirection: "column", width: "100%", flex: 1 }}>
          <iframe 
            ref={iframeRef}
            src={activeActivity.path}
            title={activeActivity.title}
            style={{
              width: "100%",
              flex: 1,
              minHeight: "calc(100vh - 88px)",
              height: "calc(100vh - 88px)",
              border: "none",
              background: "var(--lab-bg)"
            }}
          />

          {/* RENDER THE NATIVE REACT SANDBOX BELOW THE IFRAME */}
          {activeActivity.activityId && renderCustomSandbox() && (
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              <div className="sandbox-separator">
                    <Play size={20} className="text-teal" style={{ color: "var(--section-color)" }} />
                    <h3>⚡ Interactive Sandbox Lab</h3>
                    <span style={{ fontSize: "11px", color: "var(--item-text-muted)", fontWeight: "bold" }}>Scroll down to play with our custom simulation!</span>
              </div>
              <div style={{ width: "100%", padding: "0 1.5rem 3rem 1.5rem", boxSizing: "border-box" }}>
                {renderCustomSandbox()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
