import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

// Components
import Landing from './components/landing/Landing';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import PaymentFlow from './components/payment/PaymentFlow';
import AskDoubt from './components/doubts/AskDoubt';
import DoubtsList from './components/doubts/DoubtsList';
import DoubtDetail from './components/doubts/DoubtDetail';
import SolvedDoubts from './components/doubts/SolvedDoubts';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminPayments from './components/admin/AdminPayments';
import AdminDoubts from './components/admin/AdminDoubts';
import AdminDoubtDetail from './components/admin/AdminDoubtDetail';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Student Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pay" 
              element={
                <ProtectedRoute>
                  <PaymentFlow />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/ask" 
              element={
                <ProtectedRoute>
                  <AskDoubt />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doubts" 
              element={
                <ProtectedRoute>
                  <DoubtsList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doubts/:doubtId" 
              element={
                <ProtectedRoute>
                  <DoubtDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/solved" 
              element={
                <ProtectedRoute>
                  <SolvedDoubts />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/payments" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminPayments />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/doubts" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDoubts />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/doubts/:doubtId" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDoubtDetail />
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;