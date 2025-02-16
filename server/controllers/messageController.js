const Message = require("../models/Message");

// ✅ Send Message
exports.sendMessage = async (req, res) => {
  const { senderEmail, receiverEmail, message } = req.body;

  try {
    const newMessage = new Message({ senderEmail, receiverEmail, message });
    await newMessage.save();
    
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Error sending message" });
  }
};

// ✅ Get Messages Between Two Users
exports.getMessages = async (req, res) => {
  const { senderEmail, receiverEmail } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { senderEmail, receiverEmail },
        { senderEmail: receiverEmail, receiverEmail: senderEmail },
      ],
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};

// ✅ Get Chat List for User (Teachers & Parents)
exports.getChatList = async (req, res) => {
  const { userEmail } = req.query;

  try {
    const sentMessages = await Message.find({ senderEmail: userEmail }).distinct("receiverEmail");
    const receivedMessages = await Message.find({ receiverEmail: userEmail }).distinct("senderEmail");

    const chatList = [...new Set([...sentMessages, ...receivedMessages])];

    res.json(chatList);
  } catch (err) {
    res.status(500).json({ error: "Error fetching chat list" });
  }
};
