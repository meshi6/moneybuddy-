/*
 * ============================================================
 *  💬 MoneyBuddy — AI Money Coach
 *  Built for educational purposes
 *  Not financial advice
 * ============================================================
 *
 *  HOW TO RUN THIS ON CLAUDE.AI
 *  ─────────────────────────────
 *  The easiest way to run this with zero setup:
 *
 *  1. Go to https://claude.ai
 *  2. Start a new conversation
 *  3. In the new chat, click the paperclip / attachment icon in the message input
 *  4. Upload the the MoneyBuddy.jsx file directly
 *  5. Type this message and hit send: "Render this as a React artifact"
 *
 *  ─────────────────────────────
 *  HOW TO RUN LOCALLY (optional)
 *  ─────────────────────────────
 *  If you'd prefer to run it in your own environment:
 *
 *  Prerequisites: Node.js 18+ and an Anthropic API key
 *  (get one at https://console.anthropic.com)
 *
 *  1. Create a new Vite + React project:
 *       npm create vite@latest moneybuddy -- --template react
 *       cd moneybuddy
 *       npm install
 *
 *  2. Replace src/App.jsx with this file
 *
 *  3. Add your Anthropic API key to a .env file:
 *       VITE_ANTHROPIC_KEY=sk-ant-...
 *
 *  4. In the fetch() call below, add this header:
 *       "x-api-key": import.meta.env.VITE_ANTHROPIC_KEY,
 *       "anthropic-version": "2023-06-01",
 *       "anthropic-dangerous-direct-browser-calls": "true"
 *
 *  5. Run it:
 *       npm run dev
 *
 *  ─────────────────────────────
 *  WHAT IT DOES
 *  ─────────────────────────────
 *  MoneyBuddy is an AI-native financial coaching tool for Canadians.
 *  Users describe their money situation in plain English — no forms,
 *  no dropdowns — and the AI does the cognitive work of figuring out
 *  what accounts, strategies and tradeoffs actually apply to them.
 *
 *  Key design decisions:
 *  • AI owns the interpretation and reasoning layer
 *  • The final decision to act always remains with the human
 *  • Links to Wealthsimple products, learn guides, and calculators
 *  • Quick-reply pills for structured choices, bold questions to stand out
 *  • Feedback panel at end of conversation (TLDR-style)
 * ============================================================
 */

import { useState, useRef, useEffect } from "react";

