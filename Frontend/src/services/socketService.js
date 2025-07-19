import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this._socket = null;
        this._connected = false;
        this._queue = [];
    }

    get socket() {
        return this._socket;
    }

    get isConnected() {
        return this._connected;
    }

    connect(token) {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

        // If already connected, disconnect and reconnect with new token
        if (this._socket) {
            this._socket.disconnect();
            this._socket = null;
            this._connected = false;
        }

        this._socket = io(BACKEND_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000
        });

        this._setupBaseListeners();
        // Process any queued event listeners
        this._processQueue();
    }

    _setupBaseListeners() {
        this._socket.on('connect', () => {
            console.log('Socket connected');
            this._connected = true;
            this._emitQueuedMessages();
        });

        this._socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            this._connected = false;
        });

        this._socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            if (error.message === 'Authentication failed') {
                this.disconnect();
            }
        });
    }

    disconnect() {
        if (this._socket) {
            this._socket.disconnect();
            this._socket = null;
            this._connected = false;
            this._queue = [];
        }
    }

    // Enhanced event handling
    on(event, callback) {
        if (this._socket) {
            this._socket.on(event, callback);
        }
        // Queue the listener if socket isn't ready
        this._queue.push({ type: 'on', event, callback });
    }

    off(event, callback) {
        if (this._socket) {
            this._socket.off(event, callback);
        }
        // Remove from queue if present
        this._queue = this._queue.filter(item => 
            !(item.type === 'on' && item.event === event && item.callback === callback)
        );
    }

    // Enhanced message emission with queueing
    emit(event, data) {
        if (this._socket && this._connected) {
            this._socket.emit(event, data);
            return true;
        }
        // Queue the message if socket isn't ready
        this._queue.push({ type: 'emit', event, data });
        return false;
    }

    _processQueue() {
        const listeners = this._queue.filter(item => item.type === 'on');
        listeners.forEach(({ event, callback }) => {
            this._socket.on(event, callback);
        });
    }

    _emitQueuedMessages() {
        const messages = this._queue.filter(item => item.type === 'emit');
        messages.forEach(({ event, data }) => {
            this._socket.emit(event, data);
        });
        // Clear emitted messages from queue
        this._queue = this._queue.filter(item => item.type !== 'emit');
    }

    joinDebate(debateId) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }
        this.socket.emit('joinDebate', { debateId });
    }

    leaveDebate(debateId) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }
        this.socket.emit('leaveDebate', { debateId });
    }

    sendMessage(debateId, message) {
        if (!this.socket?.connected) {
            throw new Error('Socket not connected');
        }
        this.socket.emit('sendMessage', { debateId, message });
    }

    onNewMessage(callback) {
        this.socket?.on('newMessage', callback);
    }

    onDebateStatusUpdate(callback) {
        this.socket?.on('debateStatusUpdate', callback);
    }

    onUserJoined(callback) {
        this.socket?.on('userJoined', callback);
    }

    onUserLeft(callback) {
        this.socket?.on('userLeft', callback);
    }

    removeAllListeners() {
        if (this.socket) {
            this.socket.removeAllListeners();
        }
    }
}

export const socketService = new SocketService();
