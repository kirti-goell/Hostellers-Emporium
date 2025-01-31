import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Style/ChatingRoom.css'
export default function ChatingRoom() {
  const [samp, setsamp] = useState(null);
  const [array, setArray] = useState([]);
  const [chat, setChat] = useState("");  // Corrected state initialization

  useEffect(() => {
    const roomNumber = localStorage.getItem('ChatId');
    setsamp(roomNumber);

    const fetchChatData = async () => {
      if (roomNumber) {
        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.post('http://localhost:5000/getChat', {
            Authorization: token,
            ChatId: roomNumber,
          });
          setArray(response.data.chats);
        } catch (error) {
          console.error('Error fetching chat data:', error);
        }
      }
    };

    fetchChatData(); // Initial fetch
    const interval = setInterval(fetchChatData, 1000); // Refresh every 1 second

    // Cleanup the interval when the component is unmounted or on dependency change
    return () => clearInterval(interval);
  }, []);

  const addChat = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post('http://localhost:5000/sendChat', {
        Authorization: token,
        ChatId: localStorage.getItem('ChatId'),
        msg: chat,
      });
      // alert(response.data.msg);
      setChat("");  // Clear the input after sending the message
    } catch (error) {
      console.error('Error sending chat:', error);
    }
  };
  console.log(array);

  return (
    <div className='ChatingRoom-outer'>
      <h2 className='ChatingRoom-header'>Chat Room</h2>
      <div className="ChatingRoom-cont">
      {array.length > 0 ? (
        array.map((chat, index) => (
          <div key={index}>
            <div className='ChatingRoom-line'>
              <div id="Chat-info">
              <div className='ChatingRoom-name'>{chat.sender} :</div>
              <div>{chat.message}</div>
              </div>
              <div id="chat-time-cont">{chat.timestamp}</div>
            </div>
          </div>
        ))
      ) : (
        <p id="start-chat">Start your chat here</p>
      )}
      </div>
      <div className='ChatingRoom-input-outer'>
        <form onSubmit={addChat}>
          <input 
            type='text' 
            id="chat-input"
            value={chat}  // Bind input value to chat state
            onChange={(event) => setChat(event.target.value)} 
            required
          />
          <button type='submit' id="chat-submit">Send</button> {/* Corrected typo */}
        </form>
      </div>
    </div>
  );
}