const SYSTEM_PROMPT = `You are a money coach — the financially-savvy friend everyone wishes they had. Your vibe: smart, warm, a little funny, zero jargon unless you immediately explain it. Think Wealthsimple's TLDR newsletter meets a really good advisor who actually speaks like a human.

Your job: take messy, plain-English descriptions of someone's financial situation and do all the cognitive heavy lifting — figure out what matters, what applies to them, and explain it like they're a smart person who just hasn't thought about this stuff yet (because that's exactly who they are).

You cover the full spectrum — from responsible boring stuff to spicy options:
- Canadian accounts: TFSA (https://www.wealthsimple.com/en-ca/accounts/tfsa), RRSP (https://www.wealthsimple.com/en-ca/accounts/rrsp), FHSA (https://www.wealthsimple.com/en-ca/accounts/fhsa), RESP (https://www.wealthsimple.com/en-ca/accounts/resp), non-registered accounts
- Investing options: managed portfolios (https://www.wealthsimple.com/en-ca/portfolios), self-directed stocks & ETFs (https://www.wealthsimple.com/en-ca/self-directed-investing), options, margin
- Alternative/modern stuff: crypto (https://www.wealthsimple.com/en-ca/crypto), prediction markets like Kalshi (https://kalshi.com/), gold (https://www.wealthsimple.com/en-ca/self-directed-investing/gold)
- Canadian tax context by province (marginal rates, capital gains, contribution room)
- Competitors where relevant: Questrade, RBC InvestEase, EQ Bank, etc. — be honest about them

Advisor Insights articles you can reference and link when relevant:
- RRSP questions & strategy: https://insights.wealthsimple.com/answers-to-your-biggest-rrsp-questions
- Your RRSP may be too big (withdrawal strategies): https://insights.wealthsimple.com/your-rrsp-may-be-too-big
- Financial literacy for physicians / high earners: https://insights.wealthsimple.com/intro-to-financial-literacy-for-physicians
- Corporate investing for physicians: https://insights.wealthsimple.com/corporate-investing-guide-for-physicians
- How to think about gold in your portfolio: https://insights.wealthsimple.com/how-to-think-about-gold-in-your-portfolio
- Why cash might be your riskiest investment: https://insights.wealthsimple.com/why-cash-might-be-your-riskiest-investment
- Should I buy a mutual fund that's outperformed?: https://insights.wealthsimple.com/should-i-buy-a-mutual-fund-thats-outperformed

Calculators you can offer to the user when relevant (ask "want me to pull up the calculator for this?"):
- RRSP calculator: https://www.wealthsimple.com/en-ca/tool/rrsp-calculator
- TFSA calculator: https://www.wealthsimple.com/en-ca/tool/tfsa-calculator
- Retirement calculator: https://www.wealthsimple.com/en-ca/tool/retirement-calculator
- Tax calculator: https://www.wealthsimple.com/en-ca/tool/tax-calculator
- Fee calculator (compare what you're paying vs Wealthsimple): https://www.wealthsimple.com/en-ca/tool/fee-calculator
- International transfer calculator: https://www.wealthsimple.com/en-ca/tool/transfer-calculator

Your behavior:
1. Parse what they said — even if it's vague, emotional, or uses zero financial vocabulary
2. Figure out what actually matters for their situation
3. If something critical is missing, ask ONE natural follow-up question (not a list of questions — just one). If the question has a finite set of specific, concrete answers (e.g. account types, provinces, yes/no), list them as numbered options (e.g. 1. TFSA  2. RRSP  3. Not sure yet). Never use placeholders like $X or vague options — if the choices aren't specific and concrete, just ask the question without a list.
4. When you have enough, give your breakdown: what applies, why, what the tradeoffs are, and what the "spicier" options are if they want them
5. Link to relevant Wealthsimple learn guides or tools where genuinely useful — don't force it
6. Always end with "⚠️ The final call is yours." and one punchy sentence about why this decision needs a human brain

Tone rules:
- Write like a smart friend, not a compliance document
- Short sentences. Active voice. Occasional dry humour.
- Never say "it's important to note" or "it's worth mentioning" — just say the thing
- If something is genuinely boring but necessary, just say it's boring but necessary
- Use markdown links naturally in your response when referencing products or guides. Phrase links conversationally, e.g. "take a look at [Wealthsimple's TFSA](url)" or "check out [this RRSP guide](url)" — never just hyperlink a term inline like "__Wealthsimple's TFSA__ is solid"
- Use emojis naturally — not every sentence, but enough to keep it feeling human and fun. Good ones: 💸 money talk, 📈 investing wins, 🏠 home buying, 🔥 high-risk plays, 🧊 boring-but-safe stuff, 😬 risks/warnings, ✅ solid recommendations, 🎯 key takeaway, 🤷 genuine uncertainty, 🚀 growth potential, 💀 things to avoid

If you're just asking a follow-up question, keep it casual — one sentence, conversational, no formatting needed.`;

const STARTER_PROMPTS = [
  { emoji: "💸", text: "I make around $90k in Toronto and have like $15k just sitting in my chequing account doing nothing. Where do I even start?" },
  { emoji: "🤷", text: "Everyone keeps saying RRSP vs TFSA. I'm 28 with my first real job. Which one first?" },
  { emoji: "🏠", text: "My partner and I want to buy a house in 2–3 years. BC, combined ~$160k. Are we doing this right?" },
  { emoji: "🔥", text: "I want to put some money into crypto or prediction markets but not be an idiot about it. Help." },
  { emoji: "🛡️", text: "What is an options strategy I can use to protect my downside in an investment?" },
];

function renderLine(text) {
  const parts = [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  let last = 0, match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(
      <a key={match.index} href={match[2]} target="_blank" rel="noopener noreferrer"
        style={{ color: "#00C805", textDecoration: "underline", textUnderlineOffset: "2px" }}>
        {match[1]}
      </a>
    );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : text;
}

function TypingIndicator() {
  return (
    <div className="typing-row">
      <div className="msg-label">MoneyBuddy</div>
      <div className="typing-money">
        <span>💸</span><span>💸</span><span>💸</span>
      </div>
    </div>
  );
}

// Detect if a message ends with a question and extract quick-reply options
function extractQuickReplies(content) {
  const lines = content.trim().split("\n").filter(l => l.trim());

  // Only show pills if there are explicit numbered or lettered options
  const optionPatterns = [
    /^[A-D]\)\s+(.+)/,
    /^\d+\.\s+(.+)/,
    /^•\s+(.+)/,
  ];
  const options = lines
    .map(l => {
      for (const pat of optionPatterns) {
        const m = l.match(pat);
        if (m) return m[1].replace(/\*\*/g, "").trim();
      }
      return null;
    })
    .filter(Boolean);

  // Reject if any option contains placeholders like $X, [X], <X>, or is too long
  const hasPlaceholder = options.some(o =>
    /\$X|\[.*?\]|<.*?>|\bX\b/.test(o) || o.length > 60
  );
  if (hasPlaceholder) return null;

  return options.length >= 2 ? options : null;
}

