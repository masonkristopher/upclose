import React from 'react';
import io from 'socket.io-client';

const SampleVidChat = () => {
  let isAlreadyCalling = false;
  let getCalled = false;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const existingCalls = [];
  const { RTCPeerConnection, RTCSessionDescription } = window;
  const peerConnection = new RTCPeerConnection();
  const socket = io.connect('localhost:8080');

  function unselectUsersFromList() {
    const alreadySelectedUser = document.querySelectorAll('.active-user.active-user--selected');
    alreadySelectedUser.forEach((el: Element) => {
      el.setAttribute('class', 'active-user');
    });
  }

  async function callUser(socketId: string) {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(offer));

    socket.emit('call-user', {
      offer,
      to: socketId,
    });
  }

  function createUserItemContainer(socketId: string) {
    const userContainerEl = document.createElement('div');

    const usernameEl = document.createElement('p');

    userContainerEl.setAttribute('class', 'active-user');
    userContainerEl.setAttribute('id', socketId);
    usernameEl.setAttribute('class', 'username');
    usernameEl.innerHTML = `Socket: ${socketId}`;

    userContainerEl.appendChild(usernameEl);

    userContainerEl.addEventListener('click', () => {
      // debugger;
      unselectUsersFromList();
      userContainerEl.setAttribute('class', 'active-user active-user--selected');
      const talkingWithInfo = document.getElementById('talking-with-info')!;
      talkingWithInfo.innerHTML = `Talking with: "Socket: ${socketId}"`;
      callUser(socketId);
    });

    return userContainerEl;
  }

  function updateUserList(socketIds: string[]) {
    const activeUserContainer = document.getElementById('active-user-container')!;

    socketIds.forEach(socketId => {
      const alreadyExistingUser = document.getElementById(socketId);
      if (!alreadyExistingUser) {
        const userContainerEl = createUserItemContainer(socketId);
        activeUserContainer.appendChild(userContainerEl);
      }
    });
  }

  socket.on('update-user-list', ({ users }: any) => {
    updateUserList(users);
  });

  socket.on('remove-user', ({ socketId }: { socketId: string }) => {
    const elToRemove = document.getElementById(socketId);
    if (elToRemove) {
      elToRemove.remove();
    }
  });

  socket.on('call-made', async (data: any) => {
    if (getCalled) {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const confirmed = confirm(`User "Socket: ${data.socket}" wants to call you. Do accept this call?`);
      if (!confirmed) {
        socket.emit('reject-call', {
          from: data.socket,
        });
        return;
      }
    }
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
    socket.emit('make-answer', {
      answer,
      to: data.socket,
    });
    getCalled = true;
  });

  socket.on('answer-made', async (data: any) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    if (!isAlreadyCalling) {
      callUser(data.socket);
      isAlreadyCalling = true;
    }
  });

  socket.on('call-rejected', (data: any) => {
    // eslint-disable-next-line no-alert
    alert(`User: "Socket: ${data.socket}" rejected your call.`);
    unselectUsersFromList();
  });

  peerConnection.ontrack = ({ streams: [stream] }) => {
    const remoteVideo = document.getElementById('remote-video') as HTMLMediaElement;
    if (remoteVideo) {
      remoteVideo.srcObject = stream;
    }
  };

  navigator.getUserMedia(
    { video: true, audio: true },
    (stream) => {
      const localVideo = document.getElementById('local-video') as HTMLMediaElement;
      if (localVideo) {
        localVideo.srcObject = stream;
      }
    },
    (error) => console.warn(error.message),
  );

  return (
    <div className="container">
      {/* <header className="header">
        <div className="logo-container">
          <img src="./img/doge.png" alt="doge logo" className="logo-img" />
          <h1 className="logo-text">
            Doge
            <span className="logo-highlight">ller</span>
          </h1>
        </div>
      </header> */}
      <div className="content-container">
        <div className="active-users-panel" id="active-user-container">
          <h3 className="panel-title">Active Users:</h3>
        </div>
        <div className="video-chat-container">
          <h2 className="talk-info" id="talking-with-info">
            Select active user on the left menu.
          </h2>
          <div className="video-container">
            <video autoPlay className="remote-video" id="remote-video">
              <track default kind="captions" srcLang="en" />
            </video>
            <video autoPlay muted className="local-video" id="local-video" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleVidChat;
