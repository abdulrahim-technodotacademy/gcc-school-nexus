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
  nextClass: string;
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



const RegistrationDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"search" | "new" | "promotion">(
    "new"
  );
   const [departments, setDepartments] = useState<Department[]>([]);
  const [classList, setClassList] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
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
      `${import.meta.env.VITE_API_BASE_URL}/students/get-studentdetails-all/?is_verified_registration_officer=true`,
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
      nextClass: "", // Optional: Update this if logic is available
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
    new Set(students.map((student) => student.currentClass))
  ).sort((a, b) => {
    return isNaN(Number(a)) || isNaN(Number(b))
      ? a.localeCompare(b)
      : Number(a) - Number(b);
  });

  setClassList(uniqueClasses);

  } catch (error) {
    console.error("Error loading students:", error);
  } finally {
    setLoading(false);
  }
};



// const loadStudents = async () => {
//   setLoading(true);

//   try {
//      const token = localStorage.getItem("accessToken"); 
//     const response = await fetch(
//     //   `${import.meta.env.VITE_API_BASE_URL}/students/student/`,
//       `${import.meta.env.VITE_API_BASE_URL}/students/get-studentdetails-all/?is_verified_registration_officer=false`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // <-- Add token here
//         },
//       }
//     );
//     if (!response.ok) {
//       throw new Error("Failed to fetch students from API");
//     }

//       const result = await response.json();

//     if (!result.status) {
//       throw new Error(result.message || "API responded with an error");
//     }
// console.log(result.data);

//     // Convert response to Student[] type
//    const apiStudents: Student[] = result.data.map((student: any, index: number) => ({
//       id: student.id,
//       name_en: `${student.en_first_name} ${student.en_middle_name ?? ""} ${student.en_last_name}`.trim(),
//       name_ar: `${student.ar_first_name} ${student.ar_middle_name ?? ""} ${student.ar_last_name}`.trim(),
//       date_of_birth: student.date_of_birth,
//       gender: student.gender === "M" ? "Male" : "Female",
//       nationality: student.nationality,
//       place_of_birth: student.city, // or you can use student.address
//       religion: student.religion,
//       currentClass: student.admission_class?.department_name || "Unknown",
//       nextClass: "Pending", // You can compute this later
//       status: student.is_verified_registration_officer ? "verified" : "pending",
//       registrationDate: student.admission_date,
//       isNewRegistration: true,
//       guardian: student.guardian,
//       documents: [], // If documents are available, map them here
//     }));

    

//     // Optionally merge with mockStudents if needed
//     const allStudents = [...apiStudents];

//     setStudents(allStudents);
//   } catch (error) {
//     console.error("Error loading students:", error);
//   } finally {
//     setLoading(false);
//   }
// };



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
      setDepartments(data);
    } catch (err: any) {
      console.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    if (activeTab === "search" || activeTab === "promotion") {
      loadStudents();
    }
  }, [activeTab]);

  const handleClassChange = (classValue: string) => {
    setSelectedClass(classValue);
    const filteredStudents = students.filter(
      (student) => student.currentClass === classValue
    );
    setStudents(filteredStudents);
    setSelectedStudents({});
  };