function Message({ msg, isNew, onQuickReply }) {
  const isUser = msg.role === "user";
  const quickReplies = !isUser ? extractQuickReplies(msg.content) : null;

  // If pills exist, strip the option lines from the bubble text
  const optionLinePattern = /^([A-D]\)|[\d]+\.|•)\s+/;
  const displayLines = quickReplies
    ? msg.content.split("\n").filter(l => !optionLinePattern.test(l.trim()))
    : msg.content.split("\n");

  // Find the last non-empty line to bold it if it's a question
  const trimmed = displayLines.filter(l => l.trim());
  const lastLine = trimmed[trimmed.length - 1] || "";
  const lastIsQuestion = !isUser && lastLine.trim().endsWith("?");

  return (
    <div className={`message message--${msg.role} ${isNew ? "message--new" : ""}`}>
      <div className="msg-label">{isUser ? "You" : "MoneyBuddy"}</div>
      <div className="message__bubble">
        {displayLines.map((line, i) => {
          if (line.startsWith("⚠️")) return <p key={i} className="msg-warning">{renderLine(line)}</p>;
          if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i}>{renderLine(line.slice(2))}</li>;
          if (line.trim() === "") return <br key={i} />;
          const isQuestion = !isUser && line.includes("?");
          return <p key={i} style={isQuestion ? { fontWeight: 600 } : {}}>{renderLine(line)}</p>;
        })}
      </div>
      {quickReplies && (
        <div className="quick-replies">
          <div className="quick-replies__pills">
            {quickReplies.map((r, i) => (
              <button key={i} className="quick-pill" onClick={() => onQuickReply(r)}>{r}</button>
            ))}
          </div>
          <div className="quick-replies__hint">or type your response below ↓</div>
        </div>
      )}
    </div>
  );
}

const FEEDBACK_OPTIONS = [
  { emoji: "🤑", label: "Love it" },
  { emoji: "😏", label: "Good" },
  { emoji: "😐", label: "So so" },
];

