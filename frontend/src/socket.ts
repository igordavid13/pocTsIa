import { io, Socket } from 'socket.io-client';

export const socket: Socket = io('http://localhost:3000');

export const sendUrl = (url: string) => {
  console.log(`Sending URL: ${url}`);
  socket.emit('processUrl', url);
};

export const requestMoreData = () => {
  console.log('Getting more data...');
  socket.emit('getMoreData');
};
