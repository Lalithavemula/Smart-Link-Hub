import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { profileApi } from '../api/profile';
import { UserCircle, Briefcase, GraduationCap, Code2, Award, Download, ArrowLeft } from 'lucide-react';
import Loader from '../components/ui/Loader';

// Mock Data for the MVP Resume Portfolio
const MOCK_RESUME = {
  experience: [
    { id: 1, role: 'Senior Full Stack Developer', company: 'TechCorp Inc.', period: '2022 - Present', desc: 'Leading frontend architecture using React and Zustand. Built scalable microservices with Spring Boot.' },
    { id: 2, role: 'Software Engineer', company: 'Innovate Solutions', period: '2019 - 2022', desc: 'Developed enterprise web applications. Improved load times by 40%.' }
  ],
  education: [
    { id: 1, degree: 'M.S. Computer Science', school: 'Tech University', period: '2017 - 2019' },
    { id: 2, degree: 'B.S. Software Engineering', school: 'State College', period: '2013 - 2017' }
  ],
  skills: ['Java', 'Spring Boot', 'React', 'Zustand', 'Tailwind CSS', 'Docker', 'AWS'],
  certifications: ['AWS Certified Solutions Architect', 'Oracle Certified Professional Java Programmer']
};

export default function PublicResume() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await profileApi.getPublicProfile(username);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!profile) return <div className="text-center py-20">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <Link to={`/u/${username}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" /> Download PDF
          </button>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 rounded-full bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
            <UserCircle className="w-20 h-20 text-gray-300 dark:text-gray-600" />
          </div>
          <div className="text-center md:text-left space-y-3">
            <h1 className="text-4xl font-bold tracking-tight">{profile.username}</h1>
            <p className="text-xl text-primary-600 dark:text-primary-400 font-medium">Software Professional</p>
            <p className="text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">{profile.bio}</p>
          </div>
        </div>

        {/* Experience */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
            <Briefcase className="w-6 h-6 text-primary-500" /> Experience
          </h2>
          <div className="space-y-8">
            {MOCK_RESUME.experience.map(exp => (
              <div key={exp.id} className="relative pl-6 border-l-2 border-gray-200 dark:border-gray-800">
                <div className="absolute w-3 h-3 bg-primary-500 rounded-full -left-[7px] top-2 shadow-[0_0_0_4px_white] dark:shadow-[0_0_0_4px_#030712]"></div>
                <h3 className="text-lg font-bold">{exp.role}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{exp.company}</span>
                  <span>•</span>
                  <span>{exp.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{exp.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Education & Certs Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Education */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
              <GraduationCap className="w-6 h-6 text-primary-500" /> Education
            </h2>
            <div className="space-y-6">
              {MOCK_RESUME.education.map(edu => (
                <div key={edu.id}>
                  <h3 className="font-bold">{edu.degree}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{edu.school} • {edu.period}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
              <Award className="w-6 h-6 text-primary-500" /> Certifications
            </h2>
            <ul className="space-y-3">
              {MOCK_RESUME.certifications.map((cert, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-primary-500 mt-1">•</span> {cert}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Skills */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-3">
            <Code2 className="w-6 h-6 text-primary-500" /> Technical Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {MOCK_RESUME.skills.map((skill, idx) => (
              <span key={idx} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium border border-gray-200 dark:border-gray-700 hover:border-primary-500 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