function FeedbackPanel({ feedback, onSelect, feedbackRef }) {
  return (
    <div className="feedback-panel" ref={feedbackRef}>
      <h3 className="feedback-title">Thoughts on our chat?</h3>
      <div className="feedback-cards">
        {FEEDBACK_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            className={`feedback-card ${feedback === opt.label ? "feedback-card--selected" : ""}`}
            onClick={() => onSelect(opt.label)}
          >
            <span className="feedback-emoji">{opt.emoji}</span>
            <span className="feedback-label">{opt.label}</span>
          </button>
        ))}
      </div>
      {feedback && <p className="feedback-thanks">Thanks for the feedback! 🙌</p>}
    </div>
  );
}

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [newMsgIndex, setNewMsgIndex] = useState(null);
  const [feedback, setFeedback] = useState(null); // null | "selected emoji"
  const [showFeedback, setShowFeedback] = useState(false);
  const bottomRef = useRef(null);
  const feedbackRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setStarted(true);
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const assistantText = data.content?.[0]?.text || "Something went wrong. Please try again.";
      const updated = [...newMessages, { role: "assistant", content: assistantText }];
      setMessages(updated);
      setNewMsgIndex(updated.length - 1);

      // Show feedback after 4+ exchanges and the last message contains a wrap-up signal
      const wrapSignals = /⚠️|final call|good luck|hope (this|that) helps|any (other|more) question/i;
      const assistantTurns = updated.filter(m => m.role === "assistant").length;
      if (assistantTurns >= 3 && wrapSignals.test(assistantText) && !showFeedback) {
        setTimeout(() => {
          setShowFeedback(true);
          setTimeout(() => feedbackRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
        }, 800);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Hanken+Grotesk:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #FAF8F4;
          --black: #0A0A0A;
          --muted: #888;
          --rule: #D9D5CC;
          --red: #E8321E;
          --red-pale: #FEF1EF;
          --green: #00C805;
          --green-pale: #E6FFE6;
        }

        html, body { height: 100%; }

        body {
          font-family: 'Hanken Grotesk', sans-serif;
          background: var(--bg);
          color: var(--black);
        }

        .app {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 660px;
          margin: 0 auto;
          padding: 0 28px;
        }

        /* HEADER */
        .header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          padding: 22px 0 14px;
          border-bottom: 2.5px solid var(--black);
          flex-shrink: 0;
        }

        .header__left { display: flex; flex-direction: column; gap: 3px; }

        .header__eyebrow {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .header__title {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 23px;
          letter-spacing: -0.02em;
          line-height: 1;
          color: var(--black);
        }

        .header__title span { color: var(--green); }

        .header__tag {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--green);
          background: #E8F9E8;
          border: none;
          border-radius: 12px;
          padding: 7px 16px;
          line-height: 1.4;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }

        /* LANDING */
        .landing {
          flex: 1;
          overflow-y: auto;
          padding: 44px 0 32px;
          display: flex;
          flex-direction: column;
        }

        .landing__kicker {
          font-size: 26px;
          font-weight: 600;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--red);
          margin-bottom: 2px;
        }

        .landing__headline {
          font-family: 'Playfair Display', serif;
          font-size: 46px;
          font-weight: 900;
          line-height: 1.06;
          letter-spacing: -0.025em;
          color: var(--black);
          margin-bottom: 22px;
          max-width: 480px;
        }

        .landing__headline em { font-style: italic; font-weight: 700; }

        .landing__sub {
          font-size: 15px;
          line-height: 1.72;
          color: var(--muted);
          max-width: 440px;
          margin-bottom: 44px;
          padding-left: 16px;
          border-left: 2px solid var(--rule);
        }

        .starters-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--muted);
          padding-bottom: 10px;
          border-bottom: 1px solid var(--rule);
        }

        .starters { display: flex; flex-direction: column; }

        .starter {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 15px 0;
          border-bottom: 1px solid var(--rule);
          background: none;
          border-left: none; border-right: none; border-top: none;
          cursor: pointer;
          text-align: left;
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 14.5px;
          color: var(--black);
          font-weight: 400;
          line-height: 1.45;
          transition: color 0.12s;
        }

        .starter:hover { color: var(--green); }
        .starter:hover .starter__arrow { transform: translateX(4px); color: var(--green); }

        .starter__emoji { font-size: 17px; flex-shrink: 0; width: 24px; text-align: center; }
        .starter__text { flex: 1; }
        .starter__arrow { font-size: 14px; color: var(--rule); transition: transform 0.12s, color 0.12s; flex-shrink: 0; }

        /* CHAT */
        .chat {
          flex: 1;
          overflow-y: auto;
          padding: 4px 0 24px;
          display: flex;
          flex-direction: column;
          scroll-behavior: smooth;
        }

        .chat::-webkit-scrollbar { width: 3px; }
        .chat::-webkit-scrollbar-thumb { background: var(--rule); }

        .message {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 22px 0;
        }

        .message--user { align-items: flex-end; }
        .message--new .message__bubble { animation: fadeUp 0.22s ease forwards; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .msg-label {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--muted);
        }

        .message__bubble {
          font-size: 15.5px;
          line-height: 1.72;
          max-width: 94%;
          color: var(--black);
        }

        .message--user .message__bubble {
          background: #2C2B28;
          color: #FFFFFF;
          padding: 11px 20px;
          font-size: 14px;
          max-width: 72%;
          line-height: 1.5;
          border-radius: 999px 4px 999px 999px;
          display: inline-block;
          margin-left: auto;
        }

        .message__bubble p + p { margin-top: 11px; }
        .message__bubble li { margin-left: 20px; margin-top: 5px; list-style: disc; }

        .msg-warning {
          margin-top: 16px !important;
          padding: 14px 18px;
          background: #E8F9E8;
          border-left: 3px solid #0A0A0A;
          color: #0A0A0A;
          font-size: 14.5px;
          font-weight: 500;
          line-height: 1.6;
        }

        /* TYPING */
        .typing-row {
          padding: 22px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .typing-money { display: flex; gap: 4px; align-items: center; }

        .typing-money span {
          font-size: 18px;
          display: inline-block;
          animation: flyMoney 1.2s infinite;
          opacity: 0.3;
        }

        .typing-money span:nth-child(2) { animation-delay: 0.2s; }
        .typing-money span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes flyMoney {
          0%, 60%, 100% { transform: translateY(0) rotate(-5deg); opacity: 0.25; }
          30% { transform: translateY(-8px) rotate(8deg); opacity: 1; }
        }

        /* QUICK REPLIES */
        .quick-replies {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 14px;
        }

        .quick-replies__pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .quick-pill {
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--black);
          background: transparent;
          border: 1.5px solid var(--black);
          border-radius: 999px;
          padding: 6px 16px;
          cursor: pointer;
          transition: background 0.13s, color 0.13s;
          line-height: 1.4;
        }

        .quick-pill:hover {
          background: var(--black);
          color: var(--bg);
        }

        .quick-replies__hint {
          font-size: 10.5px;
          color: var(--muted);
          letter-spacing: 0.02em;
        }

        /* FEEDBACK */
        .feedback-panel {
          padding: 28px 0 8px;
          animation: fadeUp 0.3s ease forwards;
        }

        .feedback-rule {
          height: 2px;
          background: var(--black);
          margin-bottom: 20px;
        }

        .feedback-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--black);
          margin-bottom: 18px;
        }

        .feedback-cards {
          display: flex;
          gap: 12px;
        }

        .feedback-card {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 20px 12px;
          background: #F0EDE8;
          border: 1.5px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          font-family: 'Hanken Grotesk', sans-serif;
          transition: all 0.15s ease;
        }

        .feedback-card:hover {
          background: #E8E4DE;
          border-color: var(--rule);
        }

        .feedback-card--selected {
          border-color: var(--green);
          background: var(--green-pale);
        }

        .feedback-emoji { font-size: 36px; line-height: 1; }

        .feedback-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--black);
        }

        .feedback-thanks {
          margin-top: 14px;
          font-size: 13px;
          color: var(--muted);
          animation: fadeUp 0.2s ease forwards;
        }

        /* INPUT */
        .input-area {
          border-top: 2.5px solid var(--black);
          padding: 16px 0 22px;
          flex-shrink: 0;
          background: var(--bg);
        }

        .input-row {
          display: flex;
          gap: 10px;
          align-items: flex-end;
        }

        .input-row textarea {
          flex: 1;
          border: 1px solid var(--rule);
          background: #fff;
          font-family: 'Hanken Grotesk', sans-serif;
          font-size: 14.5px;
          font-weight: 400;
          color: var(--black);
          resize: none;
          outline: none;
          padding: 11px 14px;
          line-height: 1.5;
          max-height: 130px;
          min-height: 44px;
          transition: border-color 0.13s;
          border-radius: 0;
        }

        .input-row textarea:focus { border-color: var(--black); }
        .input-row textarea::placeholder { color: #B0AB9E; }

        .send-btn {
          width: 44px; height: 44px;
          background: var(--black);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--bg);
          transition: background 0.13s;
          border-radius: 0;
        }

        .send-btn:hover:not(:disabled) { background: #00A804; }
        .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        .input-hint {
          font-size: 10px;
          color: var(--muted);
          margin-top: 8px;
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="app">
        <header className="header">
          <div className="header__left">
            <div className="header__title">Money<span>Buddy</span></div>
          </div>
          <div className="header__tag">💬 AI-powered</div>
        </header>

        {!started ? (
          <div className="landing">
            <div className="landing__kicker">🇨🇦</div>
            <h2 className="landing__headline">
              Your money coach.<br /><em>No jargon.<br />No judgment. 💸</em>
            </h2>
            <p className="landing__sub">
              No forms. No dropdowns. Just tell us where you're at —
              messy, incomplete, uncertain, whatever.
            </p>
            <div className="starters-label">Try one of these →</div>
            <div className="starters">
              {STARTER_PROMPTS.map((p, i) => (
                <button key={i} className="starter" onClick={() => sendMessage(p.text)}>
                  <span className="starter__emoji">{p.emoji}</span>
                  <span className="starter__text">{p.text}</span>
                  <span className="starter__arrow">→</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat">
            {messages.map((msg, i) => (
              <Message key={i} msg={msg} isNew={i === newMsgIndex} onQuickReply={sendMessage} />
            ))}
            {loading && <TypingIndicator />}
            {showFeedback && !loading && (
              <FeedbackPanel feedback={feedback} onSelect={setFeedback} feedbackRef={feedbackRef} />
            )}
            <div ref={bottomRef} />
          </div>
        )}

        <div className="input-area">
          <div className="input-row">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
              }}
              onKeyDown={handleKey}
              placeholder={messages.length > 0 ? "Tell me more..." : "What's on your mind?"}
              rows={1}
              disabled={loading}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <div className="input-hint">Enter to send · Shift+Enter for new line · you make the final call 🙌</div>
        </div>
      </div>
    </>
  );
}
