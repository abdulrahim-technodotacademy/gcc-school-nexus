
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, FileText, Upload, Search } from "lucide-react";
import { useState } from "react";

const RegistrationDashboard = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new');

  const stats = [
    { title: 'New Registrations Today', titleAr: 'التسجيلات الجديدة اليوم', value: '12', icon: UserPlus },
    { title: 'Promotions Processed', titleAr: 'الترقيات المعالجة', value: '8', icon: Users },
    { title: 'Documents Pending', titleAr: 'المستندات المعلقة', value: '5', icon: FileText },
    { title: 'Files Uploaded', titleAr: 'الملفات المرفوعة', value: '23', icon: Upload }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registration Department</h1>
          <p className="text-gray-600" dir="rtl">قسم التسجيل</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Search className="mr-2 h-4 w-4" />
          Search Students | البحث عن الطلاب
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-xs text-gray-500 mt-1" dir="rtl">{stat.titleAr}</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{stat.value}</p>
                </div>
                <stat.icon className="h-12 w-12 text-blue-600 opacity-80" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Action Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'new' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('new')}
        >
          New Student Registration | تسجيل طالب جديد
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'existing' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('existing')}
        >
          Existing Student Promotion | ترقية طالب موجود
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {activeTab === 'new' ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">New Student Registration Form</h2>
            <p className="text-gray-600" dir="rtl">نموذج تسجيل طالب جديد</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Personal Information | المعلومات الشخصية</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Student Name (English & Arabic)</p>
                  <p>• Date of Birth</p>
                  <p>• Nationality</p>
                  <p>• Gender</p>
                  <p>• National ID / Passport</p>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Required Documents | المستندات المطلوبة</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Birth Certificate</p>
                  <p>• Passport Copy</p>
                  <p>• Previous School Records</p>
                  <p>• Medical Records</p>
                  <p>• Guardian Information</p>
                </div>
              </Card>
            </div>
            
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <UserPlus className="mr-2 h-5 w-5" />
              Start New Registration | بدء تسجيل جديد
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Student Promotion</h2>
            <p className="text-gray-600" dir="rtl">ترقية الطلاب</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Current Academic Year | العام الدراسي الحالي</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Search existing students</p>
                  <p>• View academic history</p>
                  <p>• Check promotion eligibility</p>
                  <p>• Update class assignments</p>
                </div>
              </Card>
              
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Promotion Process | عملية الترقية</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Maintain student history</p>
                  <p>• Update grade level</p>
                  <p>• Assign new section</p>
                  <p>• Generate reports</p>
                </div>
              </Card>
            </div>
            
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              <Users className="mr-2 h-5 w-5" />
              Process Promotions | معالجة الترقيات
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrationDashboard;
