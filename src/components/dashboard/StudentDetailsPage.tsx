// Create a new file StudentDetailsPage.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DownloadIcon,
  EyeIcon,
  FileIcon,
  PencilIcon,
  PrinterIcon,
  SaveIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";

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
  documents?: Array<{
    type: string;
    file: string;
  }>;
};

type Department = {
  id: string;
  department_name: string;
};

export default function StudentDetailsPage() {
  const { id } = useParams();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);


  const fetchDepartments = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/students/department/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  useEffect(() => {
    // Fetch student data based on ID

    fetchDepartments();
    const fetchStudent = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("accessToken"); // adjust this if stored differently

        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/students/get-studentdetails-all/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }

        const result = await response.json();

        if (!result.status || !Array.isArray(result.data)) {
          throw new Error("Invalid API response format: data is not an array");
        }

        const students: Student[] = result.data.map((student: any) => ({
          id: student.id,
          name_en: `${student.en_first_name} ${student.en_middle_name ?? ""} ${
            student.en_last_name
          }`.trim(),
          name_ar: `${student.ar_first_name} ${student.ar_middle_name ?? ""} ${
            student.ar_last_name
          }`.trim(),
          date_of_birth: student.date_of_birth,
          gender: student.gender === "M" ? "Male" : "Female",
          nationality: student.nationality,
          place_of_birth: student.city,
          religion: student.religion,
          currentClass: student.admission_class?.department_name || "Unknown",
          currentSection: student.section?.name || "Unknown",
          nextClass: "Pending",
          nextSection: "",
          status: student.is_verified_registration_officer
            ? "verified"
            : "pending",
          registrationDate: student.admission_date,
          isNewRegistration: true,
          guardian: student.guardian,
          documents: [], // Fill if your backend provides documents
        }));

        const foundStudent = students.find((s) => s.id === id);

        if (foundStudent) {
          setStudent(foundStudent);
        } else {
          console.error("Student not found");
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!student) {
    return <div className="flex justify-center p-8">Student not found</div>;
  }

  const handleChange = (field: keyof Student, value: any) => {
    if (!student) return;
    setStudent({ ...student, [field]: value });
  };

const handleSave = async () => {
  try {
    const token = localStorage.getItem("accessToken");


      // Clone student and convert gender
    const dataToSave = {
      ...student,
      gender: student.gender === "Male" ? "M" : student.gender === "Female" ? "F" : student.gender,
    };

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/students/student/${student.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSave), // use `student` instead of `editedStudent`
    });

    if (!res.ok) throw new Error("Failed to save");

    const updated = await res.json();

    // setStudent(updated); // update state with saved data
    setIsEditing(false);
  } catch (err) {
    console.error(err);
    alert("Failed to save student data.");
  }
};







  const handleViewDocument = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const handlePrintDocument = async (fileUrl: string, docName: string) => {
    try {
      // Create an iframe for printing
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // Wait for the iframe to load
      await new Promise<void>((resolve) => {
        iframe.onload = () => resolve();
        iframe.src = fileUrl;
      });

      // Wait a bit longer to ensure content is fully loaded
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Focus the iframe and print
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Clean up after printing
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    } catch (error) {
      console.error("Printing failed:", error);
      alert(
        `Failed to print document. Please try viewing it first. Error: ${error.message}`
      );
    }
  };

  const handleDownloadDocument = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Details</h1>
        <div className="flex justify-between items-center gap-2">
          {/* <Button variant="outline" onClick={isEditing ? handleSave : () => setIsEditing(true)}>
            {isEditing ? (
              <>
                <SaveIcon className="w-4 h-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <PencilIcon className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button> */}

          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">English Name</h3>
            {isEditing ? (
              <input
                type="text"
                value={student.name_en}
                onChange={(e) => handleChange("name_en", e.target.value)}
                className="border rounded px-2 py-1 w-full text-sm"
              />
            ) : (
              <p>{student.name_en}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold">Arabic Name</h3>
            {isEditing ? (
              <input
                type="text"
                value={student.name_ar}
                onChange={(e) =>
                  setStudent((prev) => ({ ...prev, name_ar: e.target.value }))
                }
                className="border rounded px-2 py-1 w-full text-sm"
              />
            ) : (
              <p>{student.name_ar}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold">Date of Birth</h3>
            {isEditing ? (
              <input
                type="date"
                value={student.date_of_birth}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    date_of_birth: e.target.value,
                  }))
                }
                className="border rounded px-2 py-1 w-full text-sm"
              />
            ) : (
              <p>{student.date_of_birth}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold">Gender</h3>
            {isEditing ? (
              <select
                value={student.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className="border rounded px-2 py-1 w-full text-sm"
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>
            ) : (
              <p>{student.gender}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold">Nationality</h3>
            {isEditing ? (
              <input
                type="text"
                value={student.nationality}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    nationality: e.target.value,
                  }))
                }
                className="border rounded px-2 py-1 w-full text-sm"
              />
            ) : (
              <p>{student.nationality}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold">Religion</h3>
            {isEditing ? (
              <input
                type="text"
                value={student.religion}
                onChange={(e) =>
                  setStudent((prev) => ({ ...prev, religion: e.target.value }))
                }
                className="border rounded px-2 py-1 w-full text-sm"
              />
            ) : (
              <p>{student.religion}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold">Current Class</h3>
            <p>{student.currentClass} </p>
            
          </div>
          {/* <div>
           <h3 className="font-semibold">Next Class</h3>
            <p>{student.nextClass}</p>
          </div> */}
          <div>
         <h3 className="font-semibold">Registration Status</h3>
            <p className="capitalize">{student.status}</p>
          </div>
          <div>
            <h3 className="font-semibold">Registration Date</h3>
            {isEditing ? (
              <input
                type="date"
                value={student.registrationDate}
                onChange={(e) =>
                  setStudent((prev) => ({
                    ...prev,
                    registrationDate: e.target.value,
                  }))
                }
                className="border rounded px-2 py-1 text-sm w-full"
              />
            ) : (
              <p>{student.registrationDate || "-"}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {student.guardian && (
        <Card>
          <CardHeader>
            <CardTitle>Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Guardian Name (English)</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={student.guardian?.name_en || ""}
                  onChange={(e) =>
                    setStudent({
                      ...student,
                      guardian: {
                        ...student.guardian!,
                        name_en: e.target.value,
                      },
                    })
                  }
                  className="border rounded px-2 py-1 w-full text-sm"
                />
              ) : (
                <p>{student.guardian?.name_en}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Name (Arabic)</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={student.guardian?.name_ar || ""}
                  onChange={(e) =>
                    setStudent((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        name_ar: e.target.value,
                      },
                    }))
                  }
                  className="border rounded px-2 py-1 text-sm w-full"
                />
              ) : (
                <p>{student.guardian?.name_ar || "-"}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Phone</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={student.guardian?.phone || ""}
                  onChange={(e) =>
                    setStudent((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        phone: e.target.value,
                      },
                    }))
                  }
                  className="border rounded px-2 py-1 text-sm w-full"
                />
              ) : (
                <p>{student.guardian?.phone || "-"}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold">Relationship</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={student.guardian?.relationship || ""}
                  onChange={(e) =>
                    setStudent((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        relationship: e.target.value,
                      },
                    }))
                  }
                  className="border rounded px-2 py-1 text-sm w-full"
                />
              ) : (
                <p>{student.guardian?.relationship || "-"}</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold">National ID</h3>
              {isEditing ? (
                <input
                  type="text"
                  value={student.guardian?.national_id || ""}
                  onChange={(e) =>
                    setStudent((prev) => ({
                      ...prev,
                      guardian: {
                        ...prev.guardian,
                        national_id: e.target.value,
                      },
                    }))
                  }
                  className="border rounded px-2 py-1 text-sm w-full"
                />
              ) : (
                <p>{student.guardian?.national_id || "-"}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {student.documents && student.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {student.documents.map((doc, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">{doc.type}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(doc.file)}
                      className="flex items-center gap-1"
                    >
                      <EyeIcon className="h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePrintDocument(doc.file, doc.type)}
                      className="flex items-center gap-1"
                    >
                      <PrinterIcon className="h-4 w-4" />
                      Print
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDocument(doc.file, doc.type)}
                      className="flex items-center gap-1"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}