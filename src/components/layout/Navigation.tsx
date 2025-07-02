
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X, Globe } from "lucide-react";

interface NavigationProps {
  onLoginClick: () => void;
}

const Navigation = ({ onLoginClick }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const navItems = [
    { label: 'Home', labelAr: 'الرئيسية', href: '#home' },
    { label: 'About', labelAr: 'عن المدرسة', href: '#about' },
    { label: 'Academics', labelAr: 'الأكاديميات', href: '#academics' },
    { label: 'Admissions', labelAr: 'القبول', href: '#admissions' },
    { label: 'Contact', labelAr: 'اتصل بنا', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GCC School</h1>
              <p className="text-sm text-gray-600" dir="rtl">مدرسة دول مجلس التعاون</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                {language === 'en' ? item.label : item.labelAr}
              </a>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="text-gray-600 hover:text-blue-600"
            >
              <Globe className="h-4 w-4 mr-1" />
              {language === 'en' ? 'عربي' : 'English'}
            </Button>
            <Button 
              onClick={onLoginClick}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Login | دخول
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 mt-4">
            <div className="flex flex-col space-y-4 pt-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {language === 'en' ? item.label : item.labelAr}
                </a>
              ))}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
                  className="text-gray-600 hover:text-blue-600"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  {language === 'en' ? 'عربي' : 'English'}
                </Button>
                <Button 
                  onClick={() => {
                    onLoginClick();
                    setIsMenuOpen(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Login | دخول
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
