# DoubtSolver - Academic Doubt Solving Platform

A comprehensive doubt-solving platform built with React and Firebase, featuring manual UPI payment integration, real-time chat, live sessions, and admin management.

## Features

### Student Features
- **Manual UPI Payment**: Subscribe using UPI payment with proof upload
- **Ask Doubts**: Submit doubts with images and detailed descriptions
- **Real-time Chat**: Discuss doubts with tutors via real-time messaging
- **Live Sessions**: Join one-on-one video sessions for complex doubts
- **Solution Videos**: Access YouTube solution videos for solved doubts
- **Subject Support**: Physics, Chemistry, Mathematics, and more

### Admin Features
- **Payment Management**: Review and approve/reject payment proofs
- **Doubt Management**: Manage doubt status, add live session links
- **Real-time Dashboard**: Monitor all activities with live statistics
- **Solution Management**: Add YouTube video links and solution notes

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Firebase (Firestore, Auth, Storage, Hosting)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth (Email/Password)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd doubt-solver
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable the following services:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
   - Hosting

3. Get your Firebase config and update `src/lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. Firebase CLI Setup

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Storage
# - Hosting
```

### 4. Deploy Security Rules

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage:rules
```

### 5. Set Up Admin User

1. Create a regular user account through the app
2. In Firebase Console, go to Firestore Database
3. Find the user document in the `users` collection
4. Update the `role` field to `"admin"`

### 6. Add Payment QR Code

1. Generate your UPI QR code
2. Save it as `public/qr.png`
3. Update the UPI ID in `src/components/payment/PaymentFlow.jsx`:

```javascript
const UPI_ID = "your-upi-id@upi";
```

### 7. Development

```bash
# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

### 8. Build and Deploy

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

## Project Structure

```
src/
├── components/
│   ├── admin/              # Admin panel components
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Student dashboard
│   ├── doubts/             # Doubt management
│   ├── landing/            # Landing page
│   └── payment/            # Payment flow
├── contexts/
│   └── AuthContext.jsx    # Authentication context
├── lib/
│   └── firebase.js        # Firebase configuration
└── App.jsx                # Main app with routing
```

## Firestore Data Model

### Collections

1. **users/{uid}**
   - `uid`: User ID
   - `email`: User email
   - `displayName`: User's full name
   - `role`: "student" | "admin"
   - `createdAt`: Timestamp
   - `lastLoginAt`: Timestamp

2. **payments/{paymentId}**
   - `userId`: User ID
   - `userEmail`: User email
   - `proofUrl`: Storage URL of payment proof
   - `status`: "pending" | "approved" | "rejected"
   - `createdAt`: Timestamp
   - `reviewedAt`: Timestamp (when admin reviewed)
   - `reviewedBy`: Admin user ID
   - `notes`: Admin notes

3. **doubts/{doubtId}**
   - `userId`: User ID
   - `userEmail`: User email
   - `title`: Doubt title
   - `description`: Detailed description
   - `images`: Array of image URLs
   - `subject`: "physics" | "chemistry" | "math" | "other"
   - `status`: "open" | "in_progress" | "solved" | "closed"
   - `liveSessionLink`: Meeting URL (set by admin)
   - `solutionYouTubeUrl`: YouTube solution video
   - `solutionNotes`: Brief solution notes
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

4. **doubts/{doubtId}/messages/{messageId}**
   - `senderId`: User ID of sender
   - `senderRole`: "student" | "admin"
   - `text`: Message content
   - `attachments`: Array of attachment URLs
   - `createdAt`: Timestamp

## Security Rules

The application includes production-ready Firestore and Storage security rules that:

- Prevent unauthorized access to user data
- Allow students to only access their own doubts and payments
- Enable admin users to manage all data
- Prevent role escalation attacks
- Validate file uploads and sizes

## Environment Variables

No environment variables needed - all configuration is in the Firebase config object.

## Deployment

The application is configured for Firebase Hosting with:

- Single Page Application routing
- Optimized caching headers
- Automatic HTTPS

## Support

For issues or questions, please check the code comments and Firebase documentation.

## License

This project is for educational purposes. Modify as needed for your use case.