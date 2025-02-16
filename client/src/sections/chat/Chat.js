import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const socket = io("http://localhost:8000");

const Chat = ({ userEmail, isTeacher }) => {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [newEmail, setNewEmail] = useState(""); // For new chats
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatList, setChatList] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); 
  const messageInputRef = useRef(null);

  // Fetch messages when receiverEmail changes
  useEffect(() => {
    if (receiverEmail) {
      fetchMessages();
    }
  }, [receiverEmail]);

  // Fetch chat list on component mount
  useEffect(() => {
    fetchChatList();
  }, []);

  useEffect(() => {
    socket.emit("join", userEmail);

    const handleReceiveMessage = (newMessage) => {
      console.log("Received message:", newMessage);

      // ✅ Update messages instantly
      setMessages((prevMessages) => {
        if (
          (newMessage.senderEmail === userEmail && newMessage.receiverEmail === receiverEmail) ||
          (newMessage.receiverEmail === userEmail && newMessage.senderEmail === receiverEmail)
        ) {
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });

      // ✅ Dynamically add to chat list if the sender is new
      setChatList((prevChatList) => {
        if (!prevChatList.includes(newMessage.senderEmail) && newMessage.senderEmail !== userEmail) {
          return [...prevChatList, newMessage.senderEmail];
        }
        return prevChatList;
      });
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [userEmail, receiverEmail]); // ✅ Removed receiverEmail from dependencies

  // Fetch messages from API
  const fetchMessages = async () => {
    if (!receiverEmail) return;
    try {
      const res = await axios.get("http://localhost:9000/api/messages/get-message", {
        params: { senderEmail: userEmail, receiverEmail },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  // Fetch chat list from API
  const fetchChatList = async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/messages/get-chatlist", {
        params: { userEmail },
      });
      setChatList(res.data);
    } catch (err) {
      console.error("Error fetching chat list", err);
    }
  };

  // Send message function
  const sendMessage = async () => {
    if (!message || !receiverEmail) return;
    const newMessage = { senderEmail: userEmail, receiverEmail, message, timestamp: new Date() };

    try {
      await axios.post("http://localhost:9000/api/messages/send-message", newMessage);
      socket.emit("send-message", newMessage);

      setMessages((prevMessages) => [...prevMessages, newMessage]); // ✅ Instant UI update
      setMessage("");

      setChatList((prevChatList) => {
        if (!prevChatList.includes(receiverEmail)) {
          return [...prevChatList, receiverEmail];
        }
        return prevChatList;
      });
         // Scroll to bottom after sending
         scrollToBottom();
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  // Start a new chat
  const startNewChat = () => {
    if (!newEmail.trim()) return;
    if (!chatList.includes(newEmail)) {
      setChatList([...chatList, newEmail]);
    }
    setReceiverEmail(newEmail);
    setNewEmail("");
  };

    // Function to scroll messages to the bottom
    const scrollToBottom = () => {
        if (messageInputRef.current) {
            messageInputRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };


  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh", // Use 100vh to fill the screen
        backgroundColor: "#f3f3f3",
        flexDirection: isMobile ? "column" : "row", // Stack on mobile
      }}
    >
      {/* ✅ Chat List (Left Sidebar) */}
      <Box
        sx={{
          width: isMobile ? "100%" : "30%", // Full width on mobile
          backgroundColor: "#fff",
          borderRight: isMobile ? "none" : "1px solid #ccc", 
          borderBottom: isMobile ? "1px solid #ccc" : "none", // Add border bottom on mobile
          overflowY: "auto",
            // Reduce height to accommodate keyboard on mobile
            maxHeight: isMobile ? '30vh' : 'none',
        }}
      >
        <Typography variant="h6" sx={{ p: 2, backgroundColor: "#075e54", color: "#fff" }}>
          Chats
        </Typography>

        {/* ✅ Allow teachers to enter a new parent's email */}
        {isTeacher && (
          <Box sx={{ p: 2, display: "flex" }}>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Enter Parent's Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              sx={{ mr: 1 }}
            />
            <Button variant="contained" onClick={startNewChat}>
              Start
            </Button>
          </Box>
        )}

        <List>
          {chatList.map((email, index) => (
            <ListItem
              key={index}
              button
              onClick={() => setReceiverEmail(email)}
              sx={{
                backgroundColor: receiverEmail === email ? "#d3f4ff" : "inherit",
                borderBottom: "1px solid #ccc",
              }}
            >
              <ListItemText primary={email} />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* ✅ Chat Messages (Right Panel) */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#e5ddd5",
          width: isMobile ? "100%" : "70%", // Take remaining width
            // Adjust height to accommodate keyboard on mobile
            height: '100%',
        }}
      >
        <Typography variant="h6" sx={{ p: 2, backgroundColor: "#128c7e", color: "#fff" }}>
          {receiverEmail || "Select a chat"}
        </Typography>

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
              paddingBottom: '5rem', // Add padding to ensure last message isn't hidden
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                maxWidth: "80%", 
                alignSelf: msg.senderEmail === userEmail ? "flex-end" : "flex-start",
                backgroundColor: msg.senderEmail === userEmail ? "#dcf8c6" : "#fff",
                color: "black",
                borderRadius: "10px",
                p: 1.5,
                mb: 1,
                boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <Typography variant="body1">{msg.message}</Typography>
              <Typography
                variant="caption"
                sx={{ fontSize: "10px", display: "block", textAlign: "right", color: "gray" }}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>
          ))}
             <div ref={messageInputRef} />
        </Box>

        {/* ✅ Message Input */}
        <Box sx={{ display: "flex", p: 1, backgroundColor: "#fff", borderTop: "1px solid #ccc" }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ flex: 1, mr: 1 }}
          />
          <Button variant="contained" sx={{ backgroundColor: "#128c7e" }} onClick={sendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
