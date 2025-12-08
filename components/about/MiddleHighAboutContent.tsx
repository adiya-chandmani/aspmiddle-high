import Image from "next/image";

export default function MiddleHighAboutContent() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Welcome Message */}
      <section className="mb-16">
        <h1 className="text-4xl font-bold mb-8 text-navy">Welcome Message</h1>
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left: Portrait Photo */}
            <div className="md:w-1/3 bg-gray-100 relative min-h-[400px] md:min-h-full">
              <Image
                src="/1765164473290.png"
                alt="Welcome Message Portrait"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            
            {/* Right: Welcome Message */}
            <div className="md:w-2/3 p-8 md:p-12 relative">
              {/* Large Quotation Mark */}
              <div className="absolute top-4 left-4 text-8xl md:text-9xl font-serif text-navy-300 opacity-30 leading-none">
                &ldquo;
              </div>
              
              <div className="relative z-10 pt-8">
                <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
                  Welcome to American STEM Prep – Middle & High School
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-base md:text-lg">
                    It is my pleasure to welcome you to ASP&apos;s Middle and High School community. At ASP, we are dedicated to delivering a first-class STEM education that empowers students to become well-rounded, English-speaking, critical thinkers who are fully prepared for success at international universities and beyond.
                  </p>
                  
                  <p className="text-base md:text-lg">
                    Our vision is grounded in the belief that every student has the ability to learn, thrive, and excel. With high expectations, innovative teaching, and a commitment to excellence for all learners, we create an environment where students gain confidence, develop mastery, and discover their full potential.
                  </p>
                  
                  <p className="text-base md:text-lg">
                    In our dynamic classrooms, students are encouraged to ask questions, think deeply, collaborate, and challenge themselves. Our dedicated educators work closely with each student to guide their growth academically, socially, and personally. Whether they are building strong English foundations, exploring advanced STEM concepts, or engaging in leadership and extracurricular opportunities, our students are preparing for lifelong success.
                  </p>
                  
                  <p className="text-base md:text-lg">
                    Thank you for being part of our community. I look forward to working together to support our students&apos; achievements and help them reach new heights.
                  </p>
                </div>
                
                {/* Signature Block */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-base md:text-lg font-semibold text-navy mb-1">
                    Joyce Lee
                  </p>
                  <p className="text-sm md:text-base text-gray-600">
                    Vice Principal, Middle & High School
                  </p>
                  <p className="text-sm md:text-base text-gray-600 mt-1">
                    American STEM Prep
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left: Mission Image */}
            <div className="md:w-1/2 bg-gray-100 relative min-h-[400px]">
              <Image
                src="/ourmission.jpg"
                alt="Our Mission"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            
            {/* Right: Mission Statement */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">Our Mission</h2>
              <div className="relative">
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
                  &ldquo;ASP will deliver a first-class STEM education that will further our students towards becoming well-rounded, English-speaking, critical thinking students that are fully prepared for further study at an international schools.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Building Excellence - Accreditation */}
      <section className="mb-16">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Building Excellence</h2>
          
          {/* Introduction Paragraph */}
          <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
            Accreditation is crucial for schools as it signifies high standards of academic excellence and ensures quality education for students. A school with prestigious accreditation provides an assurance of quality education and high standards of academic excellence, enhanced credibility and reputation, facilitates credit transfer and eligibility for financial aid, and attracts high-quality students and faculty.
          </p>

          {/* Benefits List */}
          <div className="mb-8">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li className="text-base md:text-lg">Assurance of quality education and high standards of academic excellence</li>
              <li className="text-base md:text-lg">Enhanced credibility and reputation</li>
              <li className="text-base md:text-lg">Facilitates credit transfer and eligibility for financial aid</li>
              <li className="text-base md:text-lg">Attracts high-quality students and faculty</li>
            </ul>
          </div>

          {/* Accreditation Certificates */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {/* Accreditation International */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src="/cert1.avif"
                  alt="Accreditation International Certificate"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* NCPSA */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src="/cert2.avif"
                  alt="National Council for Private School Accreditation Certificate"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            </div>

            {/* CollegeBoard */}
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="relative w-full h-52 rounded-lg overflow-hidden mb-0">
                <Image
                  src="/share-image.avif"
                  alt="CollegeBoard CEEB Code"
                  fill
                  className="object-contain object-center"
                  unoptimized
                />
              </div>
              <div className="text-center -mt-2">
                <p className="text-2xl font-bold text-gray-800">CEEB: 682063</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


