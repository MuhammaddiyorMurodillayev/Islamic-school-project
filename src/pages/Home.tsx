import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Clock, GraduationCap, Heart, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ImageLoader from '../components/ImageLoader';
import { supabase } from '../subabaseClient';

type Image = {
  id: string,
  url: string,
}

const Home: React.FC = () => {
  const { t } = useLanguage();
  const currentLanguage = useLanguage().language;
  const [images, setImages] = useState<Image[]>([])

  const quickFacts = [
    {
      icon: <GraduationCap className="h-8 w-8 text-emerald-600" />,
      title: t('preK3rd'),
      description: (currentLanguage === 'en' ? 'Ages 3-9' : currentLanguage === 'uz' ? '3-9 yosh' : 'Возраст 3-9 лет')
    },
    {
      icon: <MapPin className="h-8 w-8 text-emerald-600" />,
      title: t('ohioLocation'),
      description: (currentLanguage === 'en' ? '3 Convenient Locations' : currentLanguage === 'uz' ? '3 ta qulay joylar' : '3 удобных места')
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-600" />,
      title: t('smallClasses'),
      description: (currentLanguage === 'en' ? '12-15 Students Per Class' : currentLanguage === 'uz' ? 'Har bir sinfda 12-15 nafar talaba' : '12-15 учеников в классе')
    },
    {
      icon: <Clock className="h-8 w-8 text-emerald-600" />,
      title: t('fullDay'),
      description: '8:30 AM - 7:00 PM'
    }
  ];

  const features = [
    {
      icon: <BookOpen className="h-12 w-12 text-emerald-600" />,
      title: t('academicExcellence'),
      description: t('academicExcellenceDesc')
    },
    {
      icon: <Heart className="h-12 w-12 text-emerald-600" />,
      title: t('islamicValues'),
      description: t('islamicValuesDesc')
    },
    {
      icon: <Users className="h-12 w-12 text-emerald-600" />,
      title: t('caringCommunity'),
      description: t('caringCommunityDesc')
    }
  ];


  useEffect(() => {
    const fetchImageFromDB = async () => {
      const { data, error } = await supabase
        .from("images")
        .select(`
                      id,
                      url
                  `);


      if (error || !data) {
        console.error("❌ Error fetching image:", error?.message);
        return;
      }

      setImages(
        data
          .filter(image => image.id !== 'bf61e4fe-0d76-420f-8666-b419e02f6564')
          .slice(0, 3)
          .map(image => ({
            id: image.id,
            url: image.url
          }))
      );
    };

    fetchImageFromDB();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <div
          className="w-full h-[500px] bg-[linear-gradient(to_left,white_15%,rgba(255,255,255,0)_60%),url('/images/image.png')] bg-cover bg-center bg-no-repeat"
        />

        <div className="absolute inset-0 bg-white/10" />

        <div className="absolute inset-0 z-10 max-w-7x px-4 sm:px-6 lg:px-8 flex items-center justify-end">
          <div className="text-center justify-center max-w-2xl py-20">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('welcome')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 mb-8">
              {t('welcomeSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
              >
                {t('scheduleTour')}
              </Link>
              <Link
                to="/admissions"
                className="inline-flex items-center px-8 py-3 border border-emerald-600 text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50 transition-colors duration-200"
              >
                {t('enrollNow')}
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Quick Facts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('quickFacts')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {quickFacts.map((fact, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="flex justify-center mb-4">
                  {fact.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{fact.title}</h3>
                <p className="text-gray-600">{fact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-lg shadow-md">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('ourSchoolLife')}</h2>
            <p className="text-xl text-gray-600">{t('ourSchoolLifeDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {images.map(image => {
              return (
                <div className="aspect-w-16 aspect-h-12 rounded-lg overflow-hidden">
                  <ImageLoader url={image.url} imageId={image.id} style='w-full h-64 object-cover hover:scale-105 transition-transform duration-300' />
                </div>
              )
            })}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/gallery"
              className="inline-flex items-center px-6 py-3 border border-emerald-600 text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-emerald-50 transition-colors duration-200"
            >
              {t('viewAll')}
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('readyToJoin')}
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            {t('readyToJoinDesc')}
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-emerald-600 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            {t('scheduleTour')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
