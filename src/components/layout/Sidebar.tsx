import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Home, 
  CreditCard, 
  Calendar, 
  AlertTriangle, 
  Users, 
  Vote, 
  Settings,
  Building2
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const navigation = [
  { name: 'dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'residente', 'proveedor'] },
  { name: 'payments', href: '/payments', icon: CreditCard, roles: ['admin', 'residente'] },
  { name: 'reservations', href: '/reservations', icon: Calendar, roles: ['admin', 'residente'] },
  { name: 'incidents', href: '/incidents', icon: AlertTriangle, roles: ['admin', 'residente', 'proveedor'] },
  { name: 'providers', href: '/providers', icon: Users, roles: ['admin', 'residente'] },
  { name: 'votes', href: '/votes', icon: Vote, roles: ['admin', 'residente'] },
  { name: 'admin', href: '/admin', icon: Settings, roles: ['admin'] },
];

export function Sidebar() {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(profile?.role || '')
  );

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg lg:block hidden">
      <div className="flex items-center justify-center h-16 px-4 bg-blue-600 dark:bg-blue-700">
        <div className="flex items-center space-x-3">
          <Building2 size={32} className="text-white" />
          <h1 className="text-xl font-bold text-white">Gourmet PA</h1>
        </div>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => `
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }
              `}
            >
              <item.icon size={20} className="mr-3" />
              {t(`navigation.${item.name}`)}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}