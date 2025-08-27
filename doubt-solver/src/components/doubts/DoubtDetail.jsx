import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
  ArrowLeft, 
  Send, 
  ExternalLink, 
  Play, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Youtube
} from 'lucide-react';

export default function DoubtDetail() {
  const { doubtId } = useParams();
  const { currentUser, isAdmin } = useAuth();
  const [doubt, setDoubt] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchDoubt();
    setupMessagesListener();
  }, [doubtId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchDoubt = async () => {
    try {
      const doubtDoc = await getDoc(doc(db, 'doubts', doubtId));
      if (doubtDoc.exists()) {
        setDoubt({ id: doubtDoc.id, ...doubtDoc.data() });
      }
    } catch (error) {
      console.error('Error fetching doubt:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupMessagesListener = () => {
    const messagesQuery = query(
      collection(db, 'doubts', doubtId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !currentUser) return;

    try {
      setSending(true);
      
      await addDoc(collection(db, 'doubts', doubtId, 'messages'), {
        senderId: currentUser.uid,
        senderRole: isAdmin ? 'admin' : 'student',
        text: newMessage.trim(),
        attachments: [],
        createdAt: serverTimestamp()
      });
      
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

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

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString('en-US', {
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

  if (!doubt) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Doubt not found</h3>
          <p className="text-gray-500 mb-4">This doubt may have been deleted or you don't have access to it.</p>
          <Link to="/doubts" className="btn-primary">
            Back to Doubts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/doubts" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 flex-1">{doubt.title}</h1>
        <div className="flex items-center gap-2">
          {getStatusIcon(doubt.status)}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(doubt.status)}`}>
            {doubt.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Doubt Details */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">
                {formatDate(doubt.createdAt)}
              </span>
              <span className="capitalize bg-gray-100 px-2 py-1 rounded text-sm">
                {doubt.subject}
              </span>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{doubt.description}</p>
            </div>
            
            {/* Images */}
            {doubt.images && doubt.images.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Attached Images</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doubt.images.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Doubt image ${index + 1}`}
                      className="w-full h-48 object-contain border rounded-lg bg-gray-50"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Discussion</h3>
            
            {/* Messages */}
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No messages yet. Start the discussion!
                </p>
              ) : (
                messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === currentUser?.uid ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === currentUser?.uid
                          ? 'bg-blue-600 text-white'
                          : message.senderRole === 'admin'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium">
                          {message.senderRole === 'admin' ? 'Admin' : 'You'}
                        </span>
                        <span className="text-xs opacity-75">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 input-field"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Live Session */}
          {doubt.liveSessionLink && (
            <div className="card">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Live Session</h4>
              <p className="text-gray-600 mb-4">
                Join the live session to discuss this doubt in real-time.
              </p>
              <a
                href={doubt.liveSessionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Join Live Session
              </a>
            </div>
          )}

          {/* Solution */}
          {doubt.status === 'solved' && (
            <div className="card">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Solution</h4>
              
              {doubt.solutionNotes && (
                <div className="mb-4">
                  <p className="text-gray-700 text-sm">{doubt.solutionNotes}</p>
                </div>
              )}
              
              {doubt.solutionYouTubeUrl && (
                <a
                  href={doubt.solutionYouTubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Youtube className="h-4 w-4" />
                  Watch Solution Video
                </a>
              )}
            </div>
          )}

          {/* Doubt Info */}
          <div className="card">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Doubt Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subject:</span>
                <span className="capitalize font-medium">{doubt.subject}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(doubt.status)}`}>
                  {doubt.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created:</span>
                <span>{formatDate(doubt.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Updated:</span>
                <span>{formatDate(doubt.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}