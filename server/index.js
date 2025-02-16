const express = require('express'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const messageRoutes = require('./routes/messageRoutes');
const Message = require("./models/Message");

const { Server } = require("socket.io");
const io = new Server(8000, {
  cors: {
    origin: "http://localhost:3000", // Allow only frontend running at this origin
    methods: ["GET", "POST"]
  }
});



io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (email) => {
    socket.join(email); // Each user joins a room with their email
  });

  socket.on("send-message", async ({ senderEmail, receiverEmail, message }) => {
    const newMessage = new Message({ senderEmail, receiverEmail, message });
    await newMessage.save();
    io.to(receiverEmail).emit("receive-message", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});



const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.send('Backend server is running');
});




app.use('/api/admins', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/superAdmins', superAdminRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/videos',videoRoutes);
app.use('/api/timetables',timetableRoutes);
app.use('/api/attendances',attendanceRoutes); 
app.use('/api/assessments',assessmentRoutes);
app.use('/api/messages',messageRoutes);


const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});