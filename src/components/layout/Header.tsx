import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Settings, User, LogOut, Moon, Sun, Globe } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

export function Header() {
  const { t, i18n } = useTranslation();
  const { profile, signOut } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('common.welcome')}, {profile?.full_name}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLanguageChange}
            className="flex items-center space-x-2"
          >
            <Globe size={20} />
            <span>{i18n.language.toUpperCase()}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          <Button variant="ghost" size="sm">
            <Bell size={20} />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings size={20} />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {profile?.full_name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t(`roles.${profile?.role}`)}
              </p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={signOut}
          >
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
}