const verifyStudent = async (studentId: string) => {
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
          is_verified_registration_officer: true,
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


  const rejectStudent = (studentId: string) => {
    setLoading(true);
    setTimeout(() => {
      setStudents(
        students.map((student) =>
          student.id === studentId
            ? { ...student, status: "rejected" }
            : student
        )
      );
      setLoading(false);
      clearVerifiedRegistrations();
    }, 300);
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

//   const promoteStudents = async () => {
//     setLoading(true);
//     const studentIds = Object.keys(selectedStudents).filter(
//       (id) => selectedStudents[id]
//     );

//     setTimeout(() => {
//       console.log("Promoting students:", studentIds);
//       setLoading(false);
//       setSelectedStudents({});
//       alert(`${studentIds.length} students promoted successfully!`);
//       handleClassChange(selectedClass);
//     }, 1000);
//   };



const promoteStudent = async (studentId: string, newClass: string) => {

  console.log("Promoting student:", studentId, "to class:", newClass);

  const student = students.find((s) => s.id === studentId);
  

  console.log("Promoting student:", studentId, "to class:", newClass);
  

  const token = localStorage.getItem("accessToken");

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/students/student/${studentId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          admission_class: {
            department_name: newClass,
          },
        }),
      }
    );

    if (!res.ok) throw new Error("Failed to promote");

   
    await loadStudents(); // refresh
  } catch (err) {
    console.error(err);
   
  }
};



  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.name_ar.toLowerCase().includes(searchTerm.toLowerCase());
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
                        <TableCell>{student.currentClass}</TableCell>
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

                {/* <Button
                  onClick={promoteStudents}
                  disabled={
                    Object.values(selectedStudents).filter(Boolean).length ===
                      0 || loading
                  }
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
                      Promote Selected (
                      {Object.values(selectedStudents).filter(Boolean).length})
                    </>
                  )}
                </Button> */}
              </div>

              {selectedClass ? (
                filteredStudents.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {/* <TableHead className="w-[50px]">
                          <Checkbox
                            checked={filteredStudents.every(
                              (s) => selectedStudents[s.id]
                            )}
                            onCheckedChange={() => {
                              const allSelected = filteredStudents.every(
                                (s) => selectedStudents[s.id]
                              );
                              const newSelection = { ...selectedStudents };
                              filteredStudents.forEach((student) => {
                                newSelection[student.id] = !allSelected;
                              });
                              setSelectedStudents(newSelection);
                            }}
                          />
                        </TableHead> */}
                        <TableHead>Student Name</TableHead>
                        <TableHead>Current Class</TableHead>
                        <TableHead>Next Class</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          {/* <TableCell>
                            <Checkbox
                              checked={!!selectedStudents[student.id]}
                              onCheckedChange={() => {
                                setSelectedStudents((prev) => ({
                                  ...prev,
                                  [student.id]: !prev[student.id],
                                }));
                              }}
                            />
                          </TableCell> */}
                          <TableCell>
                            {student.name_en}
                            {student.isNewRegistration && (
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                New
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{student.currentClass}</TableCell>
                          <TableCell>
                            <Select
                                value={student.nextClass}
                                onValueChange={(value) => {
                                const updatedStudents = students.map((s) =>
                                    s.id === student.id ? { ...s, nextClass: value } : s
                                );
                                setStudents(updatedStudents);
                                }}
                            >
                                <SelectTrigger className="w-[130px] md:w-[180px] text-sm">
                                <SelectValue placeholder="Select class" />
                                </SelectTrigger>
                                <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.department_name}>
                                    {dept.department_name}
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
                                    promoteStudent(student.id, student.nextClass);
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
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm
                      ? "No students match your search criteria"
                      : "No students found in this class"}
                  </div>
                )
              ) : (
                // <div className="text-center py-8 text-gray-500">
                //   <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                //   <h3 className="text-xl font-semibold text-gray-700 mb-2">
                //     Student Promotion System
                //   </h3>
                //   <p className="text-gray-500 mb-6">
                //     Select a class to view students available for promotion
                //   </p>
                // </div>
                   <Table>
                    <TableHeader>
                      <TableRow>
                        {/* <TableHead className="w-[50px]">
                          <Checkbox
                            checked={filteredStudents.every(
                              (s) => selectedStudents[s.id]
                            )}
                            onCheckedChange={() => {
                              const allSelected = filteredStudents.every(
                                (s) => selectedStudents[s.id]
                              );
                              const newSelection = { ...selectedStudents };
                              filteredStudents.forEach((student) => {
                                newSelection[student.id] = !allSelected;
                              });
                              setSelectedStudents(newSelection);
                            }}
                          />
                        </TableHead> */}
                        <TableHead>Student Name</TableHead>
                        <TableHead>Current Class</TableHead>
                        <TableHead>Next Class</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          {/* <TableCell>
                            <Checkbox
                              checked={!!selectedStudents[student.id]}
                              onCheckedChange={() => {
                                setSelectedStudents((prev) => ({
                                  ...prev,
                                  [student.id]: !prev[student.id],
                                }));
                              }}
                            />
                          </TableCell> */}
                          <TableCell>
                            {student.name_en}
                            {student.isNewRegistration && (
                              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                New
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{student.currentClass}</TableCell>
                          <TableCell>{student.nextClass}</TableCell>
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
                                    promoteStudent(student.id, student.nextClass);
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