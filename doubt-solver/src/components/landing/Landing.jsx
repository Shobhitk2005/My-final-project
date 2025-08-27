import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HelpCircle, 
  MessageCircle, 
  Video, 
  CheckCircle, 
  Users, 
  Clock,
  ArrowRight,
  Star
} from 'lucide-react';

export default function Landing() {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: <HelpCircle className="h-8 w-8 text-blue-600" />,
      title: "Ask Any Doubt",
      description: "Submit your physics, chemistry, or math doubts with detailed descriptions and images."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
      title: "Real-time Chat",
      description: "Get instant clarifications through our real-time messaging system with expert tutors."
    },
    {
      icon: <Video className="h-8 w-8 text-red-600" />,
      title: "Live Sessions",
      description: "Join one-on-one live video sessions for complex doubts that need detailed explanation."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-purple-600" />,
      title: "Solution Videos",
      description: "Access recorded solution videos for all your solved doubts anytime, anywhere."
    }
  ];

  const testimonials = [
    {
      name: "Priya S.",
      grade: "Class 12",
      text: "The live sessions are amazing! My physics doubts get cleared instantly.",
      rating: 5
    },
    {
      name: "Arjun K.",
      grade: "Class 11",
      text: "Solution videos help me revise concepts before exams. Highly recommended!",
      rating: 5
    },
    {
      name: "Sneha M.",
      grade: "Class 10",
      text: "Real-time chat feature is so convenient. I get help whenever I need it.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">DoubtSolver</span>
            </div>
            
            <div className="flex items-center gap-4">
              {currentUser ? (
                <Link to="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900">
                    Sign In
                  </Link>
                  <Link to="/signup" className="btn-primary">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            Solve Your Academic
            <span className="block text-blue-600">Doubts Instantly</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get personalized help from expert tutors through real-time chat, live video sessions, 
            and comprehensive solution videos for Physics, Chemistry, and Mathematics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {currentUser ? (
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                Go to Dashboard
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary text-lg px-8 py-3">
                  Start Learning
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-3">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides multiple ways to get help with your academic doubts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-100 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in just a few simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Sign Up & Subscribe
              </h3>
              <p className="text-gray-600">
                Create your account and subscribe to our affordable monthly plan via UPI payment.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Submit Your Doubt
              </h3>
              <p className="text-gray-600">
                Upload your questions with images and detailed descriptions for better understanding.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-6 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Get Expert Help
              </h3>
              <p className="text-gray-600">
                Receive solutions through chat, live sessions, and comprehensive video explanations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Students Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of students who have improved their grades with us
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.grade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Doubts Solved</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Excel in Your Studies?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our community of successful students and get expert help with all your academic doubts.
          </p>
          
          {currentUser ? (
            <Link to="/dashboard" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/signup" className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors">
              Get Started Today
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">DoubtSolver</span>
              </div>
              <p className="text-gray-400 mb-4">
                Your trusted partner in academic success. Get expert help with Physics, Chemistry, and Mathematics.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/signup" className="hover:text-white">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
                {currentUser && <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Subjects</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Physics</li>
                <li>Chemistry</li>
                <li>Mathematics</li>
                <li>More subjects coming soon</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DoubtSolver. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}