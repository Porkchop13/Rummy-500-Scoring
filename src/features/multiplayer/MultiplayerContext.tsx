import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const MultiplayerContext = createContext(null);

export const useMultiplayer = () => {
  return useContext(MultiplayerContext);
};

export const MultiplayerProvider = ({ children }) => {
  const [peers, setPeers] = useState([]);
  const [gameState, setGameState] = useState(null);
  const socketRef = useRef();
  const peerConnections = useRef({});

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('Connected to signaling server');
    });

    socketRef.current.on('offer', handleReceiveOffer);
    socketRef.current.on('answer', handleReceiveAnswer);
    socketRef.current.on('ice-candidate', handleNewICECandidateMsg);

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleReceiveOffer = (offer) => {
    const peerConnection = createPeerConnection(offer.sender);
    peerConnections.current[offer.sender] = peerConnection;

    peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    peerConnection.createAnswer().then((answer) => {
      peerConnection.setLocalDescription(answer);
      socketRef.current.emit('answer', { answer, to: offer.sender });
    });
  };

  const handleReceiveAnswer = (answer) => {
    const peerConnection = peerConnections.current[answer.sender];
    peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  const handleNewICECandidateMsg = (msg) => {
    const candidate = new RTCIceCandidate(msg.candidate);
    const peerConnection = peerConnections.current[msg.sender];
    peerConnection.addIceCandidate(candidate);
  };

  const createPeerConnection = (peerId) => {
    const peerConnection = new RTCPeerConnection();

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('ice-candidate', { candidate: event.candidate, to: peerId });
      }
    };

    peerConnection.ondatachannel = (event) => {
      const receiveChannel = event.channel;
      receiveChannel.onmessage = handleReceiveMessage;
    };

    const dataChannel = peerConnection.createDataChannel('gameState');
    dataChannel.onmessage = handleReceiveMessage;

    return peerConnection;
  };

  const handleReceiveMessage = (event) => {
    const message = JSON.parse(event.data);
    setGameState(message);
  };

  const connectToPeer = (peerId) => {
    const peerConnection = createPeerConnection(peerId);
    peerConnections.current[peerId] = peerConnection;

    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer);
      socketRef.current.emit('offer', { offer, to: peerId });
    });
  };

  const sendGameState = (state) => {
    setGameState(state);
    Object.values(peerConnections.current).forEach((peerConnection) => {
      const dataChannel = peerConnection.dataChannels[0];
      dataChannel.send(JSON.stringify(state));
    });
  };

  return (
    <MultiplayerContext.Provider value={{ peers, gameState, connectToPeer, sendGameState }}>
      {children}
    </MultiplayerContext.Provider>
  );
};
