import React from "react";
import socketio from "socket.io-client";
import {socketLocal, socketLive} from "../config/apiUrl";

export const socket = socketio.connect(socketLocal);
// export const socket = socketio.connect(socketLive);
export const SocketContext = React.createContext();
