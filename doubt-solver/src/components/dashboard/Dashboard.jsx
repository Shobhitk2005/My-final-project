import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  CreditCard, 
  HelpCircle, 
  CheckCircle, 
  Clock, 
  Play,
  Youtube,
  AlertTriangle,
  User
} from 'lucide-react';

export default function Dashboard() {
  const { currentUser, isAdmin } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [recentDoubts, setRecentDoubts] = useState([]);
  const [solvedDoubts, setSolvedDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      // Fetch subscription status
      const paymentsQuery = query(
        collection(db, 'payments'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const paymentsSnapshot = await getDocs(paymentsQuery);
      if (!paymentsSnapshot.empty) {
        const latestPayment = paymentsSnapshot.docs[0].data();
        setSubscriptionStatus(latestPayment.status);
      }

      // Fetch recent doubts
      const doubtsQuery = query(
        collection(db, 'doubts'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      
      const doubtsSnapshot = await getDocs(doubtsQuery);
      const doubtsData = doubtsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setRecentDoubts(doubtsData);
      setSolvedDoubts(doubtsData.filter(doubt => doubt.status === 'solved'));
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDoubtStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'solved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser?.displayName || 'Student'}!
        </h1>
        <p className="text-gray-600">
          {isAdmin ? 'Admin Dashboard' : 'Your learning dashboard'}
        </p>
      </div>

      {/* Admin Banner */}
      {isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <User className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-medium text-blue-800">You are logged in as Administrator</p>
              <Link to="/admin" className="text-blue-600 hover:text-blue-700 text-sm">
                Go to Admin Panel →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Subscription Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>
              <div className="mt-2">
                {subscriptionStatus === 'approved' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    Active
                  </span>
                )}
                {subscriptionStatus === 'pending' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <Clock className="h-4 w-4" />
                    Pending
                  </span>
                )}
                {subscriptionStatus === 'rejected' && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    Rejected
                  </span>
                )}
                {!subscriptionStatus && (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <AlertTriangle className="h-4 w-4" />
                    Not Paid
                  </span>
                )}
              </div>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
          <div className="mt-4">
            {subscriptionStatus === 'approved' ? (
              <Link to="/ask" className="btn-primary text-sm">
                Ask Doubt
              </Link>
            ) : (
              <Link to="/pay" className="btn-primary text-sm">
                {subscriptionStatus === 'rejected' ? 'Resubmit Payment' : 'Pay Now'}
              </Link>
            )}
          </div>
        </div>

        <div className="card text-center">
          <HelpCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{recentDoubts.length}</h3>
          <p className="text-gray-600">Total Doubts</p>
        </div>

        <div className="card text-center">
          <Play className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">
            {recentDoubts.filter(d => d.status === 'in_progress').length}
          </h3>
          <p className="text-gray-600">In Progress</p>
        </div>

        <div className="card text-center">
          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-gray-900">{solvedDoubts.length}</h3>
          <p className="text-gray-600">Solved</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Doubts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Doubts</h2>
            <Link to="/doubts" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>

          {recentDoubts.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No doubts yet</h3>
              <p className="text-gray-500 mb-4">Start by asking your first doubt!</p>
              {subscriptionStatus === 'approved' ? (
                <Link to="/ask" className="btn-primary">
                  Ask Your First Doubt
                </Link>
              ) : (
                <Link to="/pay" className="btn-primary">
                  Subscribe to Ask Doubts
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {recentDoubts.map(doubt => (
                <Link
                  key={doubt.id}
                  to={`/doubts/${doubt.id}`}
                  className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{doubt.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getDoubtStatusColor(doubt.status)}`}>
                      {doubt.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{doubt.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{doubt.subject}</span>
                    <span>{formatDate(doubt.createdAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Solved Doubts */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Solved Doubts</h2>
            <Link to="/solved" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </Link>
          </div>

          {solvedDoubts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No solved doubts yet</h3>
              <p className="text-gray-500">Solved doubts will appear here with solution videos.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {solvedDoubts.map(doubt => (
                <div key={doubt.id} className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 line-clamp-1">{doubt.title}</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                      SOLVED
                    </span>
                  </div>
                  
                  {doubt.solutionNotes && (
                    <p className="text-sm text-gray-600 mb-2">{doubt.solutionNotes}</p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{formatDate(doubt.updatedAt)}</span>
                    {doubt.solutionYouTubeUrl && (
                      <a
                        href={doubt.solutionYouTubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                      >
                        <Youtube className="h-4 w-4" />
                        Watch Solution
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}