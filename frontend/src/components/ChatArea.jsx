import { useState, useRef, useEffect } from 'react';
import { chatMessages } from '../data/mockData';

import { jwtDecode } from "jwt-decode";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

// const token = localStorage.getItem("token");

import { useNavigate, useParams } from "react-router-dom";

import { Navigate } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// const { chat_id } = useParams();

let myUserId;


// const API_URL = 'http://127.0.0.1:8000';
const API_URL = 'https://chatx-r9e0.onrender.com' || 'http://127.0.0.1:8000';

const WS_URL = API_URL.replace(/^https/, 'ws');


// let contact = {
//   name : "shanid",
//   avatar : "/assets/shanid.jpg",
//   status : "onlines",
//   lastSeen : "todays",
// }

const formatTime = (isoString) => {
  // if (!isoString || isoString === "Offline") return "Offline";
  
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  });
};



export default function ChatArea({ onToggleSidebar, onToggleContactInfo }) {

  const navigate = useNavigate();

  // const { chat_id } = useParams();
  // const [messages, setMessages] = useState([]); //old
  const [messages, setMessages] = useState([]); 

  const [contact, setUserData] = useState({
    name: 'Loading...',
    status: 'Offline',
    avatar: '/assets/shanid.jpg',
    lastSeen: 'today',
    OuserID : ''
  });

  // const [OuserID, setOUserID] = useState('')

  // const [isTyping, setIsTyping] = useState(false);
  // const messagesEndRef = useRef(null);
  // const inputRef = useRef(null);

  // const contact = contacts.find((c) => c.id === activeChatId);

  // useEffect(() => {
  //   if (activeChatId && chatMessages[activeChatId]) {
  //     // setMessages([...chatMessages[activeChatId]]);
  //   }
  // }, [activeChatId]);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages, isTyping]);

  // const handleSend = () => {
  //   if (!newMessage.trim()) return;

  //   const msg = {
  //     id: `msg-${Date.now()}`,
  //     senderId: 'user-0',
  //     text: newMessage.trim(),
  //     timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //     status: 'sent',
  //   };

  //   // setMessages((prev) => [...prev, msg]);
  //   // setNewMessage('');
  //   inputRef.current?.focus();

  //   // Simulate typing reply
  //   setIsTyping(true);
  //   setTimeout(() => {
  //     setIsTyping(false);
  //     const replies = [
  //       "That's great to hear! 😊",
  //       "I'll get back to you on that.",
  //       "Absolutely, let's do it!",
  //       "Sounds good to me! 👍",
  //       "I was thinking the same thing.",
  //       "Sure, no problem at all!",
  //     ];
  //     const reply = {
  //       id: `msg-${Date.now() + 1}`,
  //       senderId: activeChatId,
  //       text: replies[Math.floor(Math.random() * replies.length)],
  //       timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //       status: 'read',
  //     };
  //     // setMessages((prev) => [...prev, reply]);
  //   }, 1500 + Math.random() * 1500);
  // };

  // const handleKeyDown = (e) => {
  //   if (e.key === 'Enter' && !e.shiftKey) {
  //     e.preventDefault();
  //     handleSend();
  //   }
  // };

  // Empty state
  // if (!chat_id || !contact) {
  //   return (
  //     <div className="flex-1 flex flex-col items-center justify-center bg-canvas">
  //       <div className="text-center animate-fade-in">
  //         <div className="w-24 h-24 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-6">
  //           <i className="fa-regular fa-comments text-4xl text-accent/40"></i>
  //         </div>
  //         <h3 className="text-xl font-semibold text-primary mb-2">Welcome to ChatX</h3>
  //         <p className="text-sm text-secondary max-w-xs">
  //           Select a conversation from the sidebar to start messaging, or create a new one.
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }




// backend integration

