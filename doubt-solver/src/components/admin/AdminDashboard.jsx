import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy,
  limit,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';
import AdminNav from './AdminNav';
import { 
  Users, 
  CreditCard, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  Play,
  Eye,
  Check,
  X,
  ExternalLink
} from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingPayments: 0,
    openDoubts: 0,
    inProgressDoubts: 0,
    solvedDoubts: 0
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentDoubts, setRecentDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up real-time listeners for direct admin access
    const unsubscribeUsers = setupUsersListener();
    const unsubscribePayments = setupPaymentsListener();
    const unsubscribeDoubts = setupDoubtsListener();

    return () => {
      unsubscribeUsers();
      unsubscribePayments();
      unsubscribeDoubts();
    };
  }, []);

  const setupUsersListener = () => {
    const usersQuery = query(collection(db, 'users'));
    return onSnapshot(usersQuery, (snapshot) => {
      setStats(prev => ({ ...prev, totalUsers: snapshot.size }));
    });
  };

  const setupPaymentsListener = () => {
    const paymentsQuery = query(
      collection(db, 'payments'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    return onSnapshot(paymentsQuery, (snapshot) => {
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const pendingCount = payments.filter(p => p.status === 'pending').length;
      setStats(prev => ({ ...prev, pendingPayments: pendingCount }));
      setRecentPayments(payments);
      setLoading(false);
    });
  };

  const setupDoubtsListener = () => {
    const doubtsQuery = query(
      collection(db, 'doubts'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    
    return onSnapshot(doubtsQuery, (snapshot) => {
      const doubts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const openCount = doubts.filter(d => d.status === 'open').length;
      const inProgressCount = doubts.filter(d => d.status === 'in_progress').length;
      const solvedCount = doubts.filter(d => d.status === 'solved').length;
      
      setStats(prev => ({
        ...prev,
        openDoubts: openCount,
        inProgressDoubts: inProgressCount,
        solvedDoubts: solvedCount
      }));
      setRecentDoubts(doubts);
    });
  };

  const handlePaymentAction = async (paymentId, action, notes = '') => {
    try {
      await updateDoc(doc(db, 'payments', paymentId), {
        status: action,
        reviewedAt: serverTimestamp(),
        reviewedBy: currentUser.uid,
        notes: notes
      });
    } catch (error) {
      console.error('Error updating payment:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Direct admin access - no auth check needed

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <AdminNav />
      <div className="max-w-7xl mx-auto p-6">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="card text-center">
          <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
          <p className="text-gray-600">Total Users</p>
        </div>
        
        <div className="card text-center">
          <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</h3>
          <p className="text-gray-600">Pending Payments</p>
        </div>
        
        <div className="card text-center">
          <HelpCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{stats.openDoubts}</h3>
          <p className="text-gray-600">Open Doubts</p>
        </div>
        
        <div className="card text-center">
          <Play className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{stats.inProgressDoubts}</h3>
          <p className="text-gray-600">In Progress</p>
        </div>
        
        <div className="card text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{stats.solvedDoubts}</h3>
          <p className="text-gray-600">Solved</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Payments */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Payments</h2>
            <Link to="/admin-2c9f7/payments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {recentPayments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No payments yet</p>
          ) : (
            <div className="space-y-4">
              {recentPayments.slice(0, 5).map(payment => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{payment.userEmail}</p>
                    <p className="text-sm text-gray-500">{formatDate(payment.createdAt)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      payment.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status.toUpperCase()}
                    </span>
                    
                    {payment.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePaymentAction(payment.id, 'approved')}
                          className="text-green-600 hover:text-green-700"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handlePaymentAction(payment.id, 'rejected')}
                          className="text-red-600 hover:text-red-700"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    <a
                      href={payment.proofUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                      title="View Proof"
                    >
                      <Eye className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Doubts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Doubts</h2>
            <Link to="/admin-2c9f7/doubts" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>
          
          {recentDoubts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No doubts yet</p>
          ) : (
            <div className="space-y-4">
              {recentDoubts.slice(0, 5).map(doubt => (
                <div key={doubt.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{doubt.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                      doubt.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                      doubt.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      doubt.status === 'solved' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {doubt.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{doubt.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{doubt.userEmail}</span>
                    <div className="flex items-center gap-3">
                      <span className="capitalize">{doubt.subject}</span>
                      <Link
                        to={`/admin-2c9f7/doubts/${doubt.id}`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}