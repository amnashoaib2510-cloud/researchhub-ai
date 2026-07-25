import { useState } from "react";
import toast from "react-hot-toast";
import { LuSparkles, LuQuote, LuTags, LuLightbulb } from "react-icons/lu";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";

const Tool = ({ icon: Icon, num, title, children }) => (
  <div className="card">
    <div className="flex items-center gap-2 mb-1">
      <span className="font-mono text-[11px] text-ink/30">{num}</span>
      <Icon size={16} className="text-gold-dark" />
      <p className="eyebrow">{title}</p>
    </div>
    {children}
  </div>
);

const AITools = () => {
  // Summarizer
  const [summaryInput, setSummaryInput] = useState("");
  const [summaryResult, setSummaryResult] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Topic suggestions
  const [interestArea, setInterestArea] = useState("");
  const [topics, setTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);

  // Citation
  const [citationTitle, setCitationTitle] = useState("");
  const [citationAuthors, setCitationAuthors] = useState("");
  const [citationYear, setCitationYear] = useState("");
  const [citationStyle, setCitationStyle] = useState("APA");
  const [citationResult, setCitationResult] = useState("");

  // Keywords
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [keywordsLoading, setKeywordsLoading] = useState(false);

  const runSummarize = async () => {
    if (!summaryInput.trim()) return toast.error("Paste some text first");
    setSummaryLoading(true);
    try {
      const { data } = await api.post("/ai/summarize", { text: summaryInput });
      setSummaryResult(data.summary);
    } catch {
      toast.error("Could not summarize");
    } finally {
      setSummaryLoading(false);
    }
  };

  const runTopics = async () => {
    setTopicsLoading(true);
    try {
      const { data } = await api.post("/ai/suggest-topics", { interestArea });
      setTopics(data.topics);
    } catch {
      toast.error("Could not suggest topics");
    } finally {
      setTopicsLoading(false);
    }
  };

  const runCitation = () => {
    if (!citationTitle.trim()) return toast.error("Enter a paper title");
    const authors = citationAuthors ? citationAuthors.split(",").map((a) => a.trim()) : ["Unknown Author"];
    const year = citationYear || new Date().getFullYear();
    let result = "";
    if (citationStyle === "MLA") result = `${authors.join(", ")}. "${citationTitle}." ${year}.`;
    else if (citationStyle === "CHICAGO") result = `${authors.join(", ")}. ${year}. "${citationTitle}."`;
    else result = `${authors.join(", ")} (${year}). ${citationTitle}.`;
    setCitationResult(result);
  };

  const runKeywords = async () => {
    if (!keywordInput.trim()) return toast.error("Paste some text first");
    setKeywordsLoading(true);
    try {
      const { data } = await api.post("/ai/keywords", { text: keywordInput });
      setKeywords(data.keywords);
    } catch {
      toast.error("Could not extract keywords");
    } finally {
      setKeywordsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <p className="eyebrow">Research Assistance</p>
      <h1 className="font-display text-3xl font-semibold mt-1 mb-8">AI Tools</h1>

      <div className="grid grid-cols-2 gap-6">
        <Tool icon={LuSparkles} num="01" title="Paper Summarization">
          <textarea
            rows={4}
            className="input-field text-sm mt-2"
            placeholder="Paste an abstract or paragraph…"
            value={summaryInput}
            onChange={(e) => setSummaryInput(e.target.value)}
          />
          <button onClick={runSummarize} disabled={summaryLoading} className="btn-gold mt-3 text-sm">
            {summaryLoading ? "Summarizing…" : "Summarize"}
          </button>
          {summaryResult && (
            <p className="text-sm text-ink-soft mt-3 border-l-2 border-gold pl-3">{summaryResult}</p>
          )}
        </Tool>

        <Tool icon={LuLightbulb} num="02" title="Research Topic Suggestions">
          <input
            className="input-field text-sm mt-2"
            placeholder="Your area of interest, e.g. renewable energy"
            value={interestArea}
            onChange={(e) => setInterestArea(e.target.value)}
          />
          <button onClick={runTopics} disabled={topicsLoading} className="btn-gold mt-3 text-sm">
            {topicsLoading ? "Thinking…" : "Suggest topics"}
          </button>
          {topics.length > 0 && (
            <ul className="mt-3 space-y-2">
              {topics.map((t, i) => (
                <li key={i} className="text-sm text-ink-soft border-l-2 border-gold pl-3">{t}</li>
              ))}
            </ul>
          )}
        </Tool>

        <Tool icon={LuQuote} num="03" title="Citation Generator">
          <div className="space-y-2 mt-2">
            <input className="input-field text-sm" placeholder="Paper title" value={citationTitle} onChange={(e) => setCitationTitle(e.target.value)} />
            <input className="input-field text-sm" placeholder="Authors (comma-separated)" value={citationAuthors} onChange={(e) => setCitationAuthors(e.target.value)} />
            <div className="flex gap-2">
              <input className="input-field text-sm" placeholder="Year" value={citationYear} onChange={(e) => setCitationYear(e.target.value)} />
              <select className="input-field text-sm" value={citationStyle} onChange={(e) => setCitationStyle(e.target.value)}>
                <option value="APA">APA</option>
                <option value="MLA">MLA</option>
                <option value="CHICAGO">Chicago</option>
              </select>
            </div>
          </div>
          <button onClick={runCitation} className="btn-gold mt-3 text-sm">Generate citation</button>
          {citationResult && (
            <p className="text-sm text-ink-soft mt-3 border-l-2 border-gold pl-3 font-mono">{citationResult}</p>
          )}
        </Tool>

        <Tool icon={LuTags} num="04" title="Keyword Extraction">
          <textarea
            rows={4}
            className="input-field text-sm mt-2"
            placeholder="Paste text to extract keywords from…"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
          <button onClick={runKeywords} disabled={keywordsLoading} className="btn-gold mt-3 text-sm">
            {keywordsLoading ? "Extracting…" : "Extract keywords"}
          </button>
          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {keywords.map((k) => (
                <span key={k} className="text-[11px] font-mono bg-ink/5 px-2 py-0.5 rounded-full text-ink-soft">{k}</span>
              ))}
            </div>
          )}
        </Tool>
      </div>
    </DashboardLayout>
  );
};

export default AITools;
