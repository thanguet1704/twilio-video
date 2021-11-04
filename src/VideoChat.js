import React, { useState, useCallback, useEffect } from "react";
import Video from "twilio-video";
import { axiosClient } from './config/axiosConfig';
import Lobby from "./Lobby";
import Room from "./Room";

const VideoChat = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [statusRecording, setStatusRecording] = useState('start');

  const handleUsernameChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const handleRoomNameChange = useCallback((event) => {
    setRoomName(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setConnecting(true);
      const data = await axiosClient.post('/token', {
        identity: username,
        room: roomName,
      });

      Video.connect(data.token, {
        name: roomName,
      })
        .then((room) => {
          setConnecting(false);
          setRoom(room);
        })
        .catch((err) => {
          console.error(err);
          setConnecting(false);
        });
    },
    [roomName, username]
  );

  const handleLogout = useCallback(() => {
    setRoom((prevRoom) => {
      if (prevRoom) {
        prevRoom.localParticipant.tracks.forEach((trackPub) => {
          trackPub.track.stop();
        });
        prevRoom.disconnect();
      }
      return null;
    });
  }, []);

  const handleRecording = useCallback(() => {
    axiosClient.get('/recording', { params: { room: roomName, status: statusRecording }}).then(res => {
      if (statusRecording === 'start') {
        setStatusRecording('stop');
      } else {
        setStatusRecording('start');
      }
    });
  }, [statusRecording]);

  useEffect(() => {
    if (room) {
      const tidyUp = (event) => {
        if (event.persisted) {
          return;
        }
        if (room) {
          handleLogout();
        }
      };
      window.addEventListener("pagehide", tidyUp);
      window.addEventListener("beforeunload", tidyUp);
      return () => {
        window.removeEventListener("pagehide", tidyUp);
        window.removeEventListener("beforeunload", tidyUp);
      };
    }
  }, [room, handleLogout]);

  let render;
  if (room) {
    render = (
      <Room roomName={roomName} room={room} handleLogout={handleLogout} handleRecording={handleRecording}/>
    );
  } else {
    render = (
      <Lobby
        username={username}
        roomName={roomName}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmit={handleSubmit}
        connecting={connecting}
        handleRecording={handleRecording}
      />
    );
  }
  return render;
};

export default VideoChat;
