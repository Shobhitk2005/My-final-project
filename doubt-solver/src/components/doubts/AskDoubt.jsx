import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  doc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Upload, X, AlertCircle, Lock } from 'lucide-react';

export default function AskDoubt() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'physics'
  });
  
  const [selectedImages, setSelectedImages] = useState([]);

  const subjects = [
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'math', label: 'Mathematics' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    checkSubscriptionStatus();
  }, [currentUser, checkSubscriptionStatus]);

  const checkSubscriptionStatus = useCallback(async () => {
    if (!currentUser) return;

    try {
      const paymentsQuery = query(
        collection(db, 'payments'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      
      const querySnapshot = await getDocs(paymentsQuery);
      
      if (!querySnapshot.empty) {
        const latestPayment = querySnapshot.docs[0].data();
        setHasActiveSubscription(latestPayment.status === 'approved');
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate number of files
    if (files.length > 3) {
      setError('You can upload maximum 3 images');
      return;
    }
    
    // Validate each file
    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be less than 5MB');
        return;
      }
      
      validFiles.push(file);
    }
    
    setSelectedImages(validFiles);
    setError('');
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const uploadImages = async (doubtId) => {
    const imageUrls = [];
    
    for (let i = 0; i < selectedImages.length; i++) {
      const file = selectedImages[i];
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}_${i}.${fileExtension}`;
      const storagePath = `doubts/${currentUser.uid}/${doubtId}/${fileName}`;
      
      const storageRef = ref(storage, storagePath);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);
      
      imageUrls.push(downloadURL);
    }
    
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      setError('');
      
      // Create doubt document first
      const doubtRef = await addDoc(collection(db, 'doubts'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        title: formData.title.trim(),
        description: formData.description.trim(),
        subject: formData.subject,
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        liveSessionLink: '',
        solutionYouTubeUrl: '',
        solutionNotes: '',
        images: [] // Will be updated after image upload
      });
      
      // Upload images if any
      let imageUrls = [];
      if (selectedImages.length > 0) {
        imageUrls = await uploadImages(doubtRef.id);
        
        // Update doubt document with image URLs
        await updateDoc(doc(db, 'doubts', doubtRef.id), {
          images: imageUrls
        });
      }
      
      // Navigate to the doubt detail page
      navigate(`/doubts/${doubtRef.id}`);
      
    } catch (error) {
      console.error('Error submitting doubt:', error);
      setError('Failed to submit doubt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasActiveSubscription) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-8 text-center">
          <Lock className="h-12 w-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">Subscription Required</h2>
          <p className="text-amber-700 mb-6">
            You need an active subscription to ask doubts. Please complete your payment to access this feature.
          </p>
          <button
            onClick={() => navigate('/pay')}
            className="btn-primary"
          >
            Go to Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ask a Doubt</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="input-field"
            placeholder="Brief title for your doubt"
            value={formData.title}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <select
            id="subject"
            name="subject"
            className="input-field"
            value={formData.subject}
            onChange={handleInputChange}
          >
            {subjects.map(subject => (
              <option key={subject.value} value={subject.value}>
                {subject.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            required
            className="textarea-field"
            placeholder="Describe your doubt in detail..."
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
            Images (Optional, max 3)
          </label>
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          
          {selectedImages.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">Selected images:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Doubt'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate('/doubts')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}