import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, User, Lock, Building, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "@/components/layout/Navigation";

const userRoles = [
  {
    value: "registration",
    label: "Registration Officer",
    labelAr: "موظف تسجيل",
  },
    {
    value: "financial-Admin",
    label: "Financial Agreement Officer",
    labelAr: "موظف العقود المالية",
  },
    { 
    value: "School-admin", 
    label: "Accountant", 
    labelAr: "محاسب"
  },
  { 
    value: "accountant-Admin", 
    label: "Accountant Controlor", 
    labelAr: "مراقب مالي" 
  },
    {
    value: "student-list",
    label: "Student List",
    labelAr: "قوائم الطلاب",
  },
  
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

 const handleRoleClick = (role: string) => {
  if (role === "Addmission") {
    navigate("/student/addmission");
  } else {
    setActiveRole(role);
    // Auto-fill test credentials for specific roles
    if (role === "School-admin" || role === "financial-Admin" || role === "accountant-Admin") {
      setCredentials({
        username: "test",
        password: "test",
      });
    } else {
      // Reset for other roles
      setCredentials({
        username: "",
        password: "",
      });
    }
  }
};
  const handleLogin = (e: React.FormEvent, role: string) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast.error("Please fill in all fields");
      return;
    }

    console.log("Login attempt:", { ...credentials, role });
    toast.success(`Welcome! Logging in as ${role}`);

    const dashboardRoutes = {
      "registration": "/dashboard/registration",
      "student-list": "/dashboard/student-list",
     "School-admin": "/dashboard/admin",   // School Admin dashboard
     "financial-Admin": "/dashboard/financial", // Financial admin
     "accountant-Admin": "/dashboard/accountant", // Accountant
    };

    setTimeout(() => {
      navigate(dashboardRoutes[role as keyof typeof dashboardRoutes]);
      setActiveRole(null); // Close modal after navigation
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex flex-col items-center mb-8 pt-4">
            <div className="bg-gradient-to-br mb-4 mt-6">
              <img src="/assets/logobr.png" alt="School Logo" width={"80px"} />
            </div>
            <h1 className="text-3xl font-bold text-center">
              School Management Portal
            </h1>
            <p className="text-center text-gray-600" dir="rtl">
              بوابة إدارة المدرسة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {userRoles.map((role) => (
              <Button
                key={role.value}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => handleRoleClick(role.value)}
              >
                <Building className="h-6 w-6" />
                <div>
                  <div>{role.label}</div>
                  <div className="text-sm" dir="rtl">
                    {role.labelAr}
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="text-center text-sm text-gray-500 mt-8">
            <p>Secure access to school management system</p>
            <p dir="rtl">وصول آمن لنظام إدارة المدرسة</p>
          </div>
        </div>

        {/* Modal for login form - won't show for Admission role */}
        {activeRole && activeRole !== "Addmission" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 p-1 h-8 w-8"
                onClick={() => setActiveRole(null)}
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>

              <CardContent className="p-6 pt-10">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="h-5 w-5" />
                  <h2 className="text-xl font-semibold">
                    {userRoles.find((r) => r.value === activeRole)?.label}
                  </h2>
                </div>

                <form
                  onSubmit={(e) => handleLogin(e, activeRole)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="username"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Username | اسم المستخدم
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter username"
                      value={credentials.username}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          username: e.target.value,
                        })
                      }
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Password | كلمة المرور
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
                        })
                      }
                      className="h-12"
                    />
                  </div>

                  <Button
                    style={{ backgroundColor: "rgb(102,42,20)" }}
                    type="submit"
                    className="w-full h-12 text-white text-lg"
                  >
                    Login | دخول
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default LoginPage;
