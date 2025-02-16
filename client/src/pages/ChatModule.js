import Chat from "../sections/chat/Chat";

export default function ChatModule () {
  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole"); // teacher or parent

  return <Chat userEmail={userEmail} isTeacher={userRole === "teacher"} />;
};


