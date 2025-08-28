import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
// Direct admin access - no auth needed
import AdminNav from './AdminNav';
import { 
  Filter, 
  Search, 
  ExternalLink,
  AlertCircle,
  Clock,
  Play,
  CheckCircle,
  X as XIcon,
  Edit
} from 'lucide-react';

export default function AdminDoubts() {
  // Direct admin access - no auth needed
  const [doubts, setDoubts] = useState([]);
  const [filteredDoubts, setFilteredDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Direct admin access - load doubts immediately
    const doubtsQuery = query(
      collection(db, 'doubts'),
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
  }, []);

  useEffect(() => {
    let filtered = doubts;
    
    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter(doubt => doubt.status === filter);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doubt =>
        doubt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doubt.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doubt.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredDoubts(filtered);
  }, [doubts, filter, searchTerm]);

  const updateDoubtStatus = async (doubtId, newStatus) => {
    try {
      await updateDoc(doc(db, 'doubts', doubtId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating doubt status:', error);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-500" />;
      case 'solved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'closed':
        return <XIcon className="h-4 w-4 text-gray-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Doubts Management</h1>
      
      {/* Filters and Search */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">All Doubts</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="solved">Solved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>
      </div>

      {/* Doubts Table */}
      <div className="card overflow-hidden">
        {filteredDoubts.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doubts found</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? "No doubts have been submitted yet."
                : `No ${filter.replace('_', ' ')} doubts found.`
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doubt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoubts.map(doubt => (
                  <tr key={doubt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2">
                          {doubt.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                          {doubt.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doubt.userEmail}</div>
                      <div className="text-sm text-gray-500">ID: {doubt.userId.slice(-6)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="capitalize text-sm text-gray-900">{doubt.subject}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(doubt.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doubt.status)}`}>
                          {doubt.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(doubt.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {/* Quick Status Updates */}
                        <div className="flex items-center gap-1">
                          {doubt.status !== 'in_progress' && (
                            <button
                              onClick={() => updateDoubtStatus(doubt.id, 'in_progress')}
                              className="text-blue-600 hover:text-blue-700 text-xs"
                              title="Mark In Progress"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          {doubt.status !== 'solved' && (
                            <button
                              onClick={() => updateDoubtStatus(doubt.id, 'solved')}
                              className="text-green-600 hover:text-green-700 text-xs"
                              title="Mark Solved"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {doubt.status !== 'closed' && (
                            <button
                              onClick={() => updateDoubtStatus(doubt.id, 'closed')}
                              className="text-gray-600 hover:text-gray-700 text-xs"
                              title="Close Doubt"
                            >
                              <XIcon className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        
                        {/* View/Edit Doubt */}
                        <Link
                          to={`/admin-2c9f7/doubts/${doubt.id}`}
                          className="text-blue-600 hover:text-blue-700"
                          title="View/Edit Doubt"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}