import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { MessageCircle, Clock, CheckCircle, AlertCircle, Play } from 'lucide-react';

export default function DoubtsList() {
  const { currentUser } = useAuth();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!currentUser) return;

    const doubtsQuery = query(
      collection(db, 'doubts'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(doubtsQuery, (snapshot) => {
      const doubtsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDoubts(doubtsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in_progress':
        return <Play className="h-5 w-5 text-blue-500" />;
      case 'solved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'closed':
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
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

  const filteredDoubts = doubts.filter(doubt => {
    if (filter === 'all') return true;
    return doubt.status === filter;
  });

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Doubts</h1>
        <Link to="/ask" className="btn-primary">
          Ask New Doubt
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { key: 'all', label: 'All' },
          { key: 'open', label: 'Open' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'solved', label: 'Solved' },
          { key: 'closed', label: 'Closed' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Doubts List */}
      {filteredDoubts.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No doubts yet' : `No ${filter} doubts`}
          </h3>
          <p className="text-gray-500 mb-4">
            {filter === 'all' 
              ? "Start by asking your first doubt!"
              : `You don't have any ${filter} doubts at the moment.`
            }
          </p>
          {filter === 'all' && (
            <Link to="/ask" className="btn-primary">
              Ask Your First Doubt
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDoubts.map(doubt => (
            <Link
              key={doubt.id}
              to={`/doubts/${doubt.id}`}
              className="block bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {doubt.title}
                  </h3>
                  <div className="flex items-center gap-2 ml-4">
                    {getStatusIcon(doubt.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doubt.status)}`}>
                      {doubt.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {doubt.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                      {doubt.subject}
                    </span>
                    <span>{formatDate(doubt.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {doubt.liveSessionLink && (
                      <span className="text-blue-600 font-medium">Live Session Available</span>
                    )}
                    {doubt.solutionYouTubeUrl && (
                      <span className="text-green-600 font-medium">Solution Available</span>
                    )}
                    <MessageCircle className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}