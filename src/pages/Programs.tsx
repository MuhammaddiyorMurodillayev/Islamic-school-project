import React from 'react';
import { Clock, Users, BookOpen, Palette, Calculator, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Programs: React.FC = () => {
  const { t } = useLanguage();

  const programs = [
    {
      title: t('preK'),
      age: 'Ages 3-4',
      description: 'Foundation building through play-based learning and early Islamic education',
      features: ['Basic Arabic letters', 'Quran recitation', 'Social skills', 'Motor development']
    },
    {
      title: t('kindergarten'),
      age: 'Ages 5-6',
      description: 'Comprehensive preparation for elementary education with Islamic values',
      features: ['Reading readiness', 'Math foundations', 'Islamic stories', 'Creative arts']
    },
    {
      title: t('elementary'),
      age: 'Ages 6-9',
      description: 'Full academic curriculum integrated with Islamic studies',
      features: ['Core subjects', 'Quran memorization', 'Arabic language', 'Science exploration']
    },
    {
      title: t('madrasa'),
      age: 'All Ages',
      description: 'Intensive Islamic education focusing on Quran and religious studies',
      features: ['Quran memorization', 'Islamic jurisprudence', 'Arabic grammar', 'Hadith studies']
    }
  ];

  const curriculum = [
    {
      icon: <BookOpen className="h-8 w-8 text-emerald-600" />,
      title: t('reading'),
      description: 'Comprehensive literacy program with phonics-based approach'
    },
    {
      icon: <Calculator className="h-8 w-8 text-emerald-600" />,
      title: t('stem'),
      description: 'Mathematics and science education with hands-on experiments'
    },
    {
      icon: <Globe className="h-8 w-8 text-emerald-600" />,
      title: t('islamicStudies'),
      description: 'Quran, Hadith, Islamic history, and Arabic language'
    },
    {
      icon: <Palette className="h-8 w-8 text-emerald-600" />,
      title: t('arts'),
      description: 'Creative expression through art, music, and storytelling'
    }
  ];

  const dailySchedule = [
    { time: '8:00 - 8:30 AM', activity: 'Morning Assembly & Dua' },
    { time: '8:30 - 9:30 AM', activity: 'Quran Recitation' },
    { time: '9:30 - 10:30 AM', activity: 'Mathematics' },
    { time: '10:30 - 10:45 AM', activity: 'Snack Break' },
    { time: '10:45 - 11:45 AM', activity: 'English Language Arts' },
    { time: '11:45 AM - 12:45 PM', activity: 'Lunch & Prayer' },
    { time: '12:45 - 1:45 PM', activity: 'Islamic Studies' },
    { time: '1:45 - 2:30 PM', activity: 'Science/Social Studies' },
    { time: '2:30 - 3:15 PM', activity: 'Arts & Crafts' },
    { time: '3:15 - 3:30 PM', activity: 'Dismissal' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('programsTitle')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive educational programs designed to nurture young minds through Islamic values and academic excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{program.title}</h3>
                  <span className="text-sm text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                    {program.age}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <ul className="space-y-2">
                  {program.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('curriculum')}</h2>
            <p className="text-xl text-gray-600">A well-rounded education that prepares students for success</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {curriculum.map((subject, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  {subject.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{subject.title}</h3>
                <p className="text-gray-600 text-sm">{subject.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Schedule */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('sampleDailySchedule')}</h2>
            <p className="text-xl text-gray-600">{t('typicalDay')}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {dailySchedule.map((item, index) => (
              <div key={index} className={`flex items-center p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <div className="flex items-center space-x-4 w-full">
                  <div className="flex items-center justify-center w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <div className="text-sm font-medium text-emerald-600 w-32 flex-shrink-0">
                    {item.time}
                  </div>
                  <div className="text-gray-700 flex-1">
                    {item.activity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Methodology */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-6">{t('ourTeachingMethodology')}</h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
              {t('teachingMethodologyDesc')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{t('smallClassSizes')}</h3>
                <p className="text-emerald-100">{t('smallClassSizesDesc')}</p>
              </div>
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{t('integratedLearning')}</h3>
                <p className="text-emerald-100">{t('integratedLearningDesc')}</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{t('structuredEnvironment')}</h3>
                <p className="text-emerald-100">{t('structuredEnvironmentDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;