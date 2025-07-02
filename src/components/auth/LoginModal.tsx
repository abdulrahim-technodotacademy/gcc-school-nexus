
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, User, Lock, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    role: ''
  });

  const userRoles = [
    { value: 'registration', label: 'Registration Staff', labelAr: 'موظف التسجيل' },
    { value: 'financial', label: 'Financial Agreement Staff', labelAr: 'موظف الاتفاقية المالية' },
    { value: 'accountant', label: 'Accountant Staff', labelAr: 'موظف المحاسبة' },
    { value: 'student-list', label: 'Student List Staff', labelAr: 'موظف قوائم الطلاب' },
    { value: 'account-admin', label: 'Account Admin', labelAr: 'مدير الحسابات' }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.username || !credentials.password || !credentials.role) {
      toast.error("Please fill in all fields");
      return;
    }

    // Mock authentication - in real app, this would call your API
    console.log('Login attempt:', credentials);
    
    toast.success(`Welcome! Logging in as ${credentials.role}`);
    
    // Navigate to appropriate dashboard based on role
    const dashboardRoutes = {
      'registration': '/dashboard/registration',
      'financial': '/dashboard/financial',
      'accountant': '/dashboard/accountant', 
      'student-list': '/dashboard/student-list',
      'account-admin': '/dashboard/admin'
    };
    
    setTimeout(() => {
      navigate(dashboardRoutes[credentials.role as keyof typeof dashboardRoutes]);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-2xl">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            School Management Portal
          </DialogTitle>
          <p className="text-center text-gray-600" dir="rtl">
            بوابة إدارة المدرسة
          </p>
        </DialogHeader>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Role | الدور
                </Label>
                <Select 
                  value={credentials.role} 
                  onValueChange={(value) => setCredentials({...credentials, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role | اختر دورك" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex flex-col">
                          <span>{role.label}</span>
                          <span className="text-sm text-gray-500" dir="rtl">{role.labelAr}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username | اسم المستخدم
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password | كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className="h-12"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white text-lg"
              >
                Login | دخول
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          <p>Secure access to school management system</p>
          <p dir="rtl">وصول آمن لنظام إدارة المدرسة</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
