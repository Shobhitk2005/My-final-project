import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Upload, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';

export default function PaymentFlow() {
  const { currentUser } = useAuth();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const UPI_ID = "doubtsolver@upi"; // Replace with your actual UPI ID

  useEffect(() => {
    fetchPaymentStatus();
  }, [currentUser]);

  const fetchPaymentStatus = async () => {
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
        setPaymentStatus(latestPayment.status);
      } else {
        setPaymentStatus(null);
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setError('Please upload only JPG, PNG, or PDF files');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUploadProof = async () => {
    if (!selectedFile || !currentUser) return;

    try {
      setUploading(true);
      setError('');

      // Generate unique filename
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExtension}`;
      const storagePath = `paymentProofs/${currentUser.uid}/${fileName}`;
      
      // Upload file to Firebase Storage
      const storageRef = ref(storage, storagePath);
      const uploadResult = await uploadBytes(storageRef, selectedFile);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      // Create payment document in Firestore
      await addDoc(collection(db, 'payments'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        proofUrl: downloadURL,
        status: 'pending',
        createdAt: serverTimestamp(),
        reviewedAt: null,
        reviewedBy: null,
        notes: ''
      });

      setPaymentStatus('pending');
      setSelectedFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('proof-upload');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading payment proof:', error);
      setError('Failed to upload payment proof. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Subscription Payment</h1>
      
      {/* Payment Status */}
      {paymentStatus === 'approved' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Active Subscription</h3>
              <p className="text-green-700">Your payment has been approved. You can now ask doubts!</p>
            </div>
          </div>
          <div className="mt-4">
            <a href="/ask" className="btn-primary">
              Ask Your First Doubt
            </a>
          </div>
        </div>
      )}

      {paymentStatus === 'pending' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">Payment Under Review</h3>
              <p className="text-yellow-700">Your payment proof is being reviewed. This usually takes 24-48 hours.</p>
            </div>
          </div>
        </div>
      )}

      {paymentStatus === 'rejected' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <X className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Payment Rejected</h3>
              <p className="text-red-700">Your payment proof was rejected. Please upload a valid payment proof.</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Instructions */}
      {(!paymentStatus || paymentStatus === 'rejected') && (
        <div className="space-y-8">
          {/* UPI Payment Details */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Instructions</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  UPI ID
                </label>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <code className="text-lg font-mono text-blue-600">{UPI_ID}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(UPI_ID)}
                    className="btn-secondary text-xs"
                  >
                    Copy
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code
                </label>
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                  <img 
                    src="/qr.png" 
                    alt="UPI QR Code" 
                    className="w-48 h-48 object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <div className="hidden text-gray-500 text-center">
                    <p>QR Code not available</p>
                    <p className="text-sm">Please use the UPI ID above</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-800">Important Warning</span>
                </div>
                <p className="text-amber-700 mt-2">
                  ⚠️ Fraudulent uploads will result in permanent ban. Only upload genuine payment screenshots or receipts.
                </p>
              </div>
            </div>
          </div>

          {/* Upload Payment Proof */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Payment Proof</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center gap-3">
                <X className="h-5 w-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="proof-upload" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Payment Screenshot/Receipt (JPG, PNG, or PDF)
                </label>
                <input
                  id="proof-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileSelect}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              
              {selectedFile && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Upload className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800">Selected: {selectedFile.name}</span>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleUploadProof}
                disabled={!selectedFile || uploading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Payment Proof'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}