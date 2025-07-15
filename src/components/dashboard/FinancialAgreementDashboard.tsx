import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FileText, DollarSign, PenTool, Clock } from "lucide-react";
import { useRef, useState } from "react";


const FinancialAgreementDashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'agreements' | 'esign'>('pending');
  const [selectedStudent, setSelectedStudent] = useState(null);
    const [completedAgreements, setCompletedAgreements] = useState([]);
  const agreementRef = useRef();
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
      status: 'Completed',
      statusAr: 'بانتظار العقد'
    }
  ]);
  const [completedStudents, setCompletedStudents] = useState([]);
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
  const [agreementDetails, setAgreementDetails] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const stats = [
    { 
      title: 'Pending Agreements', 
      titleAr: 'العقود المعلقة', 
      value: pendingStudents.length.toString(), 
      icon: Clock,
      color: 'text-yellow-600'
    },
    { 
      title: 'Agreements Generated', 
      titleAr: 'الاتفاقيات المولدة', 
      value: completedStudents.length.toString(), 
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

const calculateTotal = () => {
  setFeeStructure(prev => {
    const subtotal = Object.keys(prev)
      .filter(key => !['total', 'paymentPlan', 'discount'].includes(key))
      .reduce((sum, key) => sum + (parseFloat(prev[key]) || 0), 0);
    
    const discount = prev.paymentPlan === '1' ? 5 : 0;
    const total = subtotal * (1 - discount/100);
    
    return {
      ...prev,
      total: total.toFixed(2),
      discount
    };
  });
};

  const handleCreateAgreement = (student) => {
    setSelectedStudent(student);
    setActiveTab('agreements');
  };

  const handleSaveAgreement = () => {
    if (!selectedStudent || !agreementDetails) {
      alert('Please fill in all required fields.');
      return;
    }
    const newCompletedStudent = {
      ...selectedStudent,
      status: 'Agreement Created',
      statusAr: 'تم إنشاء العقد',
      agreementDetails,
      fees: feeStructure
    };
    setCompletedStudents([...completedStudents, newCompletedStudent]);
    setPendingStudents(pendingStudents.filter(student => student.id !== selectedStudent.id));
    setSelectedStudent(null);
    setFeeStructure({
      tuitionFee: '',
      registrationFee: '',
      booksFee: '',
      uniformFee: '',
      transportFee: '',
      examFee: '',
      extraActivities: '',
      total: ''
    });
    setAgreementDetails('');
    alert('Agreement created successfully!');
    setActiveTab('pending');
  };

  const handleSendForESignature = () => {
    alert(`Sent agreement for ${selectedStudent?.name} to e-signature.`);
    // In a real app, this would integrate with an e-signature service
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Agreement Officer</h1>
          <p className="text-gray-600" dir="rtl">موظف العقود المالية</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700" onClick={() => setActiveTab('agreements')}>
          <FileText className="mr-2 h-4 w-4" />
          New Agreement | اتفاقية جديدة
        </Button>
      </div>

      {/* Stats Overview */}
  

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
              <div className="mt-4">
                <Label>Filter by Status | تصفية حسب الحالة</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All | الكل</SelectItem>
                    <SelectItem value="pending">Pending | معلق</SelectItem>
                    <SelectItem value="completed">Completed | مكتمل</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {[...pendingStudents, ...completedStudents]
                      .filter(student => statusFilter === 'all' || student.status.includes(statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)))
                      .map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" dir="rtl">{student.nameAr}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.grade}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" dir="rtl">{student.typeAr}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.registrationDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {student.status === 'Pending Agreement' && (
                              <Button 
                                onClick={() => handleCreateAgreement(student)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                <FileText className="mr-2 h-4 w-4" />
                                Create Agreement
                              </Button>
                            )}
                            {student.status === 'Agreement Created' && (
                              <Button 
                                onClick={() => setActiveTab('esign')}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                              >
                                <PenTool className="mr-2 h-4 w-4" />
                                View E-Signature
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {[...pendingStudents, ...completedStudents].length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No students found
                </div>
              )}
            </CardContent>
          </Card>
        )}

    {activeTab === 'agreements' && (
  <Card>
    <CardHeader>
      <CardTitle>Create Financial Agreement | إنشاء اتفاقية مالية</CardTitle>
    </CardHeader>
    <CardContent>
      {selectedStudent ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">Student Details | تفاصيل الطالب</h3>
            <p>Name: {selectedStudent.name} | {selectedStudent.nameAr}</p>
            <p>Grade: {selectedStudent.grade}</p>
            <p>Type: {selectedStudent.type} | {selectedStudent.typeAr}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Fee Structure | هيكل الرسوم</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(feeStructure).filter(key => key !== 'total' && key !== 'paymentPlan' && key !== 'discount').map((key) => (
                <div key={key}>
                  <Label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</Label>
                  <Input
                    type="number"
                    value={feeStructure[key]}
                    onChange={(e) => {
                      setFeeStructure(prev => ({ ...prev, [key]: e.target.value }));
                      calculateTotal();
                    }}
                    placeholder="Enter amount"
                  />
                </div>
              ))}
              
              {/* Payment Plan Selection */}
              <div>
                <Label>Payment Plan | خطة الدفع</Label>
                <Select
                  value={feeStructure.paymentPlan || '1'}
                  onValueChange={(value) => {
                    setFeeStructure(prev => ({ 
                      ...prev, 
                      paymentPlan: value,
                      discount: value === '1' ? 5 : 0 // 5% discount for single payment
                    }));
                    calculateTotal();
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Full Payment (5% Discount) | دفعة واحدة (خصم 5%)</SelectItem>
                    <SelectItem value="2">2 Installments | 2 أقساط</SelectItem>
                    <SelectItem value="3">3 Installments | 3 أقساط</SelectItem>
                    <SelectItem value="4">4 Installments | 4 أقساط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Discount Display */}
              {feeStructure.discount > 0 && (
                <div>
                  <Label>Discount | خصم</Label>
                  <Input 
                    type="text" 
                    value={`${feeStructure.discount}%`} 
                    readOnly 
                  />
                </div>
              )}
              
              {/* Total Amount */}
              <div>
                <Label>Total | الإجمالي</Label>
                <Input 
                  type="text" 
                  value={feeStructure.total} 
                  readOnly 
                />
              </div>
              
              {/* Installment Breakdown */}
              {feeStructure.paymentPlan > 1 && (
                <div className="col-span-2">
                  <Label>Installment Breakdown | تفاصيل الأقساط</Label>
                  <div className="mt-2 p-4 border rounded">
                    {Array.from({ length: parseInt(feeStructure.paymentPlan) }).map((_, index) => {
                      const installmentAmount = (feeStructure.total * (1 - feeStructure.discount/100)) / feeStructure.paymentPlan;
                      return (
                        <p key={index} className="py-1">
                          Installment {index + 1}: {installmentAmount.toFixed(2)} | القسط {index + 1}: {installmentAmount.toFixed(2)}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <Label>Agreement Details | تفاصيل الاتفاقية</Label>
            <Textarea
              value={agreementDetails}
              onChange={(e) => setAgreementDetails(e.target.value)}
              placeholder="Enter agreement terms and conditions"
            />
          </div>
          <div className="flex gap-4">
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleSaveAgreement}>
              Save Agreement | حفظ الاتفاقية
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleSendForESignature}>
              Send for E-Signature | إرسال للتوقيع الإلكتروني
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Agreement Management</h3>
          <p className="text-gray-500 mb-6">Select a student from the Pending Students tab to create an agreement</p>
        </div>
      )}
    </CardContent>
  </Card>
)}

        {activeTab === 'esign' && (
          <Card>
            <CardHeader>
              <CardTitle>E-Signature Management | إدارة التوقيع الإلكتروني</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800">Pending E-Signatures</h4>
                  <p className="text-yellow-700">{completedStudents.length} agreements waiting for parent signatures</p>
                </div>
                {completedStudents.map((student) => (
                  <div key={student.id} className="border p-4 rounded-lg">
                    <p>Name: {student.name} | {student.nameAr}</p>
                    <p>Grade: {student.grade}</p>
                    <p>Total Fees: {student.fees.total}</p>
                    <Button className="bg-orange-600 hover:bg-orange-700 mt-2">
                      <PenTool className="mr-2 h-4 w-4" />
                      Signatures | توقيعات
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FinancialAgreementDashboard;