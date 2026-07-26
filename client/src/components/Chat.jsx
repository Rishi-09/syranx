"use client";

import React, { useContext, useState, useEffect } from "react";
import { Mycontext } from "./Mycontext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import Avatar from "./ui/Avatar";
import "./Chat.css";
import "highlight.js/styles/github-dark.css";

// rehype-highlight wraps tokens in nested <span> elements, so a code
// block's children are a tree of strings and elements, not plain text.
function getTextContent(node) {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextContent).join("");
  if (node && typeof node === "object" && node.props) return getTextContent(node.props.children);
  return "";
}

function CodeBlock({ children, ...props }) {
  const [copied, setCopied] = useState(false);
  const codeElement = Array.isArray(children) ? children[0] : children;
  const className = codeElement?.props?.className || "";
  const language = /language-(\w+)/.exec(className)?.[1] || "text";
  const rawText = getTextContent(codeElement?.props?.children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="code-block my-3 overflow-hidden rounded-xl border border-border-subtle">
      <div className="flex items-center justify-between bg-white/[0.03] px-3.5 py-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] text-ink-muted transition-colors duration-150 hover:bg-white/5 hover:text-ink"
        >
          <i className={`fa-regular ${copied ? "fa-check" : "fa-copy"}`} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre {...props} className="!m-0 overflow-x-auto p-4 text-[13px] leading-relaxed">
        {children}
      </pre>
    </div>
  );
}

const markdownComponents = { pre: CodeBlock };

const Chat = () => {
  let { prevChats, reply } = useContext(Mycontext);
  let [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    if (reply === null) {
      setLatestReply(null);
      return;
    }
    if (!prevChats?.length) return;
    const content = reply.split(" ");
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));

      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [reply, prevChats]);

  return (
    <div className="chat mx-auto w-full max-w-3xl flex-1 p-4">
      {prevChats?.slice(0, -1).map((chat, idx) => (
        <div
          className={`flex gap-3 py-3 ${chat.role === "user" ? "justify-end" : "justify-start"}`}
          key={idx}
        >
          {chat.role !== "user" && <Avatar kind="ai" size="sm" className="mt-0.5" />}

          {chat.role === "user" ? (
            <p className="prompt max-w-[85%] rounded-2xl bg-surface-3 px-4 py-2.5 text-[15px] leading-relaxed text-ink">
              {chat.content}
            </p>
          ) : (
            <div className="message reply max-w-[85%] text-[15px] leading-relaxed text-ink">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={markdownComponents}>
                {chat.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      ))}

      {prevChats.length > 0 && latestReply !== null && (
        <div className="flex gap-3 py-3 justify-start" key="typing">
          <Avatar kind="ai" size="sm" className="mt-0.5" />
          <div className="reply max-w-[85%] text-[15px] leading-relaxed text-ink">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={markdownComponents}>
              {latestReply}
            </ReactMarkdown>
          </div>
        </div>
      )}
      {prevChats.length > 0 && latestReply === null && (
        <div className="flex gap-3 py-3 justify-start" key="last">
          <Avatar kind="ai" size="sm" className="mt-0.5" />
          <div className="reply max-w-[85%] text-[15px] leading-relaxed text-ink">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]} components={markdownComponents}>
              {prevChats[prevChats.length - 1].content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
