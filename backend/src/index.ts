import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { scrape, getChunks } from './services/scraper';
import { generateResponse } from './services/openaiService';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let chunksIndex : number = 0;
let markdown : string[] = [];

io.on('connection', (socket: Socket) => {
  console.log('Client Connected:', socket.id);
  
  let urlAtual: string | null = null;

  // Event to process a new URL
  socket.on('processUrl', async (url: string) => {
    console.log(`Received URL: ${url}`);
    urlAtual = url;
    chunksIndex = 0;
    markdown = await scrape(url);
    const markdownContent = getChunks(markdown, chunksIndex);
    if (markdownContent) {
      const responseJson = await generateResponse(markdownContent);
      if (responseJson) {
        socket.emit('jsonData', responseJson);
      }else{
        socket.emit('error', 'gpt');}
    }else{
      socket.emit('error', 'URL');
    }
     
  });

  // Event to get more data(products) from the current URL
  socket.on('getMoreData', async () => {
    if (urlAtual) {
      console.log(`Solicitado mais dados para: ${urlAtual}`);
      chunksIndex+=5;
      const markdownContent = await getChunks(markdown, chunksIndex);
      if (markdownContent) {
        var responseJson = await generateResponse(markdownContent);
        if (responseJson) {
          socket.emit('jsonData', responseJson);
        }else{
          socket.emit('error', 'gpt');
        }
      } else {
        socket.emit('error', 'noData');
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client desconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server running in port 3000');
});


// const url = 'https://www.bollandbranch.com/collections/pillows-protectors/?direction=next&cursor=eyJsYXN0X2lkIjo3MzI0NTA2Njg1NDk5LCJsYXN0X3ZhbHVlIjoyMn0%3D';
// const url = 'https://www.glossier.com/';
// const url = 'https://carletonequipment.com/collections/used-equipment';
// const url = 'https://www.thesill.com/'