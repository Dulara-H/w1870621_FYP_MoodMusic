# MoodTunes - Complete Viva Preparation Guide

**Project**: Mood-Based Music Recommendation System (MoodTunes)  
**Author**: [Your Name]  
**Date**: May 2026  
**Institution**: [University Name]

---

## TABLE OF CONTENTS

1. **PART 1**: Full Project Overview
2. **PART 2**: Backend Explanation (Files & Code)
3. **PART 3**: Backend Data Flows
4. **PART 4**: Frontend Explanation (Files & Code)
5. **PART 5**: Frontend Data Flows
6. **PART 6**: Core Algorithm Explanation
7. **PART 7**: Database Schema Explanation
8. **PART 8**: Security Implementation
9. **PART 9**: Complete API Endpoint Table
10. **PART 10**: Testing Methodology
11. **PART 11**: Deployment Strategy
12. **PART 12**: Viva Q&A (50+ Questions)

---

# PART 1: FULL PROJECT OVERVIEW

## 1. What This Project Does

**MoodTunes** is a full-stack web application that generates personalized music recommendations based on users' emotional states (mood), language preferences, and favorite genres. 

Users select their current mood (e.g., "Sad", "Happy", "Energetic"), and the system returns music from YouTube tailored to match or improve that mood. The app offers two recommendation modes:
- **Match My Vibe**: Plays music matching your current mood exactly
- **Lift My Spirits**: Gradually transitions your mood upward through 3 stages

Users can create playlists, favorite songs, search for music, and manage their library.

## 2. What Problem It Solves

**Problem**: Music streaming relies on popularity-based algorithms that don't consider emotional context. Users must manually search for mood-specific playlists.

**Solution**: MoodTunes automates mood-aware music discovery:
- No more scrolling through generic playlists
- Emotion-regulation algorithm assists mental wellness
- Save curated collections for future use
- Discover new music in language/genre preferences
- Create a "Favorites" library instantly

## 3. The Main User Journey

```
New User
  ↓
[Register/Google Login] → Create account → Default "Favorites" playlist created
  ↓
[Home Page] → Select Mood, Language, Genre → Click "Generate My Playlist"
  ↓
[Choose Mode] → "Match My Vibe" or "Lift My Spirits" (modal opens)
  ↓
[View Results] → 10-14 songs displayed (3 stages if "Lift")
  ↓
[Play Song] → YouTube IFrame player starts → 30-second preview for guests
  ↓
[Save or Continue] → Heart icon to add to Favorites → OR Save full collection to Library
  ↓
[Discover Page] → Free-form search for any music → Add songs to custom playlists
  ↓
[Library] → Manage playlists → Play playlists → Edit names → Remove songs
  ↓
[Profile] → Change password → View account info
```

## 4. Technologies Used and Why

| Technology | Purpose | Why Chosen |
|---|---|---|
| **React 19** | Frontend UI library | Component-based, fast rendering, large ecosystem |
| **Vite** | Build tool & dev server | 10x faster than Webpack, ES modules native |
| **Tailwind CSS** | Styling | Utility-first, faster development, modern design |
| **React Router v7** | Client-side routing | Declarative navigation, protected routes |
| **React Context API** | State management | Lightweight, built-in, perfect for this scale |
| **Axios** | HTTP client | Promise-based, interceptor support |
| **Node.js + Express** | Backend server | Non-blocking I/O, JavaScript on server |
| **MongoDB** | Database | Document-oriented, flexible schema, Mongoose ODM |
| **Mongoose** | ODM (Object Document Mapper) | Schema validation, easy relationships |
| **bcryptjs** | Password hashing | Industry standard, salt-based security |
| **JWT (jsonwebtoken)** | Authentication | Stateless, token-based, scalable |
| **Google OAuth 2.0** | Google login | Industry-standard, 1 million+ users trust it |
| **YouTube Data API v3** | Music search | Massive catalog, free tier available |
| **YouTube IFrame Player API** | Music playback | Embedded player, no licensing needed |
| **react-hot-toast** | Notifications | Non-intrusive, modern toast library |
| **Lucide React** | Icons | Beautiful, lightweight SVG icons |

---

## 5. How Frontend, Backend, Database, and APIs Connect

### Data Flow Diagram (Text Version)

```
┌──────────────────────────────────────────────────────────────────────┐
│                         MOODTUNES ARCHITECTURE                       │
└──────────────────────────────────────────────────────────────────────┘

                           FRONTEND (React)
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
              Axios │            │            │ YouTube IFrame
                    │            │            │
                    ↓            │            ↓
              ┌──────────────────────────────────┐
              │    Express Backend Server        │
              │    (Node.js on port 5000)        │
              └──────────────────────────────────┘
                    │         │         │
         ┌──────────┼─────────┼─────────┼──────────┐
         │          │         │         │          │
         ↓          ↓         ↓         ↓          ↓
      Routes    Models    Controllers Middleware  Config
      /auth     /User     registerUser authMidd   /db.js
      /music    /Playlist loginUser                
      /playlists          getRecommend
                          addSongToPlaylist
                    
                    │         │         │
         ┌──────────┼─────────┼─────────┼──────────┐
         │          │         │         │          │
         ↓          ↓         ↓         ↓          ↓
      MongoDB   Google    YouTube   Third-party  Environment
      (Data)    OAuth     Data API    APIs       Variables
               (Auth)    (Search)

```

### Request-Response Cycle (Example: Generate Playlist)

```
User selects mood/genre on Home.jsx
     ↓ (clicks "Generate My Playlist" button)
Frontend: setLoading(true)
     ↓
Axios POST to http://localhost:5000/api/music/recommend
     ↓ (includes mood, language, genre, mode in request body)
Backend: Express route /api/music/:recommend handler triggers
     ↓
Controller: musicController.js → getRecommendation() function
     ↓
Decision Logic:
     ├─ If mode="match" → fetch 1-stage results (10 songs)
     └─ If mode="lift" → fetch 3-stage results (14 songs total)
     ↓
YouTube API Calls (3 parallel requests):
   1. searchUrl → searches by mood keywords
   2. Fetches exact video duration
   3. Filters out Shorts (under 60 seconds)
     ↓
Results formatted with: videoId, title, artist, image, stage
     ↓
Backend: res.json(videoResults) ← Returns array of songs
     ↓
Frontend: setGeneratedSongs(res.data)
     ↓
Frontend: UI updates → TrackCarousel components render results
     ↓
User sees beautiful scrollable collection → clicks Play
     ↓
PlayerContext.playSong(song, generatedSongs) → loads YouTube IFrame
     ↓
YouTube player plays music
```

---

