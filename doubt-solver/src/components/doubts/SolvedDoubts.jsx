import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { CheckCircle, Youtube, Calendar, BookOpen } from 'lucide-react';

export default function SolvedDoubts() {
  const { currentUser } = useAuth();
  const [solvedDoubts, setSolvedDoubts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const doubtsQuery = query(
      collection(db, 'doubts'),
      where('userId', '==', currentUser.uid),
      where('status', '==', 'solved'),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(doubtsQuery, (snapshot) => {
      const doubtsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSolvedDoubts(doubtsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <CheckCircle className="h-8 w-8 text-green-600" />
        <h1 className="text-3xl font-bold text-gray-900">Solved Doubts</h1>
      </div>

      {solvedDoubts.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No solved doubts yet</h3>
          <p className="text-gray-500 mb-6">
            Once your doubts are solved, they'll appear here with solution videos and notes.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {solvedDoubts.map(doubt => (
            <div key={doubt.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      SOLVED
                    </span>
                    <span className="capitalize text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {doubt.subject}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {doubt.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {doubt.description}
                  </p>
                </div>
              </div>

              {/* Solution Content */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Solution
                </h3>

                {doubt.solutionNotes && (
                  <div className="mb-4">
                    <p className="text-green-700 leading-relaxed">
                      {doubt.solutionNotes}
                    </p>
                  </div>
                )}

                {doubt.solutionYouTubeUrl && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-700">
                      <Youtube className="h-5 w-5" />
                      <span className="font-medium">Solution Video Available</span>
                    </div>
                    <a
                      href={doubt.solutionYouTubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary bg-red-600 hover:bg-red-700"
                    >
                      <Youtube className="h-4 w-4 mr-2" />
                      Watch Video
                    </a>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Asked: {formatDate(doubt.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>Solved: {formatDate(doubt.updatedAt)}</span>
                  </div>
                </div>
              </div>

              {/* Images if any */}
              {doubt.images && doubt.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Original Images:</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {doubt.images.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Doubt image ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}