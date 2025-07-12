import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, DollarSign, Users, Download, Eye, PenTool, Clock } from "lucide-react";
import { useState } from "react";

const FinancialAgreementDashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'fees' | 'agreements' | 'esign'>('pending');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Sample data for pending students
  const [pendingStudents, setPendingStudents] = useState([
    {
      id: 1,
      name: 'Ahmed Al-Maamari',
      nameAr: 'أحمد المعمري',
      grade: 'Grade 5',
      type: 'New Admission',
      typeAr: 'قيد جديد',
      registrationDate: '2023-05-15',
      status: 'Pending Agreement',
      statusAr: 'بانتظار العقد'
    },
    {
      id: 2,
      name: 'Mariam Al-Hinai',
      nameAr: 'مريم الهنائي',
      grade: 'Grade 8',
      type: 'Re-registration',
      typeAr: 'إعادة تسجيل',
      registrationDate: '2023-05-10',
      status: 'Pending Agreement',
      statusAr: 'بانتظار العقد'
    },
    {
      id: 3,
      name: 'Salim Al-Rashidi',
      nameAr: 'سليم الراشدي',
      grade: 'KG2',
      type: 'New Admission',
      typeAr: 'قيد جديد',
      registrationDate: '2023-05-18',
      status: 'Pending Agreement',
      statusAr: 'بانتظار العقد'
    }
  ]);

  const stats = [
    { 
      title: 'Pending Agreements', 
      titleAr: 'العقود المعلقة', 
      value: pendingStudents.length.toString(), 
      icon: Clock,
      color: 'text-yellow-600'
    },
    { 
      title: 'Fee Structures Created', 
      titleAr: 'هياكل الرسوم المنشأة', 
      value: '24', 
      icon: DollarSign,
      color: 'text-green-600'
    },
    { 
      title: 'Agreements Generated', 
      titleAr: 'الاتفاقيات المولدة', 
      value: '156', 
      icon: FileText,
      color: 'text-blue-600'
    },
    { 
      title: 'E-Signatures Pending', 
      titleAr: 'التوقيعات الإلكترونية المعلقة', 
      value: '12', 
      icon: PenTool,
      color: 'text-orange-600'
    }
  ];

  const classes = [
    'KG1', 'KG2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 
    'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 
    'Grade 10', 'Grade 11', 'Grade 12'
  ];

  const courses = ['Regular Program', 'Advanced Program', 'International Program'];

  const [feeStructure, setFeeStructure] = useState({
    tuitionFee: '',
    registrationFee: '',
    booksFee: '',
    uniformFee: '',
    transportFee: '',
    examFee: '',
    extraActivities: '',
    total: ''
  });

  const calculateTotal = () => {
    const total = Object.entries(feeStructure)
      .filter(([key]) => key !== 'total')
      .reduce((sum, [_, value]) => sum + (parseFloat(value) || 0), 0);
    
    setFeeStructure(prev => ({ ...prev, total: total.toString() }));
  };

  const handleCreateAgreement = (studentId: number) => {
    // In a real app, this would navigate to agreement creation page
    alert(`Creating agreement for student ID: ${studentId}`);
    // Filter out the student from pending list
    setPendingStudents(pendingStudents.filter(student => student.id !== studentId));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Agreement Officer</h1>
          <p className="text-gray-600" dir="rtl">موظف العقود المالية</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <FileText className="mr-2 h-4 w-4" />
          New Agreement | اتفاقية جديدة
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
                  <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`h-12 w-12 opacity-80 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Action Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'pending' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('pending')}
        >
          <Clock className="inline mr-2 h-4 w-4" />
          Pending Students | الطلاب المعلقة
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'fees' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('fees')}
        >
          <DollarSign className="inline mr-2 h-4 w-4" />
          Fee Structure | هيكل الرسوم
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'agreements' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('agreements')}
        >
          <FileText className="inline mr-2 h-4 w-4" />
          Agreements | الاتفاقيات
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'esign' ? 'border-b-2 border-green-600 text-green-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('esign')}
        >
          <PenTool className="inline mr-2 h-4 w-4" />
          E-Signature | التوقيع الإلكتروني
        </button>
      </div>

      {/* Content Area */}
      <div className="space-y-6">
        {activeTab === 'pending' && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Students | الطلاب المعلقة</CardTitle>
              <p className="text-sm text-gray-500">
                Students waiting for financial agreements from registration department
              </p>
              <p className="text-sm text-gray-500" dir="rtl">
                الطلاب الذين ينتظرون العقود المالية من قسم التسجيل
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" dir="rtl">اسم الطالب</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" dir="rtl">النوع</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingStudents.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" dir="rtl">{student.nameAr}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" dir="rtl">{student.typeAr}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.registrationDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Button 
                            onClick={() => handleCreateAgreement(student.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Create Agreement
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pendingStudents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No pending students requiring financial agreements
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'agreements' && (
          <Card>
            <CardHeader>
              <CardTitle>Financial Agreements | الاتفاقيات المالية</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Agreement Management</h3>
                <p className="text-gray-500 mb-6">Create and manage financial agreements for students</p>
                <div className="flex gap-4 justify-center">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <FileText className="mr-2 h-4 w-4" />
                    Create Agreement | إنشاء اتفاقية
                  </Button>
                  <Button variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View Agreements | عرض الاتفاقيات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'esign' && (
          <Card>
            <CardHeader>
              <CardTitle>E-Signature Management | إدارة التوقيع الإلكتروني</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <PenTool className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Digital Signatures</h3>
                <p className="text-gray-500 mb-6">Manage e-signatures for financial agreements</p>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800">Pending E-Signatures</h4>
                    <p className="text-yellow-700">12 agreements waiting for parent signatures</p>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <PenTool className="mr-2 h-4 w-4" />
                    Send for E-Signature | إرسال للتوقيع الإلكتروني
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FinancialAgreementDashboard;