## 6. Full System Architecture (Simple Explanation)

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION TIER                               │
│                      (React Frontend)                                │
│                                                                       │
│  User Interface:  Home | Discover | Library | Profile               │
│  - Home: Generate playlists                                         │
│  - Discover: Search music                                           │
│  - Library: Manage saved collections                                │
│  - Profile: Account settings                                        │
│                                                                       │
│  Components: Sidebar, Player, Modals, Cards                         │
│  State Management: React Context (PlayerContext, SidebarContext)   │
│  HTTP Client: Axios (talks to backend)                             │
│  Authentication: localStorage (token storage)                       │
└────────────────────────────────────────────────────────────────────┘
                                ↓
                  Axios HTTP Requests (JSON)
                         /api/auth/*
                         /api/music/*
                         /api/playlists/*
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC TIER                             │
│                      (Express Backend)                               │
│                                                                       │
│  Routes:                                                             │
│  - /api/auth: registerUser, loginUser, googleLogin                 │
│  - /api/music: getRecommendation, savePlaylist, getHistory         │
│  - /api/playlists: CRUD operations                                 │
│                                                                       │
│  Controllers: Handle business logic                                 │
│  - authController: User registration, login, password reset         │
│  - musicController: Recommendation algorithm (Match/Lift)          │
│  - playlistController: Playlist management                         │
│                                                                       │
│  Middleware:                                                         │
│  - authMiddleware: JWT verification                                 │
│  - cors: Cross-origin requests                                     │
│  - express.json(): Body parsing                                    │
│                                                                       │
│  External Services:                                                  │
│  - Google OAuth: User authentication                               │
│  - YouTube API: Music search & metadata                            │
└────────────────────────────────────────────────────────────────────┘
                                ↓
                    Mongoose Queries (ODM)
                         User.find()
                         Playlist.save()
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE TIER                           │
│                      (MongoDB Database)                              │
│                                                                       │
│  Collections:                                                        │
│  - users: { _id, username, email, password, googleId, avatar }    │
│  - playlists: { _id, user, name, songs[], isFavorites, createdAt } │
│  - songs (embedded): { videoId, title, artist, image, addedAt }   │
│                                                                       │
│  Relationships:                                                      │
│  - 1 User → Many Playlists (via user._id reference)               │
│  - 1 Playlist → Many Songs (embedded documents)                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 7. How to Explain the Whole System in a Viva

### **Viva Answer: "Explain how your system works from start to finish"**

**Good Answer (2-3 minutes)**:

---

"MoodTunes is a mood-based music recommendation system using a three-tier architecture:

**Presentation Tier (Frontend - React)**
The user opens the web app built with React and Vite. They select their mood (e.g., 'Sad'), language preference (e.g., 'English'), and genre (e.g., 'Lo-fi'). On the Home page, I use React state variables with `useState` to store these selections. When they click 'Generate My Playlist', the app opens a modal asking them to choose between two modes:
1. **Match My Vibe**: Show me music matching my current mood
2. **Lift My Spirits**: Gradually improve my mood through 3 stages

**Business Logic Tier (Backend - Express.js)**
The frontend sends an Axios POST request to `/api/music/recommend` with the mood, language, genre, and mode in the request body. My Express server receives this at the musicController. 

If the mode is 'lift' (improve mood), I use a **transition matrix** - a JavaScript object that defines emotional pathways. For example, if the user is 'Sad', the target journey is: Sad → Calm → Happy. My controller then makes 3 sequential calls to the YouTube Data API:
1. First stage: Search for "English Sad Lo-fi" songs
2. Second stage: Search for "English Calm Lo-fi" songs
3. Third stage: Search for "English Happy Lo-fi" songs

If the mode is 'match', I just search once for the mood directly.

I filter out YouTube Shorts (videos under 60 seconds) by checking the video duration metadata, ensuring only full songs are returned.

**Data Persistence Tier (MongoDB)**
All user data (username, email, hashed password) is stored in MongoDB using Mongoose. When users create playlists, I save them to the database with a reference to their user ID. Songs are embedded as subdocuments inside each playlist document.

**Integration with External APIs**
- **Google OAuth**: For social login, I verify the Google token with the Google Auth Library and either create a new user or log them in.
- **YouTube Data API**: I search for videos and get metadata (title, duration, thumbnail).
- **YouTube IFrame Player**: The frontend loads this JavaScript API, which embeds a player and plays the music.

**Return to Frontend**
The backend sends back a JSON array of songs. The frontend receives this in the Home.jsx component, stores it in `generatedSongs` state, and renders beautiful scrollable cards. Users can click play to start music, or save the collection to their library.

That's the full cycle from mood selection to music playback."

---

This explanation covers all key components in a logical order. Examiners love this structure because it shows you understand the entire flow.

---

# PART 2: BACKEND EXPLANATION FIRST

## Backend Architecture Overview

The backend is organized as:
```
server/
  ├─ server.js           (Entry point, Express app setup)
  ├─ config/
  │  └─ db.js            (MongoDB connection)
  ├─ models/
  │  ├─ User.js          (Schema for users)
  │  └─ Playlist.js      (Schema for playlists with embedded songs)
  ├─ middleware/
  │  └─ authMiddleware.js (JWT verification)
  ├─ routes/
  │  ├─ auth.js          (Login, register, OAuth)
  │  ├─ music.js         (Recommendation & search)
  │  └─ playlists.js     (Playlist CRUD)
  └─ controllers/
     ├─ authController.js     (Auth business logic)
     ├─ musicController.js    (Music recommendation algorithm)
     └─ playlistController.js (Playlist operations)
```

---

## FILE 1: server.js

### Purpose
This is the entry point of the entire backend. It initializes Express, connects to MongoDB, sets up middleware, and defines route handlers.

### Line-by-Line Explanation

```javascript
require("dotenv").config();
```
- Loads environment variables from a `.env` file into `process.env`
- Needed for: `MONGO_URI`, `JWT_SECRET`, `YOUTUBE_API_KEY`, `PORT`
- Why: Never hardcode secrets; use environment variables for security

```javascript
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
```
- **express**: Web framework for handling HTTP requests
- **cors**: Middleware to allow cross-origin requests (frontend on Vercel calling backend on Render)
- **connectDB**: Function from config/db.js that connects to MongoDB

```javascript
connectDB();
```
- Immediately calls the connection function
- If connection fails, the server exits (process.exit(1))

```javascript
const app = express();
```
- Creates the Express application instance
- This `app` object will handle all HTTP requests

```javascript
app.use(express.json());
```
- Middleware that parses incoming request bodies as JSON
- Without this, req.body would be undefined

```javascript
app.use(
  cors({
    origin: ["https://mood-music-steel.vercel.app", "http://localhost:5173"],
  }),
);
```
- CORS middleware: Allows requests ONLY from these two origins
- **Production URL** (Vercel): https://mood-music-steel.vercel.app
- **Development URL** (Vite dev server): http://localhost:5173
- Without this, browser would block requests (CORS error)

```javascript
app.use("/api/auth", require("./routes/auth"));
app.use("/api/music", require("./routes/music"));
app.use("/api/playlists", require("./routes/playlists"));
```
- Mounts route handlers at specific paths
- Any request to `/api/auth/*` goes to routes/auth.js
- This keeps code organized

```javascript
const PORT = process.env.PORT || 5000;
```
- Gets PORT from environment variable, defaults to 5000
- On Render, PORT is automatically set; locally it's 5000

```javascript
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```
- Starts the HTTP server
- Listens for incoming requests on the specified port
- Logs confirmation message

### How This File Connects to Others

```
server.js
├─ imports connectDB() from config/db.js
├─ imports routes from routes/auth.js
├─ imports routes from routes/music.js
├─ imports routes from routes/playlists.js
└─ serves as the entry point that runs all code
```

### Viva Explanation

"Server.js is the entry point of my backend. It initializes Express, loads environment variables, connects to MongoDB, sets up CORS for the frontend, and mounts all route handlers. When the application starts, this file runs first and keeps the server listening on a port."

### Viva Questions & Answers

**Q1: Why do we need dotenv?**
A: To keep sensitive information (database URI, API keys, JWT secrets) out of the codebase. We store them in a `.env` file that's never committed to version control.

**Q2: What is CORS and why is it needed?**
A: CORS (Cross-Origin Resource Sharing) is a security feature browsers enforce. It prevents websites from making requests to other domains without permission. I explicitly allow my frontend URL so it can call my backend API.

**Q3: What would happen if you didn't parse JSON with express.json()?**
A: The req.body would be undefined. Frontend sends JSON data, but Express wouldn't automatically parse it. You'd have to manually read the request stream.

**Q4: Can you explain the route mounting (app.use)?**
A: When a request comes in to `/api/auth/register`, Express matches it against `/api/auth` and passes it to routes/auth.js. The router there matches `/register` and executes that handler. It's a hierarchical routing system.

**Q5: What happens if we don't set CORS correctly?**
A: The browser blocks the request with a CORS error: "Access to XMLHttpRequest... blocked by CORS policy". The frontend can't communicate with the backend even though both are working fine.

---

## FILE 2: config/db.js

### Purpose
Handles MongoDB connection initialization using Mongoose.

### Code Explanation

```javascript
const mongoose = require("mongoose");
const dns = require("dns");

const connectDB = async () => {
```
- `async` because connecting to a remote database is asynchronous
- Will take time and we need to `await` the connection

```javascript
  try {
    // Force Node DNS resolver to use a public DNS server
    try {
      dns.setServers(["8.8.8.8"]);
    } catch (e) {
      // non-fatal
    }
```
- **Problem**: Some corporate/school networks block UDP queries that MongoDB's driver needs
- **Solution**: Override the DNS resolver to use Google's public DNS (8.8.8.8)
- **Why try/catch**: If this fails, it's not critical; we continue anyway

```javascript
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
```
- **Connects** to MongoDB using the URI from environment variables
- Example: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
- **Awaits** the promise; execution pauses until connected or error
- **Logs** the hostname if successful

```javascript
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
```
- If connection fails, log the error and exit the process
- `process.exit(1)` means "exit with error code 1"
- Without this, the app would run but crash when it tries to query the database

```javascript
module.exports = connectDB;
```
- Exports the function so server.js can import and call it

### How This Connects

```
server.js calls connectDB()
    ↓
connectDB() connects to MongoDB
    ↓
Returns connection object to server.js
    ↓
server.js continues setup if connection successful
    OR
server.js stops if connection fails
```

### Viva Explanation

"Config/db.js is responsible for establishing the connection between my Node.js backend and MongoDB Atlas (cloud database). It uses Mongoose, which provides a nice abstraction layer over MongoDB's native driver. The function is async because database operations are non-blocking. It also handles DNS issues that can occur in certain network environments."

### Viva Questions

**Q1: Why use MongoDB instead of a relational database like SQL?**
A: MongoDB is document-oriented and flexible. I can embed songs directly inside playlists as subdocuments, making queries simpler. No need for complex joins.

**Q2: What's the difference between Mongoose and MongoDB driver?**
A: Mongoose is an ODM (Object Document Mapper) that sits on top of the MongoDB driver. It provides schema validation, middleware, and a nice query interface. The raw driver is lower-level.

**Q3: How does connection pooling work?**
A: MongoDB driver automatically maintains a pool of connections. When a request needs the DB, it reuses a connection from the pool instead of creating a new one each time. This is much faster.

**Q4: What happens if the database goes offline?**
A: The backend will crash (process.exit(1)) because the app can't function without data persistence. In production, you'd use a health check to reconnect.

**Q5: Why use MongoDB Atlas instead of local MongoDB?**
A: Atlas is cloud-hosted, always available, has automatic backups, scales easily, and I don't have to manage the server myself.

---

## FILE 3: models/User.js

### Purpose
Defines the schema for user documents in MongoDB. Every registered user has a User document with fields like email, username, password hash, and optional Google info.

### Code Explanation

```javascript
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
```
- Creates a new Mongoose schema (a blueprint for documents)
- Every user document in the `users` collection will follow this structure

```javascript
  username: { type: String, required: true },
```
- **Field**: `username`
- **Type**: String (text)
- **Required**: true (can't save a user without a username)
- Used for display (appears in Profile, Library cards)

```javascript
  email: { type: String, required: true, unique: true },
```
- **Unique**: true (no two users can have the same email)
- MongoDB creates an index on this field for fast lookups during login
- Required field

```javascript
  password: { type: String }, // Optional for Google users
```
- **NO `required: true`** because Google OAuth users don't have passwords
- If user registered with email/password, this is a bcrypt hash (64 characters)
- If user registered with Google, this field might be empty (or contain dummy hash)

```javascript
  googleId: { type: String },
```
- Google's unique user ID (e.g., "104857362897362...")
- Only populated if user logged in via Google
- Lets us check if a Google account already exists in our DB

```javascript
  avatar: { type: String, default: "" },
```
- URL to user's profile picture
- For Google users, this is the profile photo from Google
- Defaults to empty string if not provided

```javascript
  // New Fields for Password Reset
  resetPasswordToken: String,
  resetPasswordExpire: Date,
```
- **resetPasswordToken**: Hashed token sent to user's email
- **resetPasswordExpire**: When the token expires (typically 10 minutes)
- Both are empty until user requests a password reset
- When token is used and password is updated, these are cleared

```javascript
  createdAt: { type: Date, default: Date.now },
```
- Automatically set to current date/time when user is created
- `Date.now` is a function that returns current timestamp
- Used for sorting (newest users first)

```javascript
module.exports = mongoose.model("User", UserSchema);
```
- Registers schema with MongoDB as a model
- Creates a `users` collection
- Exports the model so controllers can use `User.findOne()`, `User.save()`, etc.

### How This Connects

```
authController.js uses this model:
  const user = new User({ username, email, password });
  await user.save();
  await User.findOne({ email });
  await User.findById(req.user.id);
```

### Viva Explanation

"The User model defines the structure of user documents in MongoDB. Every user has a username, email, password (if registered normally), and optional Google authentication details. The schema enforces that each email is unique, preventing duplicate registrations. Password reset fields are temporary and cleared after a successful reset."

### Viva Questions

**Q1: Why is the password optional?**
A: Because I support two login methods: email/password and Google OAuth. Google users don't need a password; they authenticate through Google instead.

**Q2: Why use bcrypt hash instead of storing plain passwords?**
A: Never store plain passwords. If the database is hacked, attackers get passwords. bcrypt creates a one-way hash; even I (as admin) can't see user passwords.

**Q3: How does the unique email constraint work?**
A: MongoDB creates an index on the email field. When you try to save a user with a duplicate email, Mongoose throws a validation error: "E11000 duplicate key error".

**Q4: What happens to the resetPasswordToken if a user never clicks the link?**
A: It stays in the database with an expiry date. When they request another reset, a new token is generated. The old one becomes invalid after the expiry time passes.

**Q5: Can you delete a user from the system?**
A: Yes, but I haven't implemented it in this project. You'd call `User.deleteOne({ _id: userId })` and cascade delete all their playlists. For GDPR compliance, you should implement this.

---

## FILE 4: models/Playlist.js

### Purpose
Defines the schema for playlists. Each playlist contains multiple songs as embedded subdocuments, and references the user who created it.

### Code Explanation

```javascript
const mongoose = require("mongoose");

const SongSchema = new mongoose.Schema({
  videoId: { type: String, required: true }, // YouTube Video ID
  title: { type: String, required: true },
  artist: { type: String },
  image: { type: String },
  addedAt: { type: Date, default: Date.now },
});
```
- **SongSchema** is a nested schema (embedded in PlaylistSchema)
- **videoId**: YouTube's unique video identifier (e.g., "dQw4w9WgXcQ")
  - Used to load the video in YouTube IFrame player
  - Required because we can't play a song without an ID
- **title**: Song name (e.g., "Blinding Lights")
- **artist**: Channel/artist name
- **image**: Thumbnail URL from YouTube
- **addedAt**: When this song was added to the playlist
  - Lets us sort songs by "recently added"

```javascript
const PlaylistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
```
- **user**: Reference to the User document that owns this playlist
- **ObjectId**: MongoDB's unique identifier (points to a User doc)
- **ref**: "User" tells Mongoose this references the User model
- **required**: Can't create a playlist without a user

```javascript
  name: {
    type: String,
    required: true,
    default: "My Playlist",
  },
```
- Playlist name (e.g., "Evening Chill Mix", "Happy Vibes")
- Can be edited by user
- Defaults to "My Playlist" if not provided

```javascript
  // We can flag one playlist as the default "Favorites"
  isFavorites: {
    type: Boolean,
    default: false,
  },
```
- **isFavorites**: Boolean flag (true/false)
- If true, this is the user's default "Favorites" playlist
- When user clicks the heart icon ❤️ on a song, it's added here
- Only one playlist per user should have `isFavorites: true`

```javascript
  songs: [SongSchema],
```
- **Embedded subdocuments**: An array of SongSchema objects
- Instead of a separate `songs` collection, songs live inside each playlist doc
- Keeps data denormalized for simpler queries
- When you query a playlist, you get all its songs in one DB operation

```javascript
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
```
- Timestamp when playlist was created
- Used in Library to show "Created Oct 24, 2023"

```javascript
module.exports = mongoose.model("Playlist", PlaylistSchema);
```
- Registers the model with MongoDB
- Creates a `playlists` collection

### Data Structure Example

A real playlist document looks like:

```javascript
{
  _id: ObjectId("60d5ba51f1b2c4a8e8f8e8f8"),
  user: ObjectId("60d5ba51f1b2c4a8e8f8e8f7"),  // ref to User._id
  name: "Sad Lo-fi Study Mix",
  isFavorites: false,
  songs: [
    {
      videoId: "jfKfPfyJRDc",
      title: "Lofi Girl - beats to relax/study to",
      artist: "Lofi Girl",
      image: "https://i.ytimg.com/vi/jfKfPfyJRDc/hqdefault.jpg",
      addedAt: ISODate("2026-05-05T10:30:00Z")
    },
    {
      videoId: "rUxyKA_-grQ",
      title: "Study Music Mix",
      artist: "Study Beats",
      image: "https://i.ytimg.com/...",
      addedAt: ISODate("2026-05-06T14:20:00Z")
    }
  ],
  createdAt: ISODate("2026-05-05T10:00:00Z")
}
```

### How This Connects

```
playlistController.js uses this model:
  const playlist = new Playlist({ user: req.user.id, name, songs });
  await playlist.save();
  await Playlist.findById(playlistId);
  await Playlist.find({ user: req.user.id });

Player.jsx uses via API:
  GET /api/playlists → returns all playlists for user
  POST /api/playlists/:id/songs → adds song to playlist
```

### Viva Explanation

"The Playlist model has two important features:
1. **User Reference**: Every playlist is linked to a user via their ObjectId, ensuring users can only see/edit their own playlists.
2. **Embedded Songs**: Songs are embedded as subdocuments instead of in a separate collection. This denormalized approach means I fetch a whole playlist with all its songs in a single DB query, which is more efficient."

### Viva Questions

**Q1: Why embed songs instead of creating a separate collection?**
A: For this app's use case, songs are only accessed as part of a playlist. Embedding keeps them together in one document, so querying is faster (single DB hit vs. two). Trade-off: songs can't be shared across playlists easily, but that's okay for our requirements.

**Q2: Can two playlists have the same song?**
A: Yes! Both playlists would have separate copies of the same song (same videoId but different `_id` for the song subdocument). The YouTube video is what matters; we're just storing metadata.

**Q3: What's the difference between `ref` and actual embedding?**
A: With `ref`, we store the User's ObjectId and can look up the User later. With embedding, we'd store the entire User object inside the playlist. We use `ref` to avoid data duplication.

**Q4: How do you add a song to a playlist?**
A: `playlist.songs.push(newSong)` adds a new SongSchema object to the array, then `await playlist.save()` persists it to MongoDB.

**Q5: How do you remove a song?**
A: `playlist.songs = playlist.songs.filter(s => s.videoId !== videoIdToRemove)` removes the matching song from the array, then save.

---

## FILE 5: middleware/authMiddleware.js

### Purpose
Protects routes by verifying JWT tokens. Without this, anyone could access private endpoints like `/api/profile` or `/api/playlists`.

### Code Explanation

```javascript
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
```
- Exports a middleware function
- Express middleware has 3 parameters: `req`, `res`, `next`
  - **req**: Incoming request object
  - **res**: Response object to send data back
  - **next**: Function to call if middleware passes (continues to next handler)

```javascript
  const token = req.header("x-auth-token");
```
- Gets the token from the request header
- Frontend sends token in the header: `{ "x-auth-token": "eyJhb..." }`
- The header name is custom (I chose "x-auth-token")

```javascript
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
```
- If token is missing, send 401 (Unauthorized) response
- Response body: `{ "msg": "No token, authorization denied" }`
- Stops execution (doesn't call `next()`)

```javascript
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
```
- **jwt.verify()**: Decodes and verifies the token
  - Uses `JWT_SECRET` to confirm the token wasn't tampered with
  - If invalid or expired, throws error (caught by catch block)
- **decoded**: Contains the original payload (e.g., `{ user: { id: "..." } }`)
- **req.user = decoded.user**: Attaches user info to request object
  - Now the controller can access `req.user.id`
- **next()**: Passes to next middleware/handler (route succeeds)

```javascript
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
```
- If token is invalid or expired, return 401
- Token expired: User must log in again to get a new one
- Token tampered: Token failed verification

### How This Connects

Used in routes:

```javascript
// routes/playlists.js
router.get("/", auth, getPlaylists);
//         ^^^^- This middleware runs FIRST
//              Then getPlaylists controller runs
```

Flow:
```
Browser sends: GET /api/playlists
Header: { "x-auth-token": "eyJhb..." }
    ↓
Express matches route
    ↓
Middleware: authMiddleware runs
    ├─ Extracts token from header
    ├─ Verifies with JWT_SECRET
    ├─ Attaches req.user = { id: "..." }
    ├─ Calls next()
    ↓
Controller: getPlaylists runs
    ├─ Can now access req.user.id
    ├─ Returns user's playlists
    ↓
Response sent to browser
```

### Viva Explanation

"Auth middleware is the gatekeeper of protected routes. It extracts the JWT token from the request header, verifies it hasn't been tampered with using a secret key, and if valid, attaches the user info to the request. If the token is missing or invalid, it rejects the request with a 401 status. This ensures only authenticated users can access private endpoints."

### Viva Questions

**Q1: What's JWT and why use it instead of sessions?**
A: JWT (JSON Web Token) is stateless. The server doesn't store sessions; everything is in the token. This is perfect for scalable backends. The client stores the token and sends it with each request. Sessions are the opposite: server stores state, client just gets a session ID.

**Q2: What's inside the JWT token?**
A: Three parts separated by dots: `header.payload.signature`
- Header: Algorithm (HS256)
- Payload: The user data (`{ id: "..." }`)
- Signature: HMAC hash signed with JWT_SECRET
Only the server can create valid signatures because only it knows JWT_SECRET.

**Q3: What happens if someone steals a token?**
A: They can impersonate that user until the token expires. That's why JWTs have expiry times (mine is 5 days). In production, use HTTPS to encrypt tokens in transit, and store tokens in httpOnly cookies (not localStorage).

**Q4: Can a user create a fake token?**
A: They can try, but when the server verifies it, the signature won't match (they don't know JWT_SECRET). jwt.verify() will throw an error.

**Q5: What does req.user contain?**
A: The `user` object from the JWT payload. I set it to `{ id: user._id }` when signing the token, so req.user.id is the MongoDB user ID.

---

## FILE 6: routes/auth.js

### Purpose
Defines the URL patterns for authentication endpoints. Each pattern is connected to a controller function.

### Code Explanation

```javascript
const express = require("express");
const router = express.Router();
```
- Creates a new Express Router (a mini Express app for organizing routes)
- Allows routes to be modular

```javascript
const {
  registerUser,
  loginUser,
  getUserProfile,
  googleLogin,
  updatePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
```
- Imports all auth functions from the controller
- These are the actual handler functions for each route

```javascript
const auth = require("../middleware/authMiddleware");
```
- Imports the JWT verification middleware
- Used to protect routes that need authentication

```javascript
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleLogin);
router.get("/me", auth, getUserProfile);
```
- **POST /register**: Public route, runs `registerUser` controller
- **POST /login**: Public route, runs `loginUser` controller
- **POST /google**: Public route, runs `googleLogin` controller
- **GET /me**: Protected route (`auth` middleware first), runs `getUserProfile`
  - Only authenticated users can access this
  - Middleware verifies token, then controller runs

```javascript
router.put("/updatepassword", auth, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
```
- **PUT /updatepassword**: Protected, changes password for logged-in user
- **POST /forgotpassword**: Public, sends password reset email
- **PUT /resetpassword/:resetToken**: Public, uses reset token from email to set new password

```javascript
module.exports = router;
```
- Exports the router so server.js can mount it

### Complete API Endpoint List (Auth Routes)

```
POST   /api/auth/register              Public  → registerUser
POST   /api/auth/login                 Public  → loginUser
POST   /api/auth/google                Public  → googleLogin
GET    /api/auth/me                    Private → getUserProfile
PUT    /api/auth/updatepassword        Private → updatePassword
POST   /api/auth/forgotpassword        Public  → forgotPassword
PUT    /api/auth/resetpassword/:token  Public  → resetPassword
```

### Viva Explanation

"Routes are URL patterns that map to controller functions. In routes/auth.js, I define endpoints for authentication like register, login, and Google OAuth. Some routes are protected with the `auth` middleware, meaning only authenticated users can access them. Public routes don't have the middleware, so anyone can access them."

### Viva Questions

**Q1: Why separate routes into a different file?**
A: Organization and scalability. server.js stays clean; auth logic is in routes/auth.js. If I add more routes (payments, notifications), each gets its own file.

**Q2: What's the difference between PUT and POST?**
A: POST creates new resources (register a new user). PUT updates existing resources (change your password). This follows REST conventions, though technically both can do either.

**Q3: Why is PUT used for updatepassword instead of POST?**
A: REST semantics. You're updating a user's password, not creating a new password entity. PUT implies "update the entire password"; PATCH implies "update part of it".

**Q4: Why is /me protected but /login isn't?**
A: /login is public so unregistered users can log in. /me returns the current user's profile, so it must be protected (can't fetch someone else's profile).

**Q5: How do you know which middleware to apply?**
A: Think about the action: "Is this something an unregistered user should be able to do?" If yes (login, register, reset password), it's public. If no (view library, update password), it's protected.

---

## FILE 7: routes/music.js

### Purpose
Defines endpoints for music-related operations: generating recommendations and managing saved playlists.

### Code Explanation

```javascript
const express = require("express");
const router = express.Router();
```
- Creates a music router

```javascript
const {
  getRecommendation,
  savePlaylist,
  getHistory,
  generatePlaylist,
} = require("../controllers/musicController");
```
- Imports controller functions

```javascript
const auth = require("../middleware/authMiddleware");
```
- Imports auth middleware

```javascript
router.post("/recommend", getRecommendation);
```
- **POST /api/music/recommend**: Public (no `auth` middleware)
- Generates recommendations based on mood/language/genre/mode
- Takes request body: `{ mood, language, genre, mode }`
- Returns array of songs

```javascript
router.post("/save", auth, savePlaylist);
```
- **POST /api/music/save**: Protected
- User must be logged in to save playlists
- Takes request body: `{ name, inputs, tracks }`

```javascript
router.get("/history", auth, getHistory);
```
- **GET /api/music/history**: Protected
- Returns user's saved playlists
- No request body needed (user ID comes from `req.user`)

```javascript
router.get("/generate", generatePlaylist);
```
- **GET /api/music/generate**: Public (legacy route)
- Simple playlist generation without 3-stage logic
- Alternative to /recommend

### Viva Explanation

"The music routes handle the recommendation algorithm and history. The /recommend endpoint is the core feature - it receives mood, language, and genre, then returns personalized music. Public routes allow guests to see recommendations, while protected routes ensure only logged-in users can save their playlists."

### Viva Questions

**Q1: Why is /recommend public instead of protected?**
A: To allow guest users to see music recommendations even without logging in. They can't save or play full songs, but they can see what the system recommends.

**Q2: What goes in the request body vs. query parameters?**
A: Request body (POST): Large payloads like array of songs. Query parameters (GET): Small filters like `?page=1&limit=10`. /recommend uses body because it sends mood, language, genre, mode. /history uses GET because no complex data needed.

**Q3: What does getHistory return?**
A: All playlists created by the logged-in user, sorted by creation date (newest first). Playlists include all embedded songs.

**Q4: How is the recommendation API different from YouTube search?**
A: My recommendation API combines my mood-based algorithm with YouTube's search. It searches for keywords like "sad lo-fi" then filters results. It's a hybrid approach.

**Q5: Why do both /generate and /recommend endpoints exist?**
A: /generate is legacy (simple 1-stage). /recommend is new (3-stage emotion regulation). Both work; /recommend is what the frontend uses.

---

## FILE 8: routes/playlists.js

### Purpose
Defines CRUD (Create, Read, Update, Delete) operations for playlists.

### Code Explanation

```javascript
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getPlaylists,
  createPlaylist,
  renamePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} = require("../controllers/playlistController");
```
- Standard imports for routing

```javascript
// All routes are protected by 'auth' middleware
router.get("/", auth, getPlaylists);
router.post("/", auth, createPlaylist);
router.put("/:id", auth, renamePlaylist);
router.delete("/:id", auth, deletePlaylist);
```
- **GET /api/playlists**: Fetch all user's playlists
- **POST /api/playlists**: Create a new playlist
- **PUT /api/playlists/:id**: Update playlist name (`:id` is a parameter)
- **DELETE /api/playlists/:id**: Delete a playlist

```javascript
router.post("/:id/songs", auth, addSongToPlaylist);
router.delete("/:id/songs/:videoId", auth, removeSongFromPlaylist);
```
- **POST /api/playlists/:id/songs**: Add a song to a specific playlist
  - `:id` = playlist ID
  - Request body: `{ videoId, title, artist, image }`
- **DELETE /api/playlists/:id/songs/:videoId**: Remove a song from a playlist
  - `:id` = playlist ID
  - `:videoId` = YouTube video ID

### URL Parameters

```
GET /api/playlists/123abc/songs/dQw4w9WgXcQ
                    └─────┘   └─────────────┘
                     :id       :videoId
```

### Viva Explanation

"Playlists routes handle all user playlist management: creating new playlists, renaming them, deleting them, and adding/removing songs. All endpoints are protected because playlists are personal data. The router uses URL parameters (like `:id`) to specify which playlist or song to operate on."

### Viva Questions

**Q1: Why use different HTTP methods (GET, POST, PUT, DELETE)?**
A: REST conventions make APIs predictable:
- GET: Retrieve data (doesn't change state)
- POST: Create new resource
- PUT: Update existing resource
- DELETE: Remove resource

**Q2: What's a URL parameter vs. query string?**
A: URL parameter: `/playlists/123/songs` (part of the path)
Query string: `/playlists?sort=date&limit=10` (after ?)
Both pass data, but parameters are for specifying which resource, queries are for filters.

**Q3: Why protect all playlist routes?**
A: Playlists are personal. User A shouldn't see or edit User B's playlists. The middleware checks authentication and the controller verifies ownership.

**Q4: Can you use GET to add a song?**
A: Technically yes, but it violates REST semantics. GET should never change state. Using POST makes it clear that the server state changes.

**Q5: How does the controller know which user's playlists to return?**
A: The auth middleware attaches `req.user.id` to the request. The controller uses this to query only that user's playlists: `Playlist.find({ user: req.user.id })`.

---

## FILE 9: controllers/authController.js

### Purpose
Contains the business logic for authentication: registration, login, Google OAuth, and password management.

### Code Explanation (Main Functions)

### Function 1: registerUser

```javascript
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create new user
    user = new User({ username, email, password });

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save to database
    await user.save();

    // Create default Favorites playlist
    await new Playlist({
      user: user.id,
      name: "Favorites",
      isFavorites: true,
    }).save();

    // Generate JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user.id, username: user.username, email: user.email },
        });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
```

**Line-by-line:**

1. `const { username, email, password } = req.body;`
   - Destructures form data from frontend

2. `let user = await User.findOne({ email });`
   - Queries MongoDB: "Find a user with this email"
   - `await` waits for database response

3. `if (user) { return res.status(400).json({ msg: "User already exists" }); }`
   - If user exists, return error 400 (Bad Request)
   - Stops function execution (return)

4. `user = new User({ username, email, password });`
   - Creates new user object in memory (not yet in DB)

5. `const salt = await bcrypt.genSalt(10);`
   - Generates random salt (10 is the cost factor)
   - Salt is mixed with password before hashing
   - Higher cost = more secure but slower

6. `user.password = await bcrypt.hash(password, salt);`
   - Hashes plain password with salt
   - Result: 60-character bcrypt hash
   - Original password is lost forever (one-way)

7. `await user.save();`
   - Saves user to MongoDB
   - Now user has an `_id` (ObjectId)

8. `await new Playlist({ user: user.id, name: "Favorites", isFavorites: true }).save();`
   - Creates a default "Favorites" playlist
   - Links to new user via `user: user.id`
   - When user clicks ❤️ icon, songs go here

9. `const payload = { user: { id: user.id } };`
   - Creates JWT payload (what gets encoded in token)

10. `jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" }, ...)`
    - Signs the payload with the secret
    - Token expires in 5 days
    - After 5 days, user must log in again

11. `res.json({ token, user: {...} });`
    - Sends token and user info back to frontend
    - Frontend stores token in localStorage

### Function 2: loginUser

```javascript
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    // Generate JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: user.id, username: user.username, email: user.email },
        });
      },
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
```

**Key differences from register:**
- No user creation, just verification
- `bcrypt.compare()` checks if provided password matches stored hash
- Uses same error message for both "user not found" and "wrong password" for security (doesn't reveal which user exists)

### Function 3: googleLogin

```javascript
exports.googleLogin = async (req, res) => {
  const { token } = req.body; // This is the Access Token

  try {
    // 1. Fetch user info using the Access Token
    const googleResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const { sub, name, email, picture } = googleResponse.data;
    const safeUsername = name || email.split("@")[0];

    // 2. Check if user exists in our DB
    let user = await User.findOne({ email });

    if (user) {
      // User exists: Update googleId if missing
      if (!user.googleId) {
        user.googleId = sub;
        await user.save();
      }
    } else {
      // User doesn't exist: Create new account
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const salt = await bcrypt.genSalt(10);
      const hashedRandomPassword = await bcrypt.hash(randomPassword, salt);

      user = new User({
        username: safeUsername,
        email: email,
        password: hashedRandomPassword,
        googleId: sub,
        avatar: picture,
      });

      await user.save();

      // Create their default favorites playlist
      await new Playlist({
        user: user.id,
        name: "Favorites",
        isFavorites: true,
      }).save();
    }

    // 3. Generate OUR App Token (JWT)
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5d" },
      (err, appToken) => {
        if (err) throw err;
        res.json({
          token: appToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
          },
        });
      },
    );
  } catch (err) {
    console.error("Google Auth Error:", err.message);
    res.status(400).json({ msg: "Google Sign-In Failed" });
  }
};
```

**How it works:**
1. Frontend sends Google's access token
2. Backend uses this token to call Google API (proves token is real)
3. Google returns user info: `sub` (ID), `name`, `email`, `picture`
4. Backend checks if user exists in our DB by email
   - If yes: Update googleId and use existing user
   - If no: Create new user with random hashed password
5. Generate our own JWT token
6. Send token + user info back to frontend

**Why random password?**
- User schema has `password: String` without `required: true`
- But our schema wants it to be optional
- We give it a dummy value so the user document is valid
- User can never log in with this password (it's random and not the same hash as input)
- Only login method is Google

### Function 4: updatePassword

```javascript
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // 1. Get user with password field included
    const user = await User.findById(req.user.id);

    // 2. Check if user signed up with Google (no password)
    if (!user.password) {
      return res.status(400).json({
        msg: "You use Google Login. Please cannot change password here.",
      });
    }

    // 3. Verify Current Password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // 4. Hash New Password & Save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
```

**Key points:**
- User is authenticated (middleware verified JWT)
- Check if user has a password (Google users might not)
- Verify the old password before allowing change
- Hash and save new password

### Function 5: forgotPassword & resetPassword

```javascript
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 1. Generate Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // 2. Hash it and save to DB (20 minute expiry)
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // 3. Create Reset URL (Frontend URL)
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // 4. Send Email (For DEV, we just console.log it)
    console.log("Reset URL:", resetUrl);

    res.json({ success: true, data: "Email sent (Check console for link)" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Email could not be sent");
  }
};
```

**Flow:**
1. User enters email on forgot password page
2. Backend generates random 20-byte token
3. Hashes the token (SHA256) and saves to DB
4. Sets expiry to 10 minutes from now
5. Creates reset URL with the plain token (not the hash)
6. In production, sends this URL via email
7. User clicks link, frontend shows reset form
8. User submits new password + token (from URL)
9. Backend hashes the token from URL and compares to DB value
10. If match and not expired, updates password

Why hash the token?
- Even if DB is hacked, attacker can't use the hashed tokens
- Only the reset link (sent via email) contains the plain token

### Viva Explanation

"The authentication controller handles registration, login, Google OAuth, and password management. Key security features:
- Passwords are hashed with bcrypt before storage
- JWTs expire in 5 days, so old tokens become invalid
- Password reset tokens are temporary (10 minutes) and hashed in the database
- Google users are treated specially - they don't have passwords, just googleIds"

### Viva Questions

**Q1: Why use bcrypt.compare() instead of just comparing strings?**
A: Bcrypt hash is one-way. You can't reverse it to get the original password. You hash the input and compare the hashes. If someone compares plain passwords in code, they're exposing the plain password in memory.

**Q2: What does genSalt do?**
A: Generates a random salt that's mixed with the password before hashing. Even if two users have the same password, their hashes are different (due to different salts). Cost factor 10 means 2^10 hash iterations (stronger = slower).

**Q3: Why not just email the reset token directly?**
A: For security. The reset URL contains the plain token. If you stored the plain token in DB, a hacker with DB access could use it. By storing the hash, only someone with the email (receiving the link) has the plain token.

**Q4: How long is 5 days? Why not longer?**
A: 5 days is a balance. Longer = more risk (stolen token valid longer). Shorter = users annoyed (have to log in again). 5 days is industry standard.

**Q5: What happens if user clicks reset link but doesn't submit new password for 11 minutes?**
A: The 10-minute timer expires. When they submit, `resetPasswordExpire: { $gt: Date.now() }` check fails. Backend returns "Invalid or expired token".

---

## FILE 10: controllers/musicController.js

### Purpose
Core recommendation algorithm. Generates playlists using:
1. **Match My Vibe**: Direct mood-based search (1 stage)
2. **Lift My Spirits**: 3-stage emotion regulation algorithm

### Code Explanation

### Transition Matrix

```javascript
const TRANSITIONS = {
  Sad: ["Calm", "Happy"],
  Tense: ["Calm", "Happy"],
  Calm: ["Calm", "Energetic"],
  Happy: ["Happy", "Energetic"],
  Focus: ["Focus", "Calm"],
};
```

**What it is:**
- Maps each mood to two target moods
- Represents the path of emotion regulation
- Example: If user is "Sad", gradually move them to "Calm", then to "Happy"

**Why two targets?**
- First transition: Intermediate mood (emotional bridge)
- Second transition: Final mood (desired state)

**Example pathways:**
```
Sad → Calm → Happy
     (acknowledge)  (elevate)

Tense → Calm → Happy
       (relax)  (uplift)

Happy → Energetic
       (intensify)
```

### Function 1: fetchYouTubeVideos

```javascript
async function fetchYouTubeVideos(query, maxResults, stageName = "Match") {
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY || API_KEY.includes("YOUR_YOUTUBE_API_KEY")) {
    console.log("⚠️ Using Dummy Data");
    return Array(maxResults)
      .fill(0)
      .map((_, i) => ({
        id: `dummy_${Date.now()}_${i}`,
        title: `[${stageName}] ${query} Track ${i + 1}`,
        image: "https://via.placeholder.com/320x180.png?text=Music+Video",
        artist: "Demo Channel",
        stage: stageName,
      }));
  }

  try {
    // STEP 1: Search for videos
    const fetchCount = maxResults * 2; // Fetch double to account for Shorts
    const safeQuery = encodeURIComponent(`${query} official audio`);
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${safeQuery}&type=video&videoCategoryId=10&maxResults=${fetchCount}&key=${API_KEY}`;

    const searchRes = await axios.get(searchUrl);

    if (!searchRes.data.items || searchRes.data.items.length === 0) return [];

    // Extract video IDs
    const videoIds = searchRes.data.items
      .map((item) => item.id.videoId)
      .join(",");

    // STEP 2: Get exact duration of videos
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,snippet&id=${videoIds}&key=${API_KEY}`;
    const detailsRes = await axios.get(detailsUrl);

    // STEP 3: Filter out Shorts (anything under 60 seconds)
    const validVideos = detailsRes.data.items.filter((video) => {
      const duration = video.contentDetails.duration;
      return duration.includes("M") || duration.includes("H");
    });

    // Return up to maxResults
    return validVideos.slice(0, maxResults).map((item) => ({
      id: item.id,
      title: item.snippet.title,
      image: item.snippet.thumbnails.high.url,
      artist: item.snippet.channelTitle,
      stage: stageName,
    }));
  } catch (error) {
    console.error("YouTube API Error:", error.message);
    return [];
  }
}
```

**Two-API-call strategy:**

Call 1: Search API
```
GET https://www.googleapis.com/youtube/v3/search
Params: q="sad lo-fi official audio", maxResults=30
Returns: 30 video IDs (many are Shorts)
```

Call 2: Videos API
```
GET https://www.googleapis.com/youtube/v3/videos
Params: id="dQw4w....,jfKf....,rUxy...." (30 IDs)
Returns: contentDetails.duration for each
```

**Why two calls?**
- Search API doesn't return duration
- Must fetch details separately
- Allows filtering out Shorts by duration

**Duration parsing:**
- YouTube format: "PT3M45S" (3 mins 45 secs)
- "PT45S" (45 seconds, a Short)
- "PT1H30M" (1 hour 30 mins)
- If duration includes "M" (minutes) or "H" (hours), it's a full song

### Function 2: getRecommendation (3-Stage Algorithm)

```javascript
exports.getRecommendation = async (req, res) => {
  const { mood, language, genre, mode } = req.body;

  let videoResults = [];
  console.log(`🎵 Generating: [${mode}] ${mood} - ${language} ${genre}`);

  try {
    if (mode === "improve" || mode === "lift") {
      // 3-STAGE ALGORITHM
      const targetMoods = TRANSITIONS[mood] || ["Happy", "Energetic"];

      // Stage 1: Validation (Current mood)
      const v1 = await fetchYouTubeVideos(
        `${language} ${mood} ${genre}`,
        3,
        "Validation",
      );
      // Stage 2: Transition (First target mood)
      const v2 = await fetchYouTubeVideos(
        `${language} ${targetMoods[0]} ${genre}`,
        5,
        "Transition",
      );
      // Stage 3: Target (Final target mood)
      const v3 = await fetchYouTubeVideos(
        `${language} ${targetMoods[1] || targetMoods[0]} ${genre}`,
        6,
        "Target",
      );

      videoResults = [...v1, ...v2, ...v3]; // 14 songs total
    } else {
      // MATCH MODE (1-stage)
      videoResults = await fetchYouTubeVideos(
        `${language} ${mood} ${genre}`,
        10,
        "Match",
      );
    }

    res.json(videoResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch music" });
  }
};
```

**Logic flow:**

```
User selects: Sad, English, Lo-fi, mode="lift"
    ↓
Get target moods: TRANSITIONS["Sad"] = ["Calm", "Happy"]
    ↓
THREE parallel API calls:
    ├─ Stage 1: "English Sad Lo-fi" → 3 songs (Validation)
    ├─ Stage 2: "English Calm Lo-fi" → 5 songs (Transition)
    └─ Stage 3: "English Happy Lo-fi" → 6 songs (Target)
    ↓
Concatenate: [3 sad] + [5 calm] + [6 happy] = 14 total
    ↓
Each song has .stage = "Validation" or "Transition" or "Target"
    ↓
Return JSON to frontend
```

**Frontend uses stage labels to display:**
```
Stage 1: Acknowledgment
  [3 sad songs matching current emotion]

Stage 2: The Transition
  [5 calm songs gradually shifting mood]

Stage 3: The Target State
  [6 happy songs for elevation]
```

**Why these numbers (3, 5, 6)?**
- Total = 14 songs (good playlist length)
- Start small (3 validation): Low cognitive load, familiarity
- Increase gradually (5 transition): Slow change is better than jarring
- Finish big (6 target): Solidify the new mood with more options

### Function 3: savePlaylist

```javascript
exports.savePlaylist = async (req, res) => {
  try {
    const { name, inputs, tracks } = req.body;

    const newPlaylist = new Playlist({
      user: req.user.id,
      name,
      inputs,
      tracks,
    });

    const saved = await newPlaylist.save();
    res.json(saved);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
```

**Creates a new playlist and saves to DB**
- `user: req.user.id`: Ties playlist to current user
- `name`: Playlist name (e.g., "Sad English Lo-fi Mix")
- `inputs`: Original selections (mood, language, genre)
- `tracks`: Array of songs with videoId, title, artist, image

### Function 4: getHistory

```javascript
exports.getHistory = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(playlists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
```

**Returns all user's saved playlists**
- `Playlist.find({ user: req.user.id })`: Finds all playlists by this user
- `.sort({ createdAt: -1 })`: Sorts by creation date, newest first (-1 = descending)

### Viva Explanation

"The music controller implements the core recommendation algorithm. For 'Match My Vibe', it does a simple search for the current mood. For 'Lift My Spirits', it uses a 3-stage algorithm:
1. **Validation**: Music matching current mood (acknowledgment)
2. **Transition**: Music bridging to an intermediate mood (gradual shift)
3. **Target**: Music in the final desired mood (elevation)

Each stage has filtered YouTube results. The system filters out YouTube Shorts to ensure full songs are returned."

### Viva Questions

**Q1: Why use the transition matrix instead of always going Happy?**
A: Some moods have natural intermediate states. Going directly from Tense → Happy might feel inauthentic. Going Tense → Calm → Happy is more gradual and psychologically valid.

**Q2: Why search for "official audio" in YouTube?**
A: To prioritize high-quality, official uploads over covers or lo-fi versions. "Official audio" usually means the artist's own channel.

**Q3: Why fetch double the videos (maxResults * 2) if you're only keeping maxResults?**
A: Because many results are YouTube Shorts (under 60 seconds). By fetching 30 and filtering, I usually get the 15 full-length songs needed.

**Q4: Can two users get the same recommendation for the same mood?**
A: Yes, YouTube's search results are deterministic for a given query. Two people searching "Happy English Lo-fi" get the same results. But I cache nothing; each request queries YouTube fresh.

**Q5: What happens if YouTube API returns error?**
A: The catch block logs the error and returns a 500 status. Frontend shows "Failed to fetch music" toast. In dev mode (dummy API), it generates fake data.

---

## FILE 11: controllers/playlistController.js

### Purpose
CRUD operations for playlists: Create, Read, Update, Delete songs and playlists.

### Code Explanation

### Function 1: getPlaylists

```javascript
exports.getPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(playlists);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
```
- Queries MongoDB for all playlists where user = current user
- Sorts by creation date (newest first)
- Returns JSON array of playlist objects

### Function 2: createPlaylist

```javascript
exports.createPlaylist = async (req, res) => {
  const { name, isFavorites } = req.body;

  try {
    const newPlaylist = new Playlist({
      user: req.user.id,
      name: name || "New Playlist",
      isFavorites: isFavorites || false,
      songs: [],
    });

    const playlist = await newPlaylist.save();
    res.json(playlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
```
- Creates a new playlist object
- Default name: "New Playlist" if not provided
- Default isFavorites: false
- Default songs: empty array
- Saves to DB and returns the created playlist

### Function 3: renamePlaylist

```javascript
exports.renamePlaylist = async (req, res) => {
  const { name } = req.body;

  try {
    let playlist = await Playlist.findById(req.params.id);

    if (!playlist) return res.status(404).json({ msg: "Playlist not found" });

    // Ensure user owns this playlist
    if (playlist.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    playlist.name = name;
    await playlist.save();

    res.json(playlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
```

**Security check (authorization):**
```javascript
if (playlist.user.toString() !== req.user.id) {
  return res.status(401).json({ msg: "Not authorized" });
}
```
- User A shouldn't be able to rename User B's playlist
- Compare the playlist's user ID with the request's user ID
- `.toString()` because ObjectId needs to be converted to string for comparison

### Function 4: deletePlaylist

```javascript
exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) return res.status(404).json({ msg: "Playlist not found" });

    // Ensure user owns this playlist
    if (playlist.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await playlist.deleteOne();
    res.json({ msg: "Playlist removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
```
- Find playlist by ID
- Verify ownership
- Delete from DB
- Return success message

### Function 5: addSongToPlaylist

```javascript
exports.addSongToPlaylist = async (req, res) => {
  const { videoId, title, artist, image } = req.body;

  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) return res.status(404).json({ msg: "Playlist not found" });
    if (playlist.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Check if song already exists
    const exists = playlist.songs.find((song) => song.videoId === videoId);
    if (exists) {
      return res.status(400).json({ msg: "Song already in playlist" });
    }

    // Add new song
    playlist.songs.unshift({ videoId, title, artist, image });
    await playlist.save();

    res.json(playlist.songs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
```

**Key logic:**
1. Find playlist (authorization check)
2. Check if song already exists: `.find()` over songs array
3. If exists: Return error 400
4. If new: `unshift()` adds to beginning of songs array (newest first)
5. Save playlist to DB
6. Return updated songs array

**Why unshift()?**
- `unshift()` adds to start of array (index 0)
- `push()` would add to end
- Unshift makes new songs appear first

### Function 6: removeSongFromPlaylist

```javascript
exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) return res.status(404).json({ msg: "Playlist not found" });
    if (playlist.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Filter out the song
    playlist.songs = playlist.songs.filter(
      (song) => song.videoId !== req.params.videoId,
    );

    await playlist.save();
    res.json(playlist.songs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
```

**Removes a song by filtering:**
```javascript
playlist.songs = playlist.songs.filter(
  (song) => song.videoId !== req.params.videoId
);
```
- Keeps all songs EXCEPT the one matching the videoId
- Result: songs array without the deleted song
- Save and return updated array

### Viva Explanation

"The playlist controller manages all CRUD operations for user playlists. Every function checks authorization - a user can only modify their own playlists. Key features include duplicate prevention (can't add same song twice), newest-first ordering (unshift), and safe deletion with filtering."

### Viva Questions

**Q1: Why convert ObjectId to string for comparison?**
A: ObjectId is a MongoDB data type. JavaScript's `!==` operator compares by value. Converting to string ensures a proper comparison. `ObjectId("123") !== "123"` is true even though they're the same ID.

**Q2: What's the difference between deleteOne() and deleteMany()?**
A: `deleteOne()` deletes first matching doc. `deleteMany()` deletes all matching docs. I use `deleteOne()` because I'm deleting one specific playlist by ID.

**Q3: Why use filter() instead of splice() to remove a song?**
A: Immutability and clarity. `filter()` returns a new array, making it clear that a new array is created. `splice()` modifies in place, which can cause confusion. Modern JS favors `filter()`.

**Q4: Can you add the same song twice to a playlist?**
A: No, the code checks `const exists = playlist.songs.find(...)`. If the same videoId exists, it returns error "Song already in playlist". Prevents duplicates.

**Q5: What if user tries to add a song to someone else's playlist?**
A: Authorization check catches this: `if (playlist.user.toString() !== req.user.id)`. Returns 401 "Not authorized". The song is never added.

---

# PART 3: BACKEND DATA FLOWS

## Data Flow 1: Registration Flow

### User provides: username, email, password

```javascript
// Frontend (Register.jsx)
const res = await axios.post(`${API_BASE_URL}/api/auth/register`, {
  username: "john_doe",
  email: "john@example.com",
  password: "SecurePass123",
});

// Backend receives POST /api/auth/register
// routes/auth.js maps to authController.registerUser()
```

### Step-by-step backend processing:

**Step 1: Validation**
```javascript
let user = await User.findOne({ email });
if (user) {
  return res.status(400).json({ msg: "User already exists" });
}
```
- Check if email already registered
- If yes: return error 400, stop

**Step 2: User creation**
```javascript
user = new User({ username, email, password });
```
- Create user object in memory
- Password is PLAIN TEXT at this point

**Step 3: Password hashing**
```javascript
const salt = await bcrypt.genSalt(10); // Generate random salt
user.password = await bcrypt.hash(password, salt); // Hash password
```
- Generate random salt
- Hash password + salt (creates one-way hash)
- Replace plain password with hash
- Now password is 60-character bcrypt hash

**Step 4: Save to database**
```javascript
await user.save();
```
- User document saved to MongoDB
- MongoDB generates `_id` (ObjectId)
- Plain password never stored anywhere

**Step 5: Create default Favorites playlist**
```javascript
await new Playlist({
  user: user.id,
  name: "Favorites",
  isFavorites: true,
}).save();
```
- New playlist created, tied to user's ID
- Empty songs array initially
- `isFavorites: true` marks this as the heart button target

**Step 6: Generate JWT token**
```javascript
const payload = { user: { id: user.id } };
jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" }, (err, token) => {
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  res.json({ token, user: {...} });
});
```
- Create payload object with user ID
- Sign with JWT_SECRET (server only knows this)
- Token expires in 5 days
- Return token + user info to frontend

**Step 7: Frontend stores token**
```javascript
localStorage.setItem("token", res.data.token);
localStorage.setItem("user", JSON.stringify(res.data.user));
```
- Frontend stores token in browser's localStorage
- Token sent with every subsequent request

### Why each step is needed:

| Step | Reason |
|---|---|
| Validation | Prevent duplicate accounts |
| Hashing | Security: never store plain passwords |
| Favorites | Auto-create target for heart clicks |
| JWT | Stateless auth, token proves identity |
| localStorage | Frontend can send token with requests |

---

## Data Flow 2: Login Flow

### User provides: email, password

```
Frontend: POST /api/auth/login with email & password
    ↓
Backend: authController.loginUser()
```

**Step 1: Find user**
```javascript
let user = await User.findOne({ email });
if (!user) {
  return res.status(400).json({ msg: "Invalid Credentials" });
}
```
- Query MongoDB for user with this email
- If not found: return error (don't reveal user not found for security)

**Step 2: Verify password**
```javascript
const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  return res.status(400).json({ msg: "Invalid Credentials" });
}
```
- `bcrypt.compare()` hashes the input password with the stored salt
- Compares the result with stored hash
- If match: proceed; if no match: error

**Step 3: Generate JWT**
```javascript
const payload = { user: { id: user.id } };
jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" }, (err, token) => {
  res.json({ token, user: { id, username, email } });
});
```
- Same token generation as registration
- Return token + user info

**Step 4: Frontend stores token**
- Same as registration

### Why bcrypt.compare() is needed:

```
Stored in DB: "$2b$10$abcdefghijklmnopqrst..."  (hash)
User enters: "SecurePass123"
bcrypt.compare(plaintext, hash) → true/false
```
- Can't reverse the hash
- Must hash the input and compare hashes
- Only way to verify password is correct

---

## Data Flow 3: Google OAuth Login Flow

### User clicks "Sign in with Google"

```javascript
// Frontend (Login.jsx / Register.jsx)
const googleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    const res = await axios.post(`${API_BASE_URL}/api/auth/google`, {
      token: tokenResponse.access_token,
    });
    // tokenResponse.access_token is Google's access token
  },
});
```

### Frontend flow:
1. User clicks "Sign in with Google" button
2. Google OAuth library opens popup
3. User logs into Google
4. Google sends back `access_token` to frontend
5. Frontend sends token to backend

### Backend receives access_token

**Step 1: Verify with Google**
```javascript
const googleResponse = await axios.get(
  "https://www.googleapis.com/oauth2/v3/userinfo",
  {
    headers: { Authorization: `Bearer ${token}` },
  },
);
const { sub, name, email, picture } = googleResponse.data;
```
- Call Google API with the access token
- Google verifies token is valid
- Returns user info: ID (`sub`), name, email, avatar
- If token invalid, Google returns error

**Step 2: Check if user exists in our DB**
```javascript
let user = await User.findOne({ email });
```
- Look up user by email
- If exists: update googleId (if missing) and proceed
- If not exists: create new user

**Step 3: Create user if new**
```javascript
const randomPassword = crypto.randomBytes(16).toString("hex");
const salt = await bcrypt.genSalt(10);
const hashedRandomPassword = await bcrypt.hash(randomPassword, salt);

user = new User({
  username: safeUsername,
  email: email,
  password: hashedRandomPassword,  // Dummy password
  googleId: sub,
  avatar: picture,
});

await user.save();

// Create default Favorites
await new Playlist({
  user: user.id,
  name: "Favorites",
  isFavorites: true,
}).save();
```
- Generate random password (never used)
- Store dummy hash (Google users can't login with password)
- Store Google ID
- Store Google avatar
- Create default Favorites

**Step 4: Generate our JWT token**
```javascript
const payload = { user: { id: user.id } };
jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" }, (err, token) => {
  res.json({
    token: appToken,  // OUR token, not Google's
    user: { id, username, email, avatar },
  });
});
```
- Create JWT with our secret (not Google's)
- Token valid for 5 days in our app
- Frontend stores this token in localStorage

### Why two tokens?

| Token | Who issues | Purpose | Lifetime |
|---|---|---|---|
| Google access_token | Google | Prove identity to Google | 1 hour |
| Our JWT | Our backend | Prove identity to our app | 5 days |

**Flow:**
```
Google token proves user to Google
    ↓ (backend exchanges it)
Our JWT proves user to our app
    ↓ (frontend uses it)
Can make requests to /api/playlists, /api/profile, etc.
```

### Key insight:

Google token is a one-time credential sent to backend. Our JWT is what the frontend uses going forward. After 1 hour, Google token expires, but our JWT is still valid for 5 days.

---

## Data Flow 4: Protected Route Flow

### User wants to access: GET /api/playlists

```javascript
// Frontend (Library.jsx)
const res = await axios.get(`${API_BASE_URL}/api/playlists`, {
  headers: { "x-auth-token": localStorage.getItem("token") },
});
```

### Backend processing:

**Step 1: Request arrives**
```
GET /api/playlists
Header: { "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
```

**Step 2: Express routes to handler**
```javascript
router.get("/", auth, getPlaylists);
//            ^^^^- middleware runs FIRST
```

**Step 3: authMiddleware runs**
```javascript
const token = req.header("x-auth-token");
if (!token) return res.status(401).json({ msg: "No token" });

const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded.user;  // req.user = { id: "..." }
next();
```
- Extract token from header
- Verify with JWT_SECRET (if tampered, throws error)
- Attach user info to request object
- Call next() to proceed

**Step 4: Controller runs**
```javascript
async function getPlaylists(req, res) {
  const playlists = await Playlist.find({ user: req.user.id });
  res.json(playlists);
}
```
- Access req.user.id (set by middleware)
- Query: find playlists where user = current user
- Return playlists to frontend

### Complete flow:

```
Frontend
  ↓ (sends token in header)
Express Route
  ↓
authMiddleware (verifies token, attaches req.user)
  ↓
getPlaylists controller (uses req.user.id)
  ↓ (queries DB)
MongoDB
  ↓ (returns user's playlists)
Controller (returns JSON)
  ↓
Frontend (displays playlists)
```

### What happens if token is missing/invalid:

```
Missing token
  ↓
authMiddleware: "No token, authorization denied"
  ↓ (returns 401 before controller runs)
Controller NEVER runs
  ↓
Frontend receives 401 error
  ↓
User redirected to login page
```

---

## Data Flow 5: Music Recommendation Flow ("Lift My Spirits")

### User selects mood, language, genre, clicks "Generate", selects "Lift My Spirits"

```javascript
// Frontend (Home.jsx)
const res = await axios.post(`${API_BASE_URL}/api/music/recommend`, {
  mood: "Sad",
  language: "English",
  genre: "Lo-fi",
  mode: "lift",
});
```

### Backend processing:

**Step 1: Extract parameters**
```javascript
const { mood, language, genre, mode } = req.body;
```

**Step 2: Determine 3-stage targets**
```javascript
const TRANSITIONS = {
  Sad: ["Calm", "Happy"],
  // ... other moods
};

const targetMoods = TRANSITIONS["Sad"] || ["Happy", "Energetic"];
// targetMoods = ["Calm", "Happy"]
```

**Step 3: Make 3 YouTube API calls (in parallel)**

```javascript
const v1 = await fetchYouTubeVideos(
  `English Sad Lo-fi`,    // Stage 1
  3,                       // 3 results
  "Validation"            // stage label
);
// Returns: [{ id, title, artist, image, stage: "Validation" }, ...]

const v2 = await fetchYouTubeVideos(
  `English Calm Lo-fi`,   // Stage 2
  5,
  "Transition"
);

const v3 = await fetchYouTubeVideos(
  `English Happy Lo-fi`,  // Stage 3
  6,
  "Target"
);
```

Each call:
1. Searches YouTube: `https://www.googleapis.com/youtube/v3/search?q=English%20Sad%20Lo-fi...`
2. Gets 30 results (includes Shorts)
3. Fetches details: `https://www.googleapis.com/youtube/v3/videos?id=...` 
4. Gets duration for each video
5. Filters: Keeps only videos with "M" or "H" in duration (full songs)
6. Returns first N results with stage label attached

**Step 4: Concatenate results**
```javascript
videoResults = [...v1, ...v2, ...v3];
// [3 sad] + [5 calm] + [6 happy] = 14 songs total
```

**Step 5: Return to frontend**
```javascript
res.json(videoResults);
```

Response:
```javascript
[
  { id: "dQw4w9...", title: "Sad Song", artist: "Artist", image: "...", stage: "Validation" },
  { id: "jfKfPf...", title: "Sad Song 2", artist: "...", image: "...", stage: "Validation" },
  // ... 2 more validation songs
  { id: "rUxyKA...", title: "Calm Song", artist: "...", image: "...", stage: "Transition" },
  // ... 4 more transition songs
  { id: "6uC2dU...", title: "Happy Song", artist: "...", image: "...", stage: "Target" },
  // ... 5 more target songs
]
```

### Frontend processes:

```javascript
// Home.jsx receives videoResults
setGeneratedSongs(res.data);

// Filter by stage for display
const stage1 = generatedSongs.filter(s => s.stage === "Validation");
const stage2 = generatedSongs.filter(s => s.stage === "Transition");
const stage3 = generatedSongs.filter(s => s.stage === "Target");

// Render 3 sections:
// Stage 1: Acknowledgment (Your current emotion)
// Stage 2: The Transition (Gradual shift)
// Stage 3: The Target State (Elevation)
```

### Why this algorithm is effective:

| Stage | Purpose | Psychology |
|---|---|---|
| Validation | Meet user where they are | Validates current emotion, builds trust |
| Transition | Bridge to better state | Gradual shift is less jarring |
| Target | Achieve desired mood | Reinforces positive emotion |

---

## Data Flow 6: Playlist CRUD Flow

### Scenario: User creates a new playlist and adds 2 songs

**Step 1: Create playlist**
```javascript
// Frontend (Library.jsx)
const res = await axios.post(
  `${API_BASE_URL}/api/playlists`,
  { name: "My Chill Mix" },
  { headers: { "x-auth-token": token } }
);
const playlistId = res.data._id;
```

**Backend:**
```javascript
router.post("/", auth, createPlaylist);

function createPlaylist(req, res) {
  const { name } = req.body;
  const newPlaylist = new Playlist({
    user: req.user.id,        // From middleware
    name: name || "New Playlist",
    isFavorites: false,
    songs: [],                // Start with empty array
  });
  await newPlaylist.save();
  res.json(newPlaylist);      // Return created playlist with _id
}
```

**Database state:**
```javascript
{
  _id: ObjectId("60d5ba51f1b2c4a8e8f8e8f8"),
  user: ObjectId("60d5ba51f1b2c4a8e8f8e8f7"),
  name: "My Chill Mix",
  isFavorites: false,
  songs: [],                  // Empty
  createdAt: ISODate("...")
}
```

**Step 2: Add first song**
```javascript
// Frontend (Discover.jsx)
await axios.post(
  `${API_BASE_URL}/api/playlists/${playlistId}/songs`,
  {
    videoId: "dQw4w9WgXcQ",
    title: "Rickroll",
    artist: "Rick Astley",
    image: "https://...",
  },
  { headers: { "x-auth-token": token } }
);
```

**Backend:**
```javascript
function addSongToPlaylist(req, res) {
  const { videoId, title, artist, image } = req.body;
  const playlist = await Playlist.findById(req.params.id);

  // Check if song exists
  const exists = playlist.songs.find(s => s.videoId === videoId);
  if (exists) return res.status(400).json({ msg: "Song already in playlist" });

  // Add song to array (unshift = add to beginning)
  playlist.songs.unshift({ videoId, title, artist, image });
  await playlist.save();

  res.json(playlist.songs);
}
```

**Database state after song 1:**
```javascript
{
  _id: ObjectId("60d5ba51f1b2c4a8e8f8e8f8"),
  user: ObjectId("60d5ba51f1b2c4a8e8f8e8f7"),
  name: "My Chill Mix",
  songs: [
    {
      videoId: "dQw4w9WgXcQ",
      title: "Rickroll",
      artist: "Rick Astley",
      image: "https://...",
      addedAt: ISODate("...")
    }
  ],
  createdAt: ISODate("...")
}
```

**Step 3: Add second song**
```javascript
// Frontend adds another song
await axios.post(
  `${API_BASE_URL}/api/playlists/${playlistId}/songs`,
  {
    videoId: "jfKfPfyJRDc",
    title: "Lofi Girl",
    artist: "Lofi Girl",
    image: "https://...",
  },
  { headers: { "x-auth-token": token } }
);
```

**Database state after song 2:**
```javascript
{
  _id: ObjectId("60d5ba51f1b2c4a8e8f8e8f8"),
  songs: [
    {
      videoId: "jfKfPfyJRDc",    // Newest (added via unshift)
      title: "Lofi Girl",
      // ...
    },
    {
      videoId: "dQw4w9WgXcQ",    // Older
      title: "Rickroll",
      // ...
    }
  ],
}
```

**Step 4: User renames playlist**
```javascript
// Frontend (Library.jsx)
await axios.put(
  `${API_BASE_URL}/api/playlists/${playlistId}`,
  { name: "Evening Chill" },
  { headers: { "x-auth-token": token } }
);
```

**Backend:**
```javascript
function renamePlaylist(req, res) {
  const { name } = req.body;
  let playlist = await Playlist.findById(req.params.id);

  // Authorization
  if (playlist.user.toString() !== req.user.id)
    return res.status(401).json({ msg: "Not authorized" });

  playlist.name = name;
  await playlist.save();
  res.json(playlist);
}
```

**Step 5: User removes a song**
```javascript
// Frontend (Library.jsx)
await axios.delete(
  `${API_BASE_URL}/api/playlists/${playlistId}/songs/dQw4w9WgXcQ`,
  { headers: { "x-auth-token": token } }
);
```

**Backend:**
```javascript
function removeSongFromPlaylist(req, res) {
  let playlist = await Playlist.findById(req.params.id);

  // Filter out the song
  playlist.songs = playlist.songs.filter(
    song => song.videoId !== req.params.videoId  // dQw4w9WgXcQ
  );

  await playlist.save();
  res.json(playlist.songs);  // Return remaining songs
}
```

**Final database state:**
```javascript
{
  _id: ObjectId("60d5ba51f1b2c4a8e8f8e8f8"),
  name: "Evening Chill",
  songs: [
    {
      videoId: "jfKfPfyJRDc",
      title: "Lofi Girl",
      // ...
    }
    // Rickroll removed
  ],
}
```

---

## Data Flow 7: Favorite Songs (Heart Click) Flow

### User plays a song and clicks the heart ❤️ icon

```javascript
// Frontend (Player.jsx)
const toggleLike = async () => {
  if (!isAuthenticated) {
    // Guest user: show auth prompt
    setShowAuthPrompt(true);
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const config = { headers: { "x-auth-token": token } };

    let targetId = favoritesId;

    if (!targetId) {
      // Create Favorites if doesn't exist
      const createRes = await axios.post(
        "http://localhost:5000/api/playlists",
        { name: "Favorites", isFavorites: true },
        config,
      );
      targetId = createRes.data._id;
      setFavoritesId(targetId);
    }

    if (isLiked) {
      // Remove from Favorites
      await axios.delete(
        `http://localhost:5000/api/playlists/${targetId}/songs/${currentSong.id}`,
        config,
      );
      setIsLiked(false);
      toast.success("Removed from Favorites");
    } else {
      // Add to Favorites
      await axios.post(
        `http://localhost:5000/api/playlists/${targetId}/songs`,
        {
          videoId: currentSong.id,
          title: currentSong.title,
          artist: currentSong.artist,
          image: currentSong.image,
        },
        config,
      );
      setIsLiked(true);
      toast.success("Added to Favorites");
    }
  } catch (err) {
    toast.error("Failed to update favorites");
  }
};
```

### Flow:

```
User clicks ❤️
  ↓
Check if authenticated
  ├─ No → Show login prompt
  └─ Yes → Continue
  ↓
Check if Favorites playlist exists
  ├─ No → Create it
  └─ Yes → Use existing ID
  ↓
Check if song already liked
  ├─ Yes → DELETE /api/playlists/:id/songs/:videoId
  │         (removes song from Favorites)
  │         setIsLiked(false)
  │         toast: "Removed from Favorites"
  │
  └─ No → POST /api/playlists/:id/songs
          (adds song to Favorites)
          setIsLiked(true)
          toast: "Added to Favorites"
```

### Database changes:

**Before (Favorites playlist):**
```javascript
{
  _id: ObjectId("favorites_id"),
  user: ObjectId("user_id"),
  name: "Favorites",
  isFavorites: true,
  songs: [
    { videoId: "song1", title: "...", artist: "...", image: "..." },
    { videoId: "song2", title: "...", artist: "...", image: "..." },
  ],
}
```

**After clicking ❤️ on new song (song3):**
```javascript
{
  _id: ObjectId("favorites_id"),
  user: ObjectId("user_id"),
  name: "Favorites",
  isFavorites: true,
  songs: [
    { videoId: "song3", title: "...", artist: "...", image: "..." },  // Newest (unshift)
    { videoId: "song1", title: "...", artist: "...", image: "..." },
    { videoId: "song2", title: "...", artist: "...", image: "..." },
  ],
}
```

---

## Data Flow 8: 30-Second Guest Limit Flow

### Unauthenticated user plays a song

```javascript
// Frontend (Player.jsx)
const startProgressTracking = () => {
  if (intervalRef.current) return;
  intervalRef.current = setInterval(() => {
    if (playerRef.current && playerRef.current.getCurrentTime) {
      const currentTime = playerRef.current.getCurrentTime();

      // 🚨 Block Guest after 30 seconds
      if (!isAuthenticated && currentTime >= 30) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        setAuthMessage(
          "You've reached the 30-second preview limit. Sign up to hear the full track!",
        );
        setShowAuthPrompt(true);
        playerRef.current.seekTo(29, true); // Trap at 29s
        return;
      }

      setProgress(currentTime);
    }
  }, 100);  // Check every 100ms
};
```

### Flow:

```
Guest user plays song
  ↓
YouTube IFrame player starts
  ↓
onStateChange event → playVideo
  ↓
startProgressTracking() runs interval
  ↓
Every 100ms: Check currentTime
  ├─ 0-29 seconds
  │   └─ setProgress(currentTime)
  │     → Progress bar updates
  │
  └─ >= 30 seconds
      ├─ pauseVideo()
      ├─ Show auth prompt modal
      ├─ seekTo(29) [trap them at 29s]
      └─ Stop interval

User clicks "Sign Up" in modal
  ↓
Navigate to /register
  ↓
Register account
  ↓
JWT token obtained
  ↓
Return to home
  ↓
Next song plays fully (no 30s limit)
```

### Why 30 seconds?

- Long enough to decide if they like the song
- Short enough to incentivize signing up
- Industry standard (Spotify, Apple Music use similar)

---

**[PART 4, 5, 6, 7, 8, 9, 10, 11, 12 CONTINUE IN NEXT MESSAGE DUE TO LENGTH]**

Because this guide is very comprehensive, I'll now ask you a clarifying question:

**Would you like me to continue with the remaining parts (Frontend Explanation, Data Flows, Algorithm Deep Dive, Database, Security, API Table, Testing, Deployment, and 50+ Viva Questions)?**

I can provide all of this in a structured format. Given the length, I recommend I either:

1. **Continue in this same file** - I'll add all remaining parts (might be very long)
2. **Create separate files** - Each section as its own markdown file for easier navigation

Which would you prefer?

Also, would you like me to:
- Focus on any specific areas first?
- Explain any part deeper?
- Add diagrams or flowcharts?
- Include code examples for every function?

Let me know and I'll continue with the complete comprehensive guide!