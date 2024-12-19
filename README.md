# Voice Transmission App

This project is a web application for live transmission of voice using WebRTC technology. It allows users to connect and communicate in real-time through audio streaming.

## Project Structure

```
voice-transmission-app
├── public
│   ├── index.html        # Main HTML document
│   └── styles.css       # Styles for the web application
├── src
│   ├── app.js           # WebRTC connection logic
│   ├── client.js        # WebSocket client management
│   └── signaling.js     # WebSocket signaling server
├── package.json         # npm configuration file
├── README.md            # Project documentation
└── server.js            # Entry point for the server-side application
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd voice-transmission-app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Start the server:**
   ```
   node server.js
   ```

4. **Open your browser:**
   Navigate to `http://localhost:8080` to access the application.

## Usage

- Once the application is running, multiple users can connect to the server.
- Users can transmit their voice in real-time by allowing microphone access.
- The application will handle the signaling process for establishing peer-to-peer connections.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.