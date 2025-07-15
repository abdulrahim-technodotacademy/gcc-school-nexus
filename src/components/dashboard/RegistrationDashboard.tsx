import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Users, UserPlus, FileText, Upload, Search, ChevronUp, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import NewStudentRegistrationForm from "./NewStudentRegistrationForm";

type Student = {
  id: string;
  name: string;
  currentClass: string;
  nextClass: string;
  status: 'pending' | 'verified' | 'rejected';
  registrationDate: string;
};

const RegistrationDashboard = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'new' | 'promotion'>('new');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'all' | 'pending' | 'verified'>('all');

  // Mock data - replace with API calls
  const classOptions = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
  const mockStudents: Student[] = [
    { id: '1', name: 'Ahmed Mohamed', currentClass: 'Grade 1', nextClass: 'Grade 2', status: 'verified', registrationDate: '2023-05-15' },
    { id: '2', name: 'Fatima Ali', currentClass: 'Grade 1', nextClass: 'Grade 2', status: 'pending', registrationDate: '2023-06-20' },
    { id: '3', name: 'Youssef Hassan', currentClass: 'Grade 2', nextClass: 'Grade 3', status: 'verified', registrationDate: '2023-04-10' },
    { id: '4', name: 'Mariam Abdullah', currentClass: 'Grade 2', nextClass: 'Grade 3', status: 'pending', registrationDate: '2023-06-18' },
    { id: '5', name: 'Khalid Omar', currentClass: 'Grade 3', nextClass: 'Grade 4', status: 'rejected', registrationDate: '2023-03-05' },
  ];

  // Load students based on active tab
  const loadStudents = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setStudents(mockStudents);
      setLoading(false);
    }, 500);
  };

  const handleClassChange = (classValue: string) => {
    setSelectedClass(classValue);
    const filteredStudents = mockStudents.filter(
      student => student.currentClass === classValue
    );
    setStudents(filteredStudents);
    setSelectedStudents({});
  };

  const verifyStudent = (studentId: string) => {
    setLoading(true);
    setTimeout(() => {
      setStudents(students.map(student => 
        student.id === studentId ? { ...student, status: 'verified' } : student
      ));
      setLoading(false);
    }, 300);
  };

  const rejectStudent = (studentId: string) => {
    setLoading(true);
    setTimeout(() => {
      setStudents(students.map(student => 
        student.id === studentId ? { ...student, status: 'rejected' } : student
      ));
      setLoading(false);
    }, 300);
  };

  const promoteStudents = async () => {
    setLoading(true);
    const studentIds = Object.keys(selectedStudents).filter(id => selectedStudents[id]);
    
    setTimeout(() => {
      console.log('Promoting students:', studentIds);
      setLoading(false);
      setSelectedStudents({});
      alert(`${studentIds.length} students promoted successfully!`);
      handleClassChange(selectedClass);
    }, 1000);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = verificationStatus === 'all' || student.status === verificationStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registration Officer</h1>
          <p className="text-gray-600" dir="rtl">موظف تسجيل</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setActiveTab('new')}>
          <UserPlus className="mr-2 h-4 w-4" />
          New Registration | تسجيل جديد
        </Button>
      </div>

      {/* Tabs */}
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
          onClick={() => { setActiveTab('search'); loadStudents(); }}
        >
          <Search className="inline mr-2 h-4 w-4" />
          Search & Verify | البحث والتحقق
        </button>
        <button
          className={`px-6 py-3 font-medium ${activeTab === 'promotion' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('promotion')}
        >
          <Users className="inline mr-2 h-4 w-4" />
          Student Promotion | ترقية الطلاب
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'search' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Student Verification | التحقق من الطلاب</span>
                <div className="flex gap-4">
                  <Select value={verificationStatus} onValueChange={(value: any) => setVerificationStatus(value)}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Students</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map(student => (
                      <TableRow key={student.id}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.currentClass}</TableCell>
                        <TableCell>{student.registrationDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {student.status === 'verified' && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                            {student.status === 'pending' && (
                              <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                            )}
                            {student.status === 'rejected' && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="capitalize">{student.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {student.status === 'pending' && (
                            <>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => verifyStudent(student.id)}
                                disabled={loading}
                              >
                                Verify
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600"
                                onClick={() => rejectStudent(student.id)}
                                disabled={loading}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {filteredStudents.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No students found matching your criteria
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'promotion' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Student Promotion | ترقية الطلاب</span>
                {selectedClass && (
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="pl-10 pr-4 py-2 border rounded-md w-full text-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Select onValueChange={handleClassChange} value={selectedClass}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={promoteStudents}
                  disabled={Object.values(selectedStudents).filter(Boolean).length === 0 || loading}
                  className="gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      Promote Selected ({Object.values(selectedStudents).filter(Boolean).length})
                    </>
                  )}
                </Button>
              </div>

              {selectedClass ? (
                filteredStudents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox 
                            checked={filteredStudents.every(s => selectedStudents[s.id])}
                            onCheckedChange={() => {
                              const allSelected = filteredStudents.every(s => selectedStudents[s.id]);
                              const newSelection = {...selectedStudents};
                              filteredStudents.forEach(student => {
                                newSelection[student.id] = !allSelected;
                              });
                              setSelectedStudents(newSelection);
                            }}
                          />
                        </TableHead>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Current Class</TableHead>
                        <TableHead>Next Class</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map(student => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Checkbox 
                              checked={!!selectedStudents[student.id]}
                              onCheckedChange={() => {
                                setSelectedStudents(prev => ({
                                  ...prev,
                                  [student.id]: !prev[student.id]
                                }));
                              }}
                            />
                          </TableCell>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.currentClass}</TableCell>
                          <TableCell>{student.nextClass}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              student.status === 'verified' ? 'bg-green-100 text-green-800' :
                              student.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {student.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedStudents({ [student.id]: true });
                                promoteStudents();
                              }}
                              disabled={loading || student.status !== 'verified'}
                            >
                              {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Promote"
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm 
                      ? "No students match your search criteria" 
                      : "No students found in this class"}
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Student Promotion System</h3>
                  <p className="text-gray-500 mb-6">Select a class to view students available for promotion</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'new' && (
          <NewStudentRegistrationForm />
        )}
      </div>
    </div>
  );
};

export default RegistrationDashboard;