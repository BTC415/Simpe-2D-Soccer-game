export const ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  // { urls: 'stun:stunserver.org:3478' },
  // { urls: 'turn:turn01.hubl.in?transport=udp', credential: 'a', username: 'a' },
  {
    urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
    credential: 'webrtc',
    username: 'webrtc',
  },
];
