
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, BookOpen, Award, Globe, Phone, Mail, MapPin } from "lucide-react";
import LoginModal from "@/components/auth/LoginModal";
import Navigation from "@/components/layout/Navigation";

const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const features = [
    {
      icon: <GraduationCap className="h-12 w-12 text-blue-600" />,
      title: "Academic Excellence",
      titleAr: "التميز الأكاديمي",
      description: "Comprehensive curriculum aligned with GCC educational standards",
      descriptionAr: "منهج شامل متوافق مع معايير التعليم في دول مجلس التعاون الخليجي"
    },
    {
      icon: <Users className="h-12 w-12 text-blue-600" />,
      title: "Expert Faculty",
      titleAr: "هيئة تدريس متخصصة",
      description: "Qualified educators dedicated to student success",
      descriptionAr: "مربون مؤهلون مكرسون لنجاح الطلاب"
    },
    {
      icon: <BookOpen className="h-12 w-12 text-blue-600" />,
      title: "Modern Facilities",
      titleAr: "مرافق حديثة",
      description: "State-of-the-art classrooms and learning environments",
      descriptionAr: "فصول دراسية وبيئات تعلم حديثة"
    },
    {
      icon: <Award className="h-12 w-12 text-blue-600" />,
      title: "Character Development",
      titleAr: "تنمية الشخصية",
      description: "Building strong moral values and leadership skills",
      descriptionAr: "بناء القيم الأخلاقية القوية ومهارات القيادة"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gold-50">
      <Navigation onLoginClick={() => setIsLoginOpen(true)} />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Excellence in Education
              <span className="block text-blue-600 mt-2">التميز في التعليم</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Nurturing minds, building character, and preparing students for a successful future in accordance with Islamic values and modern educational practices.
            </p>
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto" dir="rtl">
              تنمية العقول، وبناء الشخصية، وإعداد الطلاب لمستقبل ناجح وفقاً للقيم الإسلامية والممارسات التعليمية الحديثة
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
                onClick={() => setIsLoginOpen(true)}
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Access Portal | دخول النظام
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg"
              >
                <Globe className="mr-2 h-5 w-5" />
                Learn More | اعرف المزيد
              </Button>
            </div>
          </div>
        </div>
        
        {/* Geometric Pattern Overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-gold-500 transform rotate-45 rounded-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our School
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              Committed to educational excellence and Islamic values
            </p>
            <p className="text-lg text-gray-500" dir="rtl">
              ملتزمون بالتميز التعليمي والقيم الإسلامية
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <h4 className="text-lg font-semibold text-blue-600 mb-4" dir="rtl">
                    {feature.titleAr}
                  </h4>
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {feature.description}
                  </p>
                  <p className="text-gray-500 text-sm" dir="rtl">
                    {feature.descriptionAr}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl opacity-90 mb-2">Ready to join our educational community?</p>
            <p className="text-lg opacity-80" dir="rtl">مستعد للانضمام إلى مجتمعنا التعليمي؟</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Phone className="h-12 w-12 mx-auto mb-4 text-gold-400" />
              <h3 className="text-xl font-bold mb-2">Phone</h3>
              <p className="opacity-90">+966 XX XXX XXXX</p>
            </div>
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 text-gold-400" />
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="opacity-90">info@gccschool.edu</p>
            </div>
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gold-400" />
              <h3 className="text-xl font-bold mb-2">Location</h3>
              <p className="opacity-90">Riyadh, Saudi Arabia</p>
            </div>
          </div>
        </div>
      </section>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </div>
  );
};

export default Index;