const [text, setText] = useState("");

  const socketRef = useRef(null);

  const { chat_id } = useParams();

  console.log("chatid",{chat_id})



  useEffect(() => {

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/messages/${chat_id}`, {
          method: "GET",
          headers: {
            // "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Backend response:", data);

        // setOUserID(data.OuserID)

        setUserData(prev => ({
            ...prev,
            name: data.opposite_name,
            OuserID: data.OuserID
            // name: "Shanidka"
          }));
           setMessages("")
        data.status.map((item) => {

          const prevChats = data.status.map((item) =>  ({
            sender_id: item.sender_id,
            message: item.content
          }))
          // console.log("prev chats",prevChats)
          setMessages(prevChats)
        })


        if(data.OuserID){

          const response = await fetch(`${API_URL}/online-users`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dataS = await response.json();
        console.log("Backend response of online status:", dataS);

        let status = "Offline";
        console.log("Ouser" ,data.OuserID)
        if (dataS.includes(data.OuserID)){
          status = "Online"
        }

        if (status === "Online" ){
          console.log("this guy is in onlnie")
        }
        setUserData(prev => ({
            ...prev,
            status : status
          }));


        }


        if(data.OuserID && contact.status != "Online"){
          const response = await fetch(`${API_URL}/user-data?chat_id=${encodeURIComponent(chat_id)}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }})

          const dataS = await response.json();
          console.log("Backend response of last seen:", dataS.data.last_seen);

          let status = formatTime(dataS.data.last_seen)
          setUserData(prev => ({
            ...prev,
            status : `Last seen Today at ${status}`
          }));
        }

      } catch (error) {
        console.error("Error:", error);
        // Safe check for toast to prevent application crashes
        // if (typeof toast !== 'undefined') {
        //   toast.error("Server error. Please try again.");
        // }
      }
    }


    // const getOnlineStatus = async () => {
    // try {
    //     const token = localStorage.getItem('token');
        
           
        

    //   } catch (error) {
    //     console.error("Error:", error);
      // }
  // }


  
  loadMessages()
  // getOnlineStatus();


}, [chat_id]);




  // const token = TOKEN;
  useEffect(() => {
    // 2. This will now correctly call the browser's native WebSocket API
    // const token = new URLSearchParams(window.location.search).get("token");
    const token = localStorage.getItem('token');

    // socketRef.current = new window.WebSocket(`ws://localhost:8000/ws?token=${token}`);
    socketRef.current = new window.WebSocket(`${WS_URL}/ws?token=${token}`);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected!");
    };

    const decoded = jwtDecode(token);
    localStorage.setItem("user", JSON.stringify(decoded));

    const user = JSON.parse(localStorage.getItem("user"));
    myUserId = user.user_id;
    // console.log(myUserId)

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("Received:", data);

      if (data.type === "sent") {
        console.log("Message saved:", data.message_id);
        if(data.message){
          setMessages((prev) => [
              ...prev, 
              {
                sender_id: data.sender_id,
                message : data.message
              }
          ])
        }
        return;
      }

      //coming data
      if(data.message){
        setMessages((prev) => [
            ...prev, 
            {
              sender_id: data.sender_id,
              message : data.message
            }
        ])
      }

      // console.log("list of msgs", messages)
      console.log("Sender:", data.sender_id);
      console.log("Message:", data.message);
    };


    socketRef.current.onclose = () => {
      console.log("Disconnected");
    };


    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
  console.log("list of msgs updated:", messages);
}, [messages]);


useEffect(() => {
  
})

  const sendMessage = () => {


    if (
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    ) {
      console.log("Socket not connected");
      return;
    }

    socketRef.current.send(
      JSON.stringify({
      chat_id: chat_id,
      // receiver_id: 2,
      message: text
  })
  
    );

    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     sender_id: 1,
    //     message : text
    //   }
    // ])

    setText("");

  };





  return (
    <div className="flex-1 flex flex-col h-full bg-canvas">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-surface/80 glass-effect">
        <div className="flex items-center gap-3">
          {/* Hamburger for mobile */}
          <button
            // onClick={onToggleSidebar}
            onClick={() => navigate('/chats')}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors text-secondary lg:hidden"
          >
            <i className="fa-solid fa-arrow-left text-sm"></i>
            {/* <FontAwesomeIcon icon="arrow-left"/> */}
          </button>

          <button
            onClick={onToggleContactInfo}
            className="flex items-center gap-3 group"
          >
            <div className="relative">
              {/* <img
                src={contact.avatar}
                alt={contact.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-border group-hover:ring-accent/40 transition-all"
              /> */}

              <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-bold uppercase">
                  {contact.name.slice(0, 2)}
              </div>
              {contact.status === 'Online' && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-online rounded-full border-2 border-surface"></span>
              )}
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
                {contact.name}
              </h3>
              <p className="text-[11px] text-secondary">
                {/* {contact.status === 'Online' ? ( */}
                  <span className="">{contact.status}</span>
                 {/* ) : (  */}
                {/* //  contact.lastSeen  */}
                {/* <span className="text-red-700">Offline</span> */}
                 {/* )}  */}
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors text-secondary hover:text-accent">
            <i className="fa-solid fa-phone text-sm"></i>
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors text-secondary hover:text-accent">
            <i className="fa-solid fa-video text-sm"></i>
          </button>
          <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors text-secondary hover:text-accent">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
          </button>
          <button
            onClick={onToggleContactInfo}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors text-secondary hover:text-accent"
          >
            <i className="fa-solid fa-ellipsis-vertical text-sm"></i>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 lg:px-16 py-6">
        <div className="max-w-3xl mx-auto space-y-1">
          {/* Date Separator */}
          <div className="flex items-center justify-center mb-6">
            <span className="px-4 py-1 rounded-full bg-surface border border-border text-[11px] text-tertiary font-medium">
              Today
            </span>
          </div>


          {/* <div>
      {messages.map((msg, index) => (
        <div key={index}>
          <b>{msg.sender_id}</b>: {msg.message}
        </div>
      ))}
    </div> */}

