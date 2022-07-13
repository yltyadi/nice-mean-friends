import "./App.css";
import { useState } from "react";
import Chat from "./Chat";


function App() {
  const [topic, setTopic] = useState("");
  const [showChat, setShowChat] = useState(false);

  const join = () => {
    if (topic !== "") {
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Have you ever wondered what a conversation between nice and mean friends would look like?</h3>
          <input
            type="text"
            placeholder="Topic"
            onChange={(event) => {
              setTopic(event.target.value);
            }}
          />
          <button onClick={join}>Start Conversation</button>
        </div>
      ) : (
        <Chat topic={topic}/>
      )}
    </div>
  );
}

export default App;