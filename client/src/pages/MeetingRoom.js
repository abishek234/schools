import { useState, useRef, useEffect } from "react";
import { Button, TextField, Box, Typography } from "@mui/material";
import io from "socket.io-client";

// Change this to your actual backend WebSocket server URL
const SOCKET_SERVER_URL = "http://localhost:8000";

const MeetingRoom = () => {
  const [meetingLink, setMeetingLink] = useState("");
  const [isMeetingValid, setIsMeetingValid] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [remoteStreams, setRemoteStreams] = useState([]);
  
  const videoRef = useRef(null);
  const peerConnections = useRef({});
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(SOCKET_SERVER_URL);

    socket.current.on("offer", async (offer, senderId) => {
      if (!peerConnections.current[senderId]) setupPeerConnection(senderId);
      await peerConnections.current[senderId].setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnections.current[senderId].createAnswer();
      await peerConnections.current[senderId].setLocalDescription(answer);
      socket.current.emit("answer", answer, senderId);
    });

    socket.current.on("answer", async (answer, senderId) => {
      await peerConnections.current[senderId].setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.current.on("ice-candidate", async (candidate, senderId) => {
      if (peerConnections.current[senderId]) {
        await peerConnections.current[senderId].addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    return () => socket.current.disconnect();
  }, []);

  const checkMeetingLink = async () => {
    if (meetingLink.startsWith("http://localhost:3000/meeting")) {
      setIsMeetingValid(true);
      setupPeerConnection("teacher");  // "teacher" is the first participant (you can use any unique ID)
    } else {
      setIsMeetingValid(false);
    }
  };

  const setupPeerConnection = async (userId) => {
    peerConnections.current[userId] = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerConnections.current[userId].ontrack = (event) => {
      setRemoteStreams((prevStreams) => [...prevStreams, event.streams[0]]);
    };

    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    videoRef.current.srcObject = stream;
    stream.getTracks().forEach((track) => peerConnections.current[userId].addTrack(track, stream));

    peerConnections.current[userId].onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("ice-candidate", event.candidate, userId);
      }
    };

    if (userId === "teacher") {
      // If it's the teacher, create an offer to invite the parent
      const offer = await peerConnections.current[userId].createOffer();
      await peerConnections.current[userId].setLocalDescription(offer);
      socket.current.emit("offer", offer, userId);
    }
  };

  const toggleVideo = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getVideoTracks()[0].enabled = !videoEnabled;
      setVideoEnabled(!videoEnabled);
    }
  };

  const toggleAudio = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      stream.getAudioTracks()[0].enabled = !audioEnabled;
      setAudioEnabled(!audioEnabled);
    }
  };

  return (
    <Box textAlign="center" p={3}>
      <Typography variant="h5">Join Meeting</Typography>
      <TextField
        label="Enter Meeting Link"
        variant="outlined"
        fullWidth
        sx={{ mt: 2 }}
        value={meetingLink}
        onChange={(e) => setMeetingLink(e.target.value)}
      />
      <Button variant="contained" onClick={checkMeetingLink} sx={{ mt: 2 }}>
        Join Meeting
      </Button>

      {isMeetingValid === false && (
        <Typography color="error" sx={{ mt: 2 }}>
          Invalid Meeting Link!
        </Typography>
      )}

      {isMeetingValid && (
        <Box mt={3}>
          <Typography variant="h6">Your Video</Typography>
          <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "600px" }} >
            <track kind="captions" />
            </video>
          <Box mt={2}>
            <Button variant="contained" onClick={toggleVideo} sx={{ mr: 2 }}>
              {videoEnabled ? "Hide Video" : "Show Video"}
            </Button>
            <Button variant="contained" onClick={toggleAudio}>
              {audioEnabled ? "Mute" : "Unmute"}
            </Button>
          </Box>
          {remoteStreams.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6">Remote Video</Typography>
              {remoteStreams.map((stream, index) => (
  <video
    key={index}
    ref={(ref) => {
      if (ref) {
        ref.srcObject = stream;
      }
    }}
    autoPlay
    playsInline
    style={{ width: "100%", maxWidth: "600px" }}
  >
    <track kind="captions" />
  </video>
))}

            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default MeetingRoom;