{/* <div> */}
    {messages != "" && messages.map((msg, index) =>{
        const isOwn = msg.sender_id == myUserId

        return(
          <div key={msg.id}
                className={`flex items-end gap-2 animate-message-pop ${
                  isOwn ? 'justify-end' : 'justify-start'
                }`}
                style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}>

                  <div
                  className={`group relative max-w-[75%] md:max-w-[65%] ${
                    isOwn ? 'order-1' : ''
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isOwn
                        ? 'bg-accent text-canvas rounded-br-md'
                        : 'bg-surface border border-border text-primary rounded-bl-md'
                    }`}
                  >
                    {/* {msg.type === 'call' && (
                      <i className="fa-solid fa-phone-slash text-danger mr-2 text-xs"></i>
                    )} */}
                    {msg.message}
                  </div>

</div>
          </div>
        )
    })
    
    }
    {/* </div> */}

          {/* {messages.map((msg, index) => {
            const isOwn = msg.senderId === 'user-0';
            const showAvatar =
              !isOwn &&
              (index === 0 || messages[index - 1]?.senderId !== msg.senderId);

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 animate-message-pop ${
                  isOwn ? 'justify-end' : 'justify-start'
                }`}
                style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
              >
                
                {!isOwn && (
                  <div className="w-7 flex-shrink-0">
                    {showAvatar && (
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                    )}
                  </div>
                )}

                <div
                  className={`group relative max-w-[75%] md:max-w-[65%] ${
                    isOwn ? 'order-1' : ''
                  }`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      isOwn
                        ? 'bg-accent text-canvas rounded-br-md'
                        : 'bg-surface border border-border text-primary rounded-bl-md'
                    }`}
                  >
                    {msg.type === 'call' && (
                      <i className="fa-solid fa-phone-slash text-danger mr-2 text-xs"></i>
                    )}
                    {msg.text}
                  </div>

                  
                  <div
                    className={`flex items-center gap-1 mt-1 ${
                      isOwn ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <span className="text-[10px] text-tertiary">{msg.timestamp}</span>
                    {isOwn && (
                      <i
                        className={`fa-solid fa-check-double text-[10px] ${
                          msg.status === 'read' ? 'text-accent' : 'text-tertiary'
                        }`}
                      ></i>
                    )}
                  </div>
                </div>
              </div>
            );
          })} */}

          {/* Typing Indicator */}
          {/* {isTyping && (
            <div className="flex items-end gap-2 animate-fade-in">
              <div className="w-7 flex-shrink-0">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              </div>
              <div className="bg-surface border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-accent/60 rounded-full typing-dot"></span>
                  <span className="w-2 h-2 bg-accent/60 rounded-full typing-dot"></span>
                  <span className="w-2 h-2 bg-accent/60 rounded-full typing-dot"></span>
                </div>
              </div>
            </div>
          )} */}

          {/* <div ref={messagesEndRef} /> */}
          <div />
        </div>
      </div>

      {/* Message Input */}
      <div className="px-4 md:px-6 py-3 pb-5 border-t border-border bg-surface/80 glass-effect">
        <div className="max-w-3xl mx-auto flex items-start gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-hover transition-colors text-secondary hover:text-accent flex-shrink-0">
            <i className="fa-regular fa-face-smile text-lg"></i>
          </button>

          <div className="flex-1 relative">
            <textarea
              // ref={inputRef}
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              // onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              // rows={1}
              className="w-full bg-canvas border border-border rounded-2xl py-2.5 px-4 pr-12 text-sm text-primary placeholder-tertiary outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/20 transition-all resize-none max-h-8"
              style={{ minHeight: '42px' }}
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-accent transition-colors">
              <i className="fa-solid fa-paperclip text-sm"></i>
            </button>
          </div>

          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              text.trim()
                ? 'bg-accent text-canvas hover:bg-accent-hover shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:scale-105'
                : 'bg-surface border border-border text-tertiary'
            }`}
          >
            <i className="fa-solid fa-paper-plane text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
