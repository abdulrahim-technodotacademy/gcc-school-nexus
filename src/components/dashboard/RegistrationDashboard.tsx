import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Users,
  UserPlus,
  FileText,
  Upload,
  Search,
  ChevronUp,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import NewStudentRegistrationForm from "./NewStudentRegistrationForm";
import { log } from "console";
import { toast } from "@/hooks/use-toast";

type Student = {
  id: string;
  name_en: string;
  name_ar: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  place_of_birth: string;
  religion: string;
  currentClass: string;
  selectedDepartment: string;
  selectedSection: string;
  currentSection: string;
  filteredSections: any;
  nextClass: string;
  nextSection: string;
  status: "pending" | "verified" | "rejected";
  registrationDate: string;
  isNewRegistration?: boolean;
  guardian?: {
    name_en: string;
    name_ar: string;
    phone: string;
    relationship: string;
    national_id: string;
  };
  admission_class?: {
    id: string,
    department_name?: "10"
};
  documents?: Array<{
    type: string;
    file: string;
  }>;
};


type Department = {
  id: string;
   department_name: string;
};



const RegistrationDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"search" | "new" | "promotion">(
    "new"
  );
   const [departments, setDepartments] = useState<Department[]>([]);
   const [sections, setSections] = useState([]);
  const [classList, setClassList] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);

    const [filteredSections, setFilteredSections] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
const [promotingStudentId, setPromotingStudentId] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<
    Record<string, boolean>
  >({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "all" | "pending" | "verified"
  >("all");

  // Mock data - replace with API calls
  const classOptions = [
    "Grade 1",
    "Grade 2",
    "Grade 3",
    "Grade 4",
    "Grade 5",
    "Grade 6",
  ];



const loadStudents = async () => {
  setLoading(true);

  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
    //   `${import.meta.env.VITE_API_BASE_URL}/students/student/`,
      `${import.meta.env.VITE_API_BASE_URL}/students/get-studentdetails-all/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch students from API");
    }

      const result = await response.json();

      
      console.log(result.data);
      
      const studentsData: Student[] = result.data.map((student: any, index: number) => ({
      id: student.id,
      name_en: `${student.en_first_name} ${student.en_middle_name ?? ""} ${student.en_last_name}`.trim(),
      name_ar: `${student.ar_first_name} ${student.ar_middle_name ?? ""} ${student.ar_last_name}`.trim(),
      date_of_birth: student.date_of_birth,
      gender: student.gender === "M" ? "Male" : "Female",
      nationality: student.nationality,
      place_of_birth: student.city, // or use student.address if preferred
      religion: student.religion,
      currentClass: student.admission_class?.department_name || "Unknown",
      currentSection: student.section?.name || "Unknown",
      nextClass: "", // Optional: Update this if logic is available
      nextSection: "",
      status: student.is_verified_registration_officer ? "verified" : "pending",
      registrationDate: student.admission_date,
      isNewRegistration: true,
      guardian: student.guardian,
      documents: [], // Populate this if available
    }));


 

    

    // const studentsData = result.data;
    setStudents(studentsData); // React will update state asynchronously
    // console.log("Students loaded:", studentsData); // Use this

   const uniqueClasses = Array.from(
      new Set(studentsData.map((student) => student.currentClass))
    ).sort((a, b) => {
      return isNaN(Number(a)) || isNaN(Number(b))
        ? a.localeCompare(b)
        : Number(a) - Number(b);
    });

    setClassList(uniqueClasses);
    setStudents(studentsData);

  } catch (error) {
    console.error("Error loading students:", error);
  } finally {
    setLoading(false);
  }
};



 const fetchDepartments = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/students/department/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch departments");
      }

      const data = await res.json();
      console.log(data.data);
      
      setDepartments(data.data);
    } catch (err: any) {
      console.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  const fetchSections = async () => {
  setLoading(true);
  const token = localStorage.getItem("accessToken");

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/students/section/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sections");
    }

    const result = await response.json();
    console.log("Sections:", result.data);
    setSections(result.data); // assuming you have: const [sections, setSections] = useState([])
  } catch (error: any) {
    console.error(error.message || "Something went wrong while fetching sections");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchDepartments();
      fetchSections();
    if (activeTab === "search" || activeTab === "promotion") {
      loadStudents();
    }
  }, [activeTab]);

const handleClassChange = (classValue: string) => {
  setSelectedClass(classValue);
  // Don't filter students here - we'll use filteredStudents for display
  setSelectedStudents({});
}

  const handleDepartmentChange = (e) => {
  const deptId = e.target.value;
  setSelectedDepartment(deptId);
  const filtered = sections.filter(sec => sec.department === deptId);
  setFilteredSections(filtered);
};

const verifyStudent = async (studentId: string) => {
  setLoading(true);

  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/students/student/${studentId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_verified_registration_officer: true,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify student");
    }

   
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, status: "verified", is_verified_registration_officer: true }
          : student
      )
    );
  } catch (error) {
    console.error("Error verifying student:", error);
  } finally {
    setLoading(false);
  }
};
const rejectStudent = async (studentId: string) => {
  setLoading(true);

  try {
    const token = localStorage.getItem("accessToken");

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/students/student/${studentId}/`,
      {
        method: "PATCH", // or "PUT" if your backend expects full replacement
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          is_deleted: true,
          is_active: true,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify student");
    }

    // Optional: update UI immediately
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? { ...student, status: "rejected" }
          : student
      )
    );
  } catch (error) {
    console.error("Error verifying student:", error);
  } finally {
    setLoading(false);
  }
};




  const clearVerifiedRegistrations = () => {
    const storedRegistrations = localStorage.getItem("studentRegistrations");
    if (storedRegistrations) {
      const registrations = JSON.parse(storedRegistrations);
      // Keep only pending registrations
      const pendingRegistrations = registrations.filter(
        (reg: any, index: number) => {
          const studentId = `local-${index}`;
          const student = students.find((s) => s.id === studentId);
          return !student || student.status === "pending";
        }
      );

      localStorage.setItem(
        "studentRegistrations",
        JSON.stringify(pendingRegistrations)
      );
    }
  };



