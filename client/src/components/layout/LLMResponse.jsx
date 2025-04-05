
//
//  IFQ717 Web Development Capstone
//
//  LLMREsponse.jsx - Displays the LLM Response and watermark by Gary Cazzulino
//
//

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import aiwatermark from "../../images/aiwatermark.png"; //icons8-ai.gif";//aiwatermark.png";


const LLMResponse = ({ content }) => {
  return (
    <div style={{ position: 'relative' }}>
        <div className="markdown-content text-primary-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      {/*<img src={aiwatermark} className="watermark"></img>  see https://openai.com/brand/ */}
      <p className="watermark text-primary-content">Written with ChatGPT</p>
    </div>
  );
};

export default LLMResponse;
