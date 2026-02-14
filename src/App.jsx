import { useRef, useState } from "react";
import "./App.css";
import BackgroundParticles from "./BackgroundParticles";

const INVITE = {
  showTitle: "Blossom",
  when: "Feb 15, 7:00 PM",
  where: "El Corazon!",
};

export default function App() {
  const [step, setStep] = useState("ask"); // "ask" | "yes"

  // --- Runaway No button ---
  const noBtnRef = useRef(null);
  const swallowClickRef = useRef(false);
  const [noIsFloating, setNoIsFloating] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });     // viewport coords
  const [noSize, setNoSize] = useState({ w: 0, h: 0 });   // lock size when floating
  const lastPosRef = useRef({ x: 0, y: 0 });


  function pickFarPosition(btnRect) {
    const pad = 12;
    const maxX = Math.max(pad, window.innerWidth - btnRect.width - pad);
    const maxY = Math.max(pad, window.innerHeight - btnRect.height - pad);

    let x = pad + Math.random() * (maxX - pad);
    let y = pad + Math.random() * (maxY - pad);

    // Try to make it jump FAR away (more dramatic)
    const last = lastPosRef.current;
    for (let i = 0; i < 8; i++) {
      const dist = Math.hypot(x - last.x, y - last.y);
      if (dist < 260) {
        x = pad + Math.random() * (maxX - pad);
        y = pad + Math.random() * (maxY - pad);
      } else break;
    }

    return { x, y };
  }

  function activateAndRunAway(e) {
    e.preventDefault();
  e.stopPropagation();

  // Tell the app to swallow the very next click (prevents click-through to Yes)
  swallowClickRef.current = true;

  // Capture the pointer so pointerup/click stay "owned" by this button
  try {
    e.currentTarget.setPointerCapture(e.pointerId);
  } catch {}

  const btn = noBtnRef.current;
  if (!btn) return;

  if (!noIsFloating) {
    const r = btn.getBoundingClientRect();
    setNoPos({ x: r.left, y: r.top });
    setNoSize({ w: r.width, h: r.height });
    lastPosRef.current = { x: r.left, y: r.top };
    setNoIsFloating(true);

    requestAnimationFrame(() => {
      const r2 = btn.getBoundingClientRect();
      const next = pickFarPosition(r2);
      lastPosRef.current = next;
      setNoPos(next);
    });

    return;
  }

  const r = btn.getBoundingClientRect();
  const next = pickFarPosition(r);
  lastPosRef.current = next;
  setNoPos(next);
  }
  
  return (
    <div className="page">
      <BackgroundParticles />

      <main className="card">
        {step === "ask" && (
          <>
            <p className="badge">💌 Madelyn!</p>
            <h1 className="title">Would you let me take you out?</h1>

            <p className="subtitle">
              Since you are so awesome, cool, smart, hot, sexy, thoughtful, kind, full of ADHD
            </p>

            {/* On arrival: both buttons are normal, aligned in the card */}
            <div className="buttonRow">
              <button className="btn primary" onClick={() => setStep("yes")}>
                Yes 💖
              </button>

              <button
                ref={noBtnRef}
                className={`btn ghost noBtn ${noIsFloating ? "floating" : ""}`}
                onPointerDown={activateAndRunAway}
                onClick={(e) => {
                  // Swallow the click that could otherwise land on "Yes"
                  if (swallowClickRef.current) {
                    e.preventDefault();
                    e.stopPropagation();
                    swallowClickRef.current = false;
                  }
                }}
                onPointerEnter={noIsFloating ? activateAndRunAway : undefined} // IMPORTANT
                onFocus={noIsFloating ? activateAndRunAway : undefined}        // IMPORTANT
                style={
                  noIsFloating
                    ? {
                        position: "fixed",
                        left: noPos.x,
                        top: noPos.y,
                        width: noSize.w,
                        height: noSize.h,
                        zIndex: 9999,
                        transition: "left 160ms ease, top 160ms ease",
                      }
                    : undefined
                }
              >
                No 😭
              </button>
            </div>

            
          </>
        )}

        {step === "yes" && (
          <>
            <h1 className="title">YAYYY 💖</h1>
            <p className="subtitle">
              Glad you're here! We are watching <strong>{INVITE.showTitle}</strong> on{" "}
              <strong>{INVITE.when}</strong>
              {INVITE.where ? (
                <>
                  {" "}
                  at <strong>{INVITE.where}</strong>
                </>
              ) : (
                "."
              )}
            </p>

            <div className="buttonRow">
              <button className="btn primary" onClick={() => setStep("details")}>
                Details
              </button>
              <button className="btn ghost" onClick={() => setStep("ask")}>
                Back
              </button>
            </div>
          </>
        )}

{step === "details" && (
  <>
    <p className="badge">📍 Details</p>
    <h1 className="title">Here’s the plan 🚗💨</h1>

    <p className="subtitle">
      <strong>I pick you up time TBD</strong>
      <br />
      <strong>Dress Code: grunge, rock, punk</strong>
      <strong> Ananay will wear leather jacket </strong>
         
       
    </p>

    <p className="subtitle" style={{ marginTop: 10 }}>
      Reach out if any questions!
    </p>

    <div className="buttonRow" style={{ marginTop: 14 }}>
      
      <button className="btn ghost" onClick={() => setStep("yes")}>
        Back
      </button>
    </div>

    {/* Car graphic at the bottom */}
    <div className="carScene" aria-hidden="true">
      <div className="road" />
      <div className="car">
        {/* Simple SVG car (no assets needed) */}
        <svg viewBox="0 0 240 90" className="carSvg">
          <rect x="40" y="30" width="140" height="30" rx="12"></rect>
          <rect x="70" y="12" width="80" height="25" rx="10"></rect>
          <circle cx="80" cy="68" r="12"></circle>
          <circle cx="160" cy="68" r="12"></circle>
        </svg>
      </div>
    </div>
  </>
)}

      </main>
    </div>
  );
}
