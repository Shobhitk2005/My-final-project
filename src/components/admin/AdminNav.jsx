import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, CreditCard, HelpCircle, Settings } from 'lucide-react';

export default function AdminNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    {
      path: '/admin-2c9f7',
      label: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      path: '/admin-2c9f7/payments',
      label: 'Payments',
      icon: <CreditCard className="h-5 w-5" />
    },
    {
      path: '/admin-2c9f7/doubts',
      label: 'Doubts',
      icon: <HelpCircle className="h-5 w-5" />
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
            
            <div className="flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPath === item.path
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Direct Access: admin-2c9f7
          </div>
        </div>
      </div>
    </nav>
  );
}