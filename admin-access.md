# Admin Access Guide

## 🔐 Direct Admin URLs (No Authentication Required)

Your secret admin access URLs:

### 🏠 Main Admin Dashboard
```
http://localhost:5173/admin-2c9f7
https://learnly-2c9f7.web.app/admin-2c9f7
```

### 💰 Payment Management
```
http://localhost:5173/admin-2c9f7/payments
https://learnly-2c9f7.web.app/admin-2c9f7/payments
```

### ❓ Doubts Management
```
http://localhost:5173/admin-2c9f7/doubts
https://learnly-2c9f7.web.app/admin-2c9f7/doubts
```

### 📝 Individual Doubt Management
```
http://localhost:5173/admin-2c9f7/doubts/[doubt-id]
https://learnly-2c9f7.web.app/admin-2c9f7/doubts/[doubt-id]
```

## 🎯 Features Available:

✅ **Payment Management:**
- View all payment submissions
- Approve/reject payments with notes
- Filter by status (pending/approved/rejected)
- View payment proofs directly

✅ **Doubt Management:**
- View all student doubts
- Update doubt status (open/in_progress/solved/closed)
- Add live session links
- Add YouTube solution videos
- Add solution notes

✅ **Real-time Chat:**
- Chat with students directly on doubt pages
- View all conversation history

✅ **Dashboard Overview:**
- Live statistics
- Recent payments and doubts
- Quick actions

## 🚀 Quick Deployment:

```bash
npm run build
firebase deploy
```

Your admin panel will be live at: `https://learnly-2c9f7.web.app/admin-2c9f7`

## 🔒 Security Note:
Keep the URL `admin-2c9f7` secret. Only share with trusted administrators.