# moneybuddy💸
**An AI-native financial coaching tool for Canadians**
Vibe financial advice is already here. Canadians are asking ChatGPT about RRSPs, TFSAs, and investment strategies and getting answers from general-purpose AI with no knowledge of Canadian tax law and zero accountability. The behaviour has shifted. The question is whether that gap gets filled by something purpose-built or left to tools that were never designed for it.
MoneyBuddy is a conversational AI coach that meets people in that messy, pre-decision moment. Describe your financial situation in plain English and MoneyBuddy figures out what accounts, tax treatments, and strategies actually apply to you. No forms. No dropdowns. No jargon.
For educational purposes only.

**Running the demo**
1. Download https://github.com/meshi6/moneybuddy-/blob/main/MoneyBuddy.jsx
2. Go to claude.ai and start a new conversation
3. Click the paperclip icon and upload MoneyBuddy.jsx
4. Type Render this as a React artifact and hit send
5. Claude renders it as a live interactive app in the Artifacts panel

**What AI owns**
Parsing ambiguous natural language into financial parameters
Identifying which accounts and vehicles are relevant
Reasoning about tradeoffs
Flagging what it doesn't know and asking the right follow-up questions

**What the human must decide**
Whether to act. The one critical decision that must remain human is the timely referral to a licensed financial advisor. Humans in the loop, exactly when it matters.

**What breaks first at scale**
Stale education. Tax rules change. Without a live retrieval layer over authoritative sources, MoneyBuddy can confidently say something that was true six months ago. The fix is versioned tax documentation plus automated evals that flag jurisdiction-specific claims.
Overconfidence on ambiguous inputs. If someone says "I have some savings" without saying how much, the system needs to surface that gap, not fill it with assumptions.
Incomplete context. MoneyBuddy knows what you tell it. Financial decisions are made in a context no system can fully observe.

**The regulatory reality**
MoneyBuddy lives entirely in the financial education category by design. It never tells you what to do. It explains the tradeoffs and makes the compliance boundary visible at every conversation: The final call is yours.

**What's next**
Voice integration and embedded calculators. Further ahead, a connection to a robo-advisor creates a natural path from education to regulated action.

**Stack**
React (single file, no build step)
Claude API via Anthropic
Vanilla CSS

**Disclaimer**
MoneyBuddy is a prototype for educational and demonstration purposes. It does not constitute financial advice. Always consult a licensed financial advisor before making investment decisions.
