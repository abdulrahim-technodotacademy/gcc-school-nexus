// AuthWrapper.tsx
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { toast } from '@/components/ui/use-toast'; // or use sonner if you prefer

interface AuthWrapperProps {
  children: ReactNode;
}

const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        toast({
          title: "Authentication Required",
          description: "Please login to access this page",
          variant: "destructive",
        });
        navigate('/admin/login');
        return;
      }

      try {
        const decodedToken = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('accessToken');
          toast({
            title: "Session Expired",
            description: "Your session has expired. Please login again.",
            variant: "destructive",
          });
          navigate('/admin/login');
        }
      } catch (error) {
        localStorage.removeItem('accessToken');
        toast({
          title: "Invalid Session",
          description: "Your session is invalid. Please login again.",
          variant: "destructive",
        });
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return <>{children}</>;
};

export default AuthWrapper;