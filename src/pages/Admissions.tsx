import { CheckCircle, Calendar, DollarSign, HelpCircle } from 'lucide-react';
import { languageChooser, useLanguage } from '../contexts/LanguageContext';
import RegistrationForm from '../components/RegistrationForm';
import { useEffect, useState } from 'react';
import { supabase } from '../subabaseClient';

type Lang = {
  en: string,
  ru: string,
  uz: string
}

type Tuition = {
  id: string;
  grade: Lang;
  age: Lang;
  tuition: Lang;
  due: Lang;
}

type TuitionFee = {
  id: string;
  feeType: Lang;
  amount: Lang;
  due: Lang;
}

const Admissions: React.FC = () => {
  const { t, language } = useLanguage();

  const [tuition_5, setTuition_5] = useState<Tuition[]>([]);
  const [tuition_3, setTuition_3] = useState<Tuition[]>([]);
  const [tuition_fee, setTuition_fee] = useState<TuitionFee[]>([]);

  // console.log(currentLanguage);

  const steps = [
    {
      icon: <CheckCircle className="h-8 w-8 text-emerald-600" />,
      title: t('submitApplication'),
      description: t('submitApplicationDesc')
    },
    {
      icon: <Calendar className="h-8 w-8 text-emerald-600" />,
      title: t('scheduleVisit'),
      description: t('scheduleVisitDesc')
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-emerald-600" />,
      title: t('interviewProcess'),
      description: t('interviewProcessDesc')
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-emerald-600" />,
      title: t('enrollmentConfirmation'),
      description: t('enrollmentConfirmationDesc')
    }
  ];

  const timeline = [
    { period: t('period1'), activity: t('application1') },
    { period: t('period2'), activity: t('application2') },
    { period: t("period3"), activity: t('application3') },
    { period: t('period4'), activity: t('application4') },
    { period: t('period5'), activity: t('application5') }
  ];

  const faqs = [
    {
      question: t('question1'),
      answer: t('answer1')
    },
    {
      question: t('question2'),
      answer: t('answer2')
    },
    {
      question: t('question3'),
      answer: t('answer3')
    },
    {
      question: t('question4'),
      answer: t('answer4')
    },
    {
      question: t('question5'),
      answer: t('answer5')
    },
    {
      question: t('question6'),
      answer: t('answer6')
    }
  ];

  // const tuitionTo3PM_en = [
  //   { grade: 'Head Start', age: '+3 years old ', tuition: '$550 (monthly)', due: 'due to 5th of each months' },
  //   { grade: 'Pre-K', age: '+4 years old ', tuition: '$500 (monthly)', due: 'due to 5th of each months' },
  //   { grade: 'Kindergarten', age: '5-6 years old ', tuition: '$500 (monthly)', due: 'due to 5th of each months' },
  //   { grade: '1st Grade', age: '6–7 years', tuition: '$500 (monthly)', due: '5th of each month' },
  //   { grade: '2nd Grade', age: '7–8 years', tuition: '$500 (monthly)', due: '5th of each month' }
  // ];

  // const tuitionTo3PM_uz = [
  //   { grade: 'Head Start', age: '3 yoshdan boshlab', tuition: '$550 (oylik)', due: 'har oyning 5-sanasigacha' },
  //   { grade: 'Pre-K', age: '4 yoshdan boshlab', tuition: '$500 (oylik)', due: 'har oyning 5-sanasigacha' },
  //   { grade: 'Kindergarten', age: '5–6 yosh', tuition: '$500 (oylik)', due: 'har oyning 5-sanasigacha' },
  //   { grade: '1-sinf', age: '6–7 yosh', tuition: '$500 (oylik)', due: 'har oyning 5-sanasigacha' },
  //   { grade: '2-sinf', age: '7–8 yosh', tuition: '$500 (oylik)', due: 'har oyning 5-sanasigacha' }

  // ];

  // const tuitionTo3PM_ru = [
  //   { grade: 'Head Start', age: 'от 3 лет', tuition: '$550 (в месяц)', due: 'до 5-го числа каждого месяца' },
  //   { grade: 'Pre-K', age: 'от 4 лет', tuition: '$500 (в месяц)', due: 'до 5-го числа каждого месяца' },
  //   { grade: 'Детский сад (Kindergarten)', age: '5–6 лет', tuition: '$500 (в месяц)', due: 'до 5-го числа каждого месяца' },
  //   { grade: '1 класс', age: '6–7 лет', tuition: '$500 (в месяц)', due: 'до 5-го числа каждого месяца' },
  //   { grade: '2 класс', age: '7–8 лет', tuition: '$500 (в месяц)', due: 'до 5-го числа каждого месяца' }

  // ];

  // const tuitionTo3PM = language === 'en' ? tuitionTo3PM_en : language === 'uz' ? tuitionTo3PM_uz : tuitionTo3PM_ru;

  // const tuitionTo5PM_en = [
  //   { grade: 'Head Start', age: '+3 years old ', tuition: '$750 (monthly)', due: 'due to 5th of each months' },
  //   { grade: 'Pre-K', age: '+4 years old ', tuition: '$700 (monthly)', due: 'due to 5th of each months' },
  //   { grade: 'Kindergarten', age: '5–6 years', tuition: '$700 (monthly)', due: '5th of each month' },
  //   { grade: '1st Grade', age: '6–7 years', tuition: '$700 (monthly)', due: '5th of each month' },
  //   { grade: '2nd Grade', age: '7–8 years', tuition: '$700 (monthly)', due: '5th of each month' }
  // ];

  // const tuitionTo5PM_uz = [
  //   { grade: 'Head Start', age: '3 yoshdan boshlab', tuition: '$750 (oylik)', due: 'har oyning 5-sanasigacha' },
  //   { grade: 'Pre-K', age: '4 yoshdan boshlab', tuition: '$700 (oylik)', due: 'har oyning 5-sanasigacha' },
  //   { grade: 'Bogʻcha', age: '5–6 yosh', tuition: '$700 (oyiga)', due: 'har oyning 5-sanasi' },
  //   { grade: '1-sinf', age: '6–7 yosh', tuition: '$700 (oyiga)', due: 'har oyning 5-sanasi' },
  //   { grade: '2-sinf', age: '7–8 yosh', tuition: '$700 (oyiga)', due: 'har oyning 5-sanasi' }
  // ];

  // const tuitionTo5PM_ru = [
  //   { grade: 'Head Start', age: 'от 3 лет', tuition: '$750 (в месяц)', due: 'до 5-го числа каждого месяца' },
  //   { grade: 'Pre-K', age: 'от 4 лет', tuition: '$700 (в месяц)', due: 'до 5-го числа каждого месяца' },
  //   { grade: 'Детский сад', age: '5–6 лет', tuition: '$700 (в месяц)', due: '5-е число каждого месяца' },
  //   { grade: '1-й класс', age: '6–7 лет', tuition: '$700 (в месяц)', due: '5-е число каждого месяца' },
  //   { grade: '2-й класс', age: '7–8 лет', tuition: '$700 (в месяц)', due: '5-е число каждого месяца' }
  // ];

  useEffect(() => {

    async function fetchdataFromDb() {
      const { data, error } = await supabase
        .from('tuition_5')
        .select();

      if (error) {
        console.log('error', error.message);
        return;
      }

      setTuition_5(
        data
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map(e => {
            return {
              id: e.id,
              grade: e.grade,
              tuition: e.tuition,
              due: e.due_date,
              age: e.age,
            }
          }))

      // console.log(tuition_5);

    }

    fetchdataFromDb();
  }, [])


  useEffect(() => {

    async function fetchdataFromDb() {
      const { data, error } = await supabase
        .from('tuition_3')
        .select();

      if (error) {
        console.log('error', error.message);
        return;
      }

      setTuition_3(data
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map(e => {
          return {
            id: e.id,
            grade: e.grade,
            tuition: e.tuition,
            due: e.due_date,
            age: e.age,
          }
        }))

      // console.log(tuition_5);

    }

    fetchdataFromDb();
  }, [])


  useEffect(() => {

    async function fetchdataFromDb() {
      const { data, error } = await supabase
        .from('tuition_fee')
        .select();

      if (error) {
        console.log('error', error.message);
        return;
      }

      setTuition_fee(data
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map(e => {
          return {
            id: e.id,
            feeType: e.fee_type,
            amount: e.amount,
            due: e.due,
          }
        }))

      // console.log(tuition_5);

    }

    fetchdataFromDb();
  }, [])
  // const tuitionTo5PM = currentLanguage === 'en' ? tuitionTo5PM_en : currentLanguage === 'uz' ? tuitionTo5PM_uz : tuitionTo5PM_ru;

  // const fees_en = [
  //   { type: 'Registration (non-refundable)', amount: '$50 per student', due: 'At registration' },
  //   { type: 'Supplies & Materials (non-refundable)', amount: '$130 per student', due: 'With first tuition payment' },
  //   { type: 'Academic Resources (non-refundable)', amount: '$70 per student', due: 'At registration' }
  // ];

  // const fees_uz = [
  //   { type: 'Ro‘yxatdan o‘tish (qaytarilmaydi)', amount: '$50 har bir o‘quvchi uchun', due: 'Ro‘yxatdan o‘tishda' },
  //   { type: 'Jihozlar va materiallar (qaytarilmaydi)', amount: '$130 har bir o‘quvchi uchun', due: 'Birinchi oylik to‘lov bilan birga' },
  //   { type: 'O‘quv resurslari (qaytarilmaydi)', amount: '$70 har bir o‘quvchi uchun', due: 'Ro‘yxatdan o‘tishda' }
  // ];

  // const fees_ru = [
  //   { type: 'Регистрационный сбор (не возвращается)', amount: '$50 за ученика', due: 'При регистрации' },
  //   { type: 'Материалы и принадлежности (не возвращается)', amount: '$130 за ученика', due: 'С первым платежом за обучение' },
  //   { type: 'Учебные ресурсы (не возвращается)', amount: '$70 за ученика', due: 'При регистрации' }
  // ];

  // const fees = language === 'en' ? fees_en : language === 'uz' ? fees_uz : fees_ru;

  const discounts_en = [
    'For siblings with same parents:',
    '2nd child discount: $50',
    '3rd child discount: $60',
    '4th child discount: $70',
    // '20% discount if tuition is paid in full for the school year'
  ];

  const discounts_uz = [
    'Bir xil ota-onaga ega bo‘lgan farzandlar uchun:',
    '2-farzand uchun chegirma: $50',
    '3-farzand uchun chegirma: $60',
    '4-farzand uchun chegirma: $70',
    // 'Agar o‘quv yili uchun to‘lov to‘liq oldindan to‘lansa, 20% chegirma'
  ];

  const discounts_ru = [
    'Для детей от одних родителей:',
    'Скидка для второго ребенка: $50',
    'Скидка для третьего ребенка: $60',
    'Скидка для четвертого ребенка: $70',
    // 'Скидка 20% при полной оплате обучения за учебный год'
  ];

  const discounts = language === 'en' ? discounts_en : language === 'uz' ? discounts_uz : discounts_ru;


  function getTranslation(word?: Lang): string {
    if (!word) return '';
    return word[language] || word.en || word.uz || word.ru || '';
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] from-emerald-50 to-blue-50 bg-gradient-to-tr overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-md bg-white/10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('admissionsTitle')}
          </h1>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            {t('underAdmissionTitle')}
          </p>
        </div>
      </section>

      {/* How to Apply */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('howToApply')}</h2>
            <p className="text-xl text-gray-600">{t('howToApplyDesc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {step.icon}
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-2">{index + 1}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Timeline */}
      <section className="py-16 to-white from-emerald-600 bg-gradient-to-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('enrollmentTimeline')}</h2>
            <p className="text-xl text-gray-600">{t('enrollmentTimelineDesc')}</p>
          </div>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center justify-center w-4 h-4 bg-emerald-500 rounded-full mr-6"></div>
                <div className="flex-1">
                  <div className="font-semibold text-emerald-600">{item.period}</div>
                  <div className="text-gray-700">{item.activity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tuition & Fees */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-10">
            {languageChooser(
              '2025 – 2026 Tuition Rates & Fees',
              '2025 – 2026 O‘quv to‘lovlari va yig‘imlar',
              'Стоимость и сборы на 2025 – 2026 год'
            )}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <DollarSign className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{t('preK')} {t('program')}</h3>
              <p className="text-emerald-100">{t('tuitionInfo1')}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <DollarSign className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{t('elementary')}</h3>
              <p className="text-emerald-100">{t('tuitionInfo2')}</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <DollarSign className="h-12 w-12 text-emerald-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">{t('financialAid')}</h3>
              <p className="text-emerald-100">{t('tuitionInfo3')}</p>
            </div>
          </div>
          <br />


          <h3 className="text-2xl font-semibold mb-4">
            {languageChooser(
              'Tuition to 3PM',
              '	Soat 15:00 gacha o‘quv to‘lovi',
              'Обучение до 15:00')}
          </h3>
          <table className="w-full text-left bg-white text-gray-800 rounded-lg overflow-hidden mb-10">
            <thead className="bg-emerald-700 text-white">
              <tr>
                <th className="p-3">{languageChooser('Grade', 'Sinf', 'Класс')}</th>
                <th className="p-3">{languageChooser('Age', 'Yosh', 'Возраст')}</th>
                <th className="p-3">{languageChooser('Tuition', 'To‘lov', 'Стоимость обучения')}</th>
                <th className="p-3">{languageChooser('Due Date', 'To‘lov sanasi', 'Срок оплаты')}</th>
              </tr>
            </thead>
            <tbody>
              {tuition_3.map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3">{getTranslation(row.grade)}</td>
                  <td className="p-3">{getTranslation(row.age)}</td>
                  <td className="p-3">{getTranslation(row.tuition)}</td>
                  <td className="p-3">{getTranslation(row.due)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-2xl font-semibold mb-4">
            {languageChooser('Tuition to 5PM', 'Soat 17:00 gacha o‘quv to‘lovi', 'Обучение до 17:00')}
          </h3>
          <table className="w-full text-left bg-white text-gray-800 rounded-lg overflow-hidden mb-10">
            <thead className="bg-emerald-700 text-white">
              <tr>
                <th className="p-3">{languageChooser('Grade', 'Sinf', 'Класс')}</th>
                <th className="p-3">{languageChooser('Age', 'Yosh', 'Возраст')}</th>
                <th className="p-3">{languageChooser('Tuition', 'To‘lov', 'Стоимость обучения')}</th>
                <th className="p-3">{languageChooser('Due Date', 'To‘lov sanasi', 'Срок оплаты')}</th>
              </tr>
            </thead>
            <tbody>
              {tuition_5.map((row, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3">{getTranslation(row.grade)}</td>
                  <td className="p-3">{getTranslation(row.age)}</td>
                  <td className="p-3">{getTranslation(row.tuition)}</td>
                  <td className="p-3">{getTranslation(row.due)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-2xl font-semibold mb-4">{languageChooser('Fees', 'Qo‘shimcha yig‘imlar', 'Дополнительные сборы')}</h3>
          <table className="w-full text-left bg-white text-gray-800 rounded-lg overflow-hidden mb-10">
            <thead className="bg-emerald-700 text-white">
              <tr>
                <th className="p-3">{languageChooser('Fee Type', 'Yig‘im turi', 'Тип сбора')}</th>
                <th className="p-3">{languageChooser('Amount', 'Miqdori', 'Сумма')}</th>
                <th className="p-3">{languageChooser('Due', 'To‘lanadigan vaqt', 'Срок оплаты')}</th>
              </tr>
            </thead>
            <tbody>
              {tuition_fee.map((fee, i) => (
                <tr key={i} className="border-b">
                  <td className="p-3">{getTranslation(fee.feeType)}</td>
                  <td className="p-3">{getTranslation(fee.amount)}</td>
                  <td className="p-3">{getTranslation(fee.due)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Discounts */}
          <h3 className="text-2xl font-semibold mb-4">{languageChooser('Tuition Discounts', 'To‘lov uchun chegirmalar', 'Скидки на обучение')}</h3>
          <ul className="text-left text-emerald-100 list-disc list-inside space-y-1">
            {discounts.map((item, i) => (
              <li key={i} className={i === 0 ? '' : 'ml-6'}>{item}</li>
            ))}
          </ul>
        </div>

        <p className="text-emerald-100 mt-8 text-center">
          {t('tuitionInfo4')}
        </p>
      </section>

      {/* Registration Form */}
      <section className="py-16 bg-gray-50 "
        id='registrationFormSubmitted'>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RegistrationForm />
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('faqs')}</h2>
            <p className="text-xl text-gray-600">{t('faqsDesc')}</p>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start space-x-4">
                  <HelpCircle className="h-6 w-6 text-emerald-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admissions;