# Team Availability Tracker 👥

A full-stack web application for managing team member availability status in real-time. This project demonstrates **conditional rendering** and **state synchronization** between frontend and backend.

## Features

✅ **User Dashboard** - Display all team members with their current availability status  
✅ **Live Toggle Switches** - Change availability status with instant visual feedback  
✅ **Database Persistence** - Availability changes are saved to SQLite database  
✅ **Real-time Updates** - Frontend automatically reflects database changes  
✅ **Responsive Design** - Works seamlessly on desktop and mobile devices  
✅ **Error Handling** - Graceful error messages and retry mechanisms  
✅ **Loading States** - Smooth loading indicators during API calls  

## Tech Stack

### Frontend
- **React 18** - UI framework with hooks for state management
- **Axios** - HTTP client for API communication
- **CSS3** - Custom styling with animations and gradients

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework for API
- **SQLite3** - Lightweight database
- **CORS** - Cross-origin request handling

## Project Structure

```
Task-5/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AvailabilityDashboard.js      (Main component with toggle logic)
│   │   │   └── AvailabilityDashboard.css     (Styling and animations)
│   │   ├── index.js                          (React entry point)
│   │   └── index.css                         (Global styles)
│   └── package.json
├── backend/
│   ├── server.js                             (Express server & routes)
│   ├── database.js                           (SQLite database layer)
│   └── package.json
├── README.md
└── .gitignore
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Step 1: Clone or Navigate to Project
```bash
cd e:\VirtualWorks\Task-5
```

### Step 2: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

## Running the Application

### Terminal 1: Start Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

### Terminal 2: Start Frontend Development Server
```bash
cd frontend
npm start
# React app opens on http://localhost:3000
```

## API Endpoints

### Get All Users
```
GET /api/users
Response: [
  {
    id: 1,
    name: "Alice Johnson",
    available: true,
    created_at: "2024-01-15T10:30:00",
    updated_at: "2024-01-15T14:45:00"
  },
  ...
]
```

### Get Single User
```
GET /api/users/:id
Response: { id, name, available, created_at, updated_at }
```

### Update User Availability
```
PUT /api/users/:id/availability
Body: { "available": true }
Response: { message: "Availability updated", user: {...} }
```

### Create New User
```
POST /api/users
Body: { "name": "John Doe" }
Response: { message: "User created", user: {...} }
```

### Health Check
```
GET /api/health
Response: { status: "ok", message: "Server is running" }
```

## Key Implementation Details

### Conditional Rendering
The dashboard uses conditional rendering to show different UI states:

```javascript
{user.available ? (
  <span className="status-badge available">● Available</span>
) : (
  <span className="status-badge unavailable">● Away</span>
)}
```

### State Synchronization
When a toggle is clicked:

1. **Frontend**: Updates local state and sends API request
2. **Backend**: Updates database record
3. **Response**: Backend returns updated user object
4. **Sync**: Frontend updates component state with response

```javascript
const handleToggleAvailability = async (userId, currentStatus) => {
  const response = await axios.put(
    `http://localhost:5000/api/users/${userId}/availability`,
    { available: !currentStatus }
  );
  setUsers(users.map(user =>
    user.id === userId ? response.data.user : user
  ));
};
```

### Database Layer
The database layer (`database.js`) abstracts SQLite operations:
- Initialization and table creation
- User seeding with default data
- Promise-based async operations
- Proper type conversion (SQLite boolean to JavaScript)

## Features Breakdown

### 1. **Conditional Rendering**
- Status badges dynamically styled based on availability
- Error banners conditionally shown
- Loading state display
- Disabled state for toggles during API calls

### 2. **State Synchronization**
- Local state mirrors database state
- Optimistic updates with server sync
- Error handling with rollback capability
- Auto-refresh every 10 seconds

### 3. **Visual Feedback**
- Smooth animations and transitions
- Color-coded status indicators (green for available, red for away)
- Loading spinners and "Updating..." text
- Responsive card hover effects

## Testing the Application

### Manual Testing Steps:

1. **Check Dashboard Load**
   - Verify all team members display on page load
   - Confirm availability statuses are correct

2. **Test Toggle Functionality**
   - Click any availability toggle
   - Verify visual update (color change, status text)
   - Check database updated (refresh page or check DB file)

3. **Test Error Handling**
   - Stop backend server
   - Attempt to toggle - should show error message
   - Restart backend - functionality should resume

4. **Test State Consistency**
   - Open app in two browser tabs
   - Toggle availability in one tab
   - Auto-refresh in second tab should show change

## Development Workflow

### Adding New Features

1. **Add API Endpoint** in `backend/server.js`
2. **Add Database Method** in `backend/database.js`
3. **Add Frontend Logic** in `frontend/src/components/AvailabilityDashboard.js`
4. **Test End-to-End**

### Customization Ideas

- Add user roles/departments
- Implement search and filter
- Add availability reason/notes
- Schedule availability times
- Add timezone support
- Implement notifications

## Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Delete `team_availability.db` and restart
- Verify Node.js is installed: `node --version`

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check CORS is enabled in backend
- Try accessing `http://localhost:5000/api/health` directly

### Database errors
- Delete `backend/team_availability.db`
- Restart backend server
- Check file permissions

## License

MIT License - Feel free to use this project for learning and development.

## Next Steps

- Deploy backend to cloud (AWS, Azure, Heroku)
- Deploy frontend to CDN (Netlify, Vercel)
- Add authentication
- Implement real-time updates with WebSockets
- Add database migrations
- Create admin panel for user management
