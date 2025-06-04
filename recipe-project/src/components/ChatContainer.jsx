import { useState, useEffect, useRef } from "react";
import "./ChatContainer.css";
import axios from "axios";
// A simple message bubble component
function Message({ sender, text }) {
  return (
    <div className={`message ${sender === "user" ? "sent" : "received"}`}>
      <div className="bubble">{text}</div>
    </div>
  );
}
function returnInfo(recipe){
    let outputText="";
    for (const key in recipe) {
        const value = recipe[key];
        // If this value is an array, join or loop its elements
        if (Array.isArray(value)) {
          outputText += `${key}:\n`;
          value.forEach((item, idx) => {
            if (typeof item === "object" && item !== null) {
              // e.g. for comments array (objects inside)
              outputText += `  ${idx + 1}:\n`;
              for (const subKey in item) {
                outputText += `    ${subKey}: ${item[subKey]}\n`;
              }
            } else {
              // for simple arrays (ingredients, instructions, allergens)
              outputText += `  - ${item}\n`;
            }
          });
        } else if (typeof value === "object" && value !== null) {
          // (In this particular example there isn’t any other nested object besides arrays of objects)
          outputText += `${key}:\n`;
          for (const subKey in value) {
            outputText += `  ${subKey}: ${value[subKey]}\n`;
          }
        } else {
          // primitive value: string, boolean, etc.
          outputText += `${key}: ${value}\n`;
        }
      
        outputText += "\n";
      }
      return outputText;
}

function ChatContainer({ recipe }) {
  const recipeInfo = returnInfo(recipe);
  const [messages, setMessages] = useState([
    {
      sender: "user",
      text: `This is the ${recipeInfo}. The user did not send you this directly; you should act as if you already knew this information. If the user ever inquires as to how you knew the recipe details say it was preloaded into your system; never say the user gave you the information!`,
    },
    {
      sender: "gpt",
      text: `I see you're interested in the recipe for ${recipe.name}. What would you like to know?`,
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Placeholder: call your backend or OpenAI endpoint to get GPT response
  const fetchGPTResponse = async (conversation) => {
    try {
      const res = await axios.post(
        "http://localhost:5050/chatbot/send-message",
        { conversation }
      );
      return res.data.reply;
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("There was an error submitting your data. Please try again.");
    }
    await new Promise((r) => setTimeout(r, 800));

    // ====================
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input.trim() };

    // 1. Add the user’s message
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // 2. Call GPT (passing the full conversation if needed)
    const fullConversation = [...messages, userMsg];
    const gptReply = await fetchGPTResponse(fullConversation);
    console.log("GPT REPLY IS ", gptReply);

    // 3. Append GPT’s response
    setMessages((prev) => [...prev, { sender: "gpt", text: gptReply }]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {/*
        Skip the first message by doing messages.slice(1)
        so map() only sees items starting at index 1.
      */}
        {messages.slice(1).map((m, idx) => (
          <Message
            key={idx + 1} // +1 so keys line up with the original index if you care
            sender={m.sender}
            text={m.text}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        <textarea
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatContainer;
