
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, FileText, Upload, Search } from "lucide-react";
import { useState } from "react";
import StudentSearchForm from "./StudentSearchForm";
import StudentDetailsView from "./StudentDetailsView";
import NewStudentRegistrationForm from "./NewStudentRegistrationForm";

const RegistrationDashboard = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'new' | 'promotion'>('search');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentForm, setShowStudentForm] = useState(false);

  const stats = [
    { title: 'New Registrations Today', titleAr: 'التسجيلات الجديدة اليوم', value: '12', icon: UserPlus },
    { title: 'Promotions Processed', titleAr: 'الترقيات المعالجة', value: '8', icon: Users },
    { title: 'Documents Pending', titleAr: 'المستندات المعلقة', value: '5', icon: FileText },
    { title: 'Files Uploaded', titleAr: 'الملفات المرفوعة', value: '23', icon: Upload }
  ];

  const handleStudentFound = (student: any) => {
    setSelectedStudent(student);
  };

  const handleEditStudent = () => {
    console.log('Edit student:', selectedStudent);
    // Implement edit functionality
  };

  const handlePromoteStudent = () => {
    console.log('Promote student:', selectedStudent);
    setActiveTab('promotion');
  };

  const handleNewRegistration = () => {
    setShowStudentForm(true);
    setActiveTab('new');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registration Officer</h1>
          <p className="text-gray-600" dir="rtl">موظف تسجيل</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNewRegistration}>
          <UserPlus className="mr-2 h-4 w-4" />
          New Registration | تسجيل جديد
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
          <UserPlus className="inline mr-2 h-4 w-4" />
          New Registration | تسجيل جديد
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'search' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('search')}
        >
          <Search className="inline mr-2 h-4 w-4" />
          Search Students | البحث عن الطلاب
        </button>
      
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'promotion' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('promotion')}
        >
          <Users className="inline mr-2 h-4 w-4" />
          Student Promotion | ترقية الطلاب
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'search' && (
          <>
            <StudentSearchForm onStudentFound={handleStudentFound} />
            {selectedStudent && (
              <StudentDetailsView 
                student={selectedStudent} 
                onEdit={handleEditStudent}
                onPromote={handlePromoteStudent}
              />
            )}
          </>
        )}

        {activeTab === 'new' && (
          <NewStudentRegistrationForm />
        )}

        {activeTab === 'promotion' && (
          <Card>
            <CardHeader>
              <CardTitle>Student Promotion | ترقية الطلاب</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Student Promotion System</h3>
                <p className="text-gray-500 mb-6">Search for a student first to process their promotion</p>
                <Button variant="outline" onClick={() => setActiveTab('search')}>
                  <Search className="mr-2 h-4 w-4" />
                  Search Students | البحث عن الطلاب
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RegistrationDashboard;