const promoteStudent = async (studentId: string, newClass: string, newSection: string) => {
  const token = localStorage.getItem("accessToken");
  
  // Validate selections
  if (!newClass || !newSection) {
    toast({
      title: "Error",
      description: "Please select both class and section",
      variant: "destructive",
    });
    return;
  }

  setPromotingStudentId(studentId); // Set promoting student ID

  try {
    const promoteRes = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/students/students/promote/${studentId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          admission_class: newClass,
          section: newSection,
        }),
      }
    );

    if (!promoteRes.ok) throw new Error("Failed to promote");

    // Instead of updating local state, trigger a full reload
    toast({
      title: "Student Promoted",
      description: "Refreshing student data...",
    });

    // Reload the promotion tab data
    await loadStudents();

  } catch (err) {
    console.error(err);
    toast({
      title: "Error",
      description: "Failed to complete promotion process",
      variant: "destructive",
    });
  } finally {
    setPromotingStudentId(null); // Reset promoting student ID
  }
};


const filteredStudents = students.filter((student) => {
  const nameEn = student.name_en || '';
  const nameAr = student.name_ar || '';
  
  const matchesSearch =
    nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nameAr.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesStatus =
    verificationStatus === "all" || student.status === verificationStatus;
  
  const matchesClass =
    !selectedClass || student.currentClass === selectedClass;
  
  return matchesSearch && matchesStatus && matchesClass;
});

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Registration Officer
          </h1>
          <p className="text-gray-600" dir="rtl">
            موظف تسجيل
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setActiveTab("new")}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          New Registration | تسجيل جديد
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          className={`px-6 py-3 font-medium ${
            activeTab === "new"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("new")}
        >
          <UserPlus className="inline mr-2 h-4 w-4" />
          New Registration | تسجيل جديد
        </button>
        <button
          className={`px-6 py-3 font-medium ${
            activeTab === "search"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => {
            setActiveTab("search");
            loadStudents();
          }}
        >
          <Search className="inline mr-2 h-4 w-4" />
          Search & Verify | البحث والتحقق
        </button>
        <button
          className={`px-6 py-3 font-medium ${
            activeTab === "promotion"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600"
          }`}
          onClick={() => {
            setActiveTab("promotion");
            loadStudents();
          }}
        >
          <Users className="inline mr-2 h-4 w-4" />
          Student Promotion | ترقية الطلاب
        </button>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === "search" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Student Verification | التحقق من الطلاب</span>
                <div className="flex gap-4">
                  <Select
                    value={verificationStatus}
                    onValueChange={(value: any) => setVerificationStatus(value)}
                  >
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
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell
                          className="cursor-pointer hover:underline hover:text-blue-600"
                          onClick={() => navigate(`/student/${student.id}`)}
                        >
                          {student.name_en}
                          {student.isNewRegistration && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              New
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{student.currentClass} {student.currentSection}</TableCell>
                        <TableCell>{student.registrationDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {student.status === "verified" && (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                            {student.status === "pending" && (
                              <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                            )}
                            {student.status === "rejected" && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="capitalize">{student.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          {student.status === "pending" && (
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

        {activeTab === "promotion" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Student Promotion | ترقية الطلاب</span>
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
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Select onValueChange={handleClassChange} value={selectedClass}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classList.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedClass ? (
                filteredStudents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Current Class</TableHead>
                        <TableHead>Next Class</TableHead>
                        <TableHead>Next Section</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            {student.name_en}
                            {student.isNewRegistration && (
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                New
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{student.currentClass} {student.currentSection}</TableCell>
                         
                            <TableCell>
                                <Select
                                    value={student.selectedDepartment || ""}
                                    onValueChange={(value) => {
                                    const updatedStudents = students.map((s) =>
                                        s.id === student.id
                                        ? {
                                            ...s,
                                            selectedDepartment: value,
                                            filteredSections: sections.filter((sec) => sec.department === value),
                                            selectedSection: "", // reset section
                                            }
                                        : s
                                    );
                                    setStudents(updatedStudents);
                                    }}
                                >
                                    <SelectTrigger className="w-[120px] md:w-[180px] text-sm">
                                    <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id}>
                                        {dept.department_name}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                </TableCell>


                                <TableCell>
                        <Select
                            value={student.selectedSection || ""}
                            onValueChange={(value) => {
                            const updatedStudents = students.map((s) =>
                                s.id === student.id ? { ...s, selectedSection: value } : s
                            );
                            setStudents(updatedStudents);
                            }}
                        >
                            <SelectTrigger className="w-[120px] md:w-[180px] text-sm">
                            <SelectValue placeholder="Select Section" />
                            </SelectTrigger>
                            <SelectContent>
                            {(student.filteredSections || []).map((sec) => (
                                <SelectItem key={sec.id} value={sec.id}>
                                {sec.name}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </TableCell>

                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                student.status === "verified"
                                  ? "bg-green-100 text-green-800"
                                  : student.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.status}
                            </span>
                          </TableCell>
<TableCell className="text-right">
  <Button
    variant="outline"
    size="sm"
    onClick={async () => {
      await promoteStudent(
        student.id, 
        student.selectedDepartment, 
        student.selectedSection
      );
    }}
    disabled={
      promotingStudentId !== null || 
      student.status !== "verified" ||
      !student.selectedDepartment ||
      !student.selectedSection
    }
  >
    {promotingStudentId === student.id ? (
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
                   <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Current Class</TableHead>
                        <TableHead>Next Class</TableHead>
                        <TableHead>Next Section</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            {student.name_en}
                            {student.isNewRegistration && (
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                New
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{student.currentClass} {student.currentSection}</TableCell>
                            <TableCell>
                            <Select
                                value={student.selectedDepartment || ""}
                                onValueChange={(value) => {
                                const updatedStudents = students.map((s) =>
                                    s.id === student.id
                                    ? {
                                        ...s,
                                        selectedDepartment: value,
                                        filteredSections: sections.filter((sec) => sec.department === value),
                                        selectedSection: "", // reset section
                                        }
                                    : s
                                );
                                setStudents(updatedStudents);
                                }}
                            >
                                <SelectTrigger className="w-[120px] md:w-[180px] text-sm">
                                <SelectValue placeholder="Select Department" />
                                </SelectTrigger>
                                <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>
                                    {dept.department_name}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            </TableCell>
                            <TableCell>
                            <Select
                                value={student.selectedSection || ""}
                                onValueChange={(value) => {
                                const updatedStudents = students.map((s) =>
                                    s.id === student.id ? { ...s, selectedSection: value } : s
                                );
                                setStudents(updatedStudents);
                                }}
                            >
                                <SelectTrigger className="w-[120px] md:w-[180px] text-sm">
                                <SelectValue placeholder="Select Section" />
                                </SelectTrigger>
                                <SelectContent>
                                {(student.filteredSections || []).map((sec) => (
                                    <SelectItem key={sec.id} value={sec.id}>
                                    {sec.name}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                student.status === "verified"
                                  ? "bg-green-100 text-green-800"
                                  : student.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                             <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    promoteStudent(student.id, student.selectedDepartment, student.selectedSection);

                                }}
                                disabled={loading || student.status !== "verified"}
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
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === "new" && (
          <NewStudentRegistrationForm onSuccess={() => loadStudents()} />
        )}
      </div>
    </div>
  );
};

export default RegistrationDashboard;