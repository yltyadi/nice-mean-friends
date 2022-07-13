import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
const key = "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";
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: key,
});
const openai = new OpenAIApi(configuration);

function Chat({topic}) {
  const [messageList, setMessageList] = useState([]);
  const [counter, setCounter] = useState(1);
  const [lastMessage, setLastMessage] = useState("");
  let currentMessage;

  const sendMessage = async () => {
    
    setCounter(counter + 1);

    if (counter === 1) {

      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Topic: ${topic}\nTwo-Sentence Horror Story:`,
        temperature: 0.8,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
      });

      console.log('1');

      currentMessage = response.data.choices[0].text;
    }
    
    else if (counter % 2 === 0) {
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Marv is a chatbot that reluctantly answers questions with sarcastic responses:\n\nYou: ${lastMessage}\nMarv:`,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 0.3,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
      });

      console.log('2');

      currentMessage = response.data.choices[0].text;
    }

    else {
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `You: ${lastMessage}\nFriend:`,
        temperature: 0.5,
        max_tokens: 60,
        top_p: 1.0,
        frequency_penalty: 0.5,
        presence_penalty: 0.0,
        stop: ["You:"],
      });

      console.log('3');

      currentMessage = response.data.choices[0].text;
    }

    if (currentMessage !== "") {
      const messageData = {
        author: (counter % 2 === 1 ? "Nice Friend" : "Mean Friend"),
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" + 
          Math.floor(new Date(Date.now()).getMinutes() / 10) + Math.floor(new Date(Date.now()).getMinutes()) % 10,
      };

      setMessageList((list) => [...list, messageData]);
      setLastMessage(currentMessage);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      sendMessage();
    }, 3000);
    return () => clearTimeout(timer);
  }, [lastMessage]);

  const stop = () => {
    window.location.reload();    
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Nice and Mean Friends</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            return (
              <div
                className="message"
                id={"Nice Friend" === messageContent.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{messageContent.time}</p>
                    <p id="author">{messageContent.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        {<button onClick={stop}>Stop &#128721;</button>}
        
      </div>
    </div>
  );
}

export default Chat;