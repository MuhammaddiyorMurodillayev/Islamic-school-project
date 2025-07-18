import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SignatureCanvas from 'react-signature-canvas';
import LocationAutocomplete from './LocationAutocomplete';

interface FormData {
  studentFirstName: string;
  studentLastName: string;
  dateOfBirth: string;
  residencyAddress: string;
  nationality: string;
  speaksEnglish: string;
  languageAtHome: string;
  motherName: string;
  fatherName: string;
  motherPhone: string;
  fatherPhone: string;
  parentEmail: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalMedication: string;
  medicalDrugAllergy: string;
  medicalFoodAllergy: string;
  medicalEnvAllergy: string;
  chronicConditions: string;
  headInjury: string;
  medicalDiagnosis: string;
  medicalConsent: string;
  parentSignature: string;
  parentSignDate: string;
  acceptforAccidentallyTreatment: string;
}

const RegistrationForm: React.FC = () => {

  const { t } = useLanguage();
  const [formData, setFormData] = useState<FormData>({
    studentFirstName: '',
    studentLastName: '',
    dateOfBirth: '',
    residencyAddress: '',
    nationality: '',
    speaksEnglish: '',
    languageAtHome: '',
    motherName: '',
    fatherName: '',
    motherPhone: '',
    fatherPhone: '',
    parentEmail: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalMedication: '',
    medicalDrugAllergy: '',
    medicalFoodAllergy: '',
    medicalEnvAllergy: '',
    chronicConditions: '',
    headInjury: '',
    medicalDiagnosis: '',
    medicalConsent: '',
    parentSignature: '',
    parentSignDate: '',
    acceptforAccidentallyTreatment: '',
  });


  const signatureCanvasRef = React.createRef<SignatureCanvas>();

  const clearSignature = () => {
    if (signatureCanvasRef.current) {
      signatureCanvasRef.current.clear();
    }
  }

  const saveSignature = () => {
    if (signatureCanvasRef.current) {
      const signatureDataUrl = signatureCanvasRef.current.toDataURL('image/png');

      setFormData(prev => ({
        ...prev,
        parentSignature: signatureDataUrl
      }));

      setShowRequiredSign(false);

      setFormData(prev => ({
        ...prev,
        parentSignature: signatureDataUrl || ''
      }));
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isNotFilled, setIsNotFilled] = useState(false);
  const [remindRequiredConset, setRemindRequiredConset] = useState(false);
  const [showRequiredSign, setShowRequiredSign] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target; 
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError(null);
    }
  };

  const handleResidencyAdress = (adress: string) => {

    console.log(adress);
    
    setFormData(prev => ({
      ...prev,
      ['residencyAddress']: adress,
    }));

    if (error) {
      setError(null);
    }
  }

  const validateForm = (): boolean => {
    const requiredFields = [
      'studentFirstName',
      'studentLastName',
      'dateOfBirth',
      'residencyAddress',
      'nationality',
      'speaksEnglish',
      'languageAtHome',
      'motherPhone',
      'fatherPhone',
      'parentSignature',
      'headInjury',
      'medicalMedication',
      'medicalDrugAllergy',
      'medicalFoodAllergy',
      'medicalEnvAllergy',
      'chronicConditions',
      'medicalConsent',
      'acceptforAccidentallyTreatment',
    ];

    for (const field of requiredFields) {
      const value = formData[field as keyof FormData];
      if (!((typeof value === 'string' ? value : '')).trim()) {
        setError(`Please fill in all required fields marked with *`);
        setIsNotFilled(true);
        return false;
      }
    }

    // Validate email format if provided
    if (formData.parentEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parentEmail)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for submission
      const submissionData = {
        ...formData,
        parentSignDate: new Date(formData.parentSignDate).toISOString(),
        submissionDate: new Date().toISOString(),
        schoolYear: '2025-2026'
      };

      const response = await fetch('https://eolu0ku36a9ofes.m.pipedream.net', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is successful
      const responseText = await response.text();
      console.log('Submission response:', responseText);

      setSubmitted(true);
      setFormData({
        studentFirstName: '',
        studentLastName: '',
        dateOfBirth: '',
        residencyAddress: '',
        nationality: '',
        speaksEnglish: '',
        languageAtHome: '',
        motherName: '',
        fatherName: '',
        motherPhone: '',
        fatherPhone: '',
        parentEmail: '',
        emergencyContact: '',
        emergencyPhone: '',
        medicalMedication: '',
        medicalDrugAllergy: '',
        medicalFoodAllergy: '',
        medicalEnvAllergy: '',
        chronicConditions: '',
        headInjury: '',
        medicalDiagnosis: '',
        medicalConsent: '',
        parentSignature: '',
        parentSignDate: '',
        acceptforAccidentallyTreatment: '',
      });

      setShowModal(false);
      setShowSubmit(false);
      setRemindRequiredConset(false);
      setShowRequiredSign(false);
      setError(null);
      if (signatureCanvasRef.current) {
        signatureCanvasRef.current.clear();
      }
      setIsNotFilled(false);

      const submittedElement = await document.getElementById('registrationFormSubmitted');
      console.log('submittedElement:', submittedElement);
      if (submittedElement) {
        const distanceToTop = submittedElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: distanceToTop - 100, behavior: 'smooth' });
      }

    } catch (error) {
      console.error('Form submission error:', error);
      setError(t('errorSubmitting'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          {t('submitOk')}
        </h3>
        <p className="text-green-700 mb-4">
          {t('submitDiscus')}
        </p>

        <button
          onClick={() => {
            setSubmitted(false)
            setIsNotFilled(false);
            setShowSubmit(false);
            setShowModal(false);
            setRemindRequiredConset(false);
            setShowRequiredSign(false);
          }}
          className="text-green-600 hover:text-green-700 font-medium"
        >
          {t('submitAnotherApp')}
        </button>
      </div>
    );

  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {t('registrationForm')}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('studentFirstName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="studentFirstName"
              required
              value={formData.studentFirstName}
              onChange={handleChange}
              className={
                isNotFilled && formData.studentFirstName.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              }
            />
          </div>

          {/* Student Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('studentLastName')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="studentLastName"
              required
              value={formData.studentLastName}
              onChange={handleChange}
              className={
                isNotFilled && formData.studentLastName.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              } />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('dateOfBirth')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={
                isNotFilled && formData.dateOfBirth.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              } />
          </div>

          {/* Nationality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('nationality')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nationality"
              required
              value={formData.nationality}
              onChange={handleChange}
              className={
                isNotFilled && formData.nationality.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              } />
          </div>
        </div>

        {/* Residency Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('residencyAddress')} <span className="text-red-500">*</span>
          </label>
          {/* <input
            type="text"
            name="residencyAddress"
            required
            value={formData.residencyAddress}
            onChange={handleChange}
            className={isNotFilled && formData.residencyAddress.trim() === '' ?
              'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500' :
              'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
            } /> */}
            <LocationAutocomplete isNotFilled={isNotFilled}  handleResidencyAdress={handleResidencyAdress} formData={formData} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Speaks English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('speaksEnglish')} <span className="text-red-500">*</span>
            </label>
            <select
              name="speaksEnglish"
              required
              value={formData.speaksEnglish}
              onChange={handleChange}
              className={
                isNotFilled && formData.speaksEnglish.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              }
            >
              <option value="">{t('select')}</option>
              <option value="yes">{t('yes')}</option>
              <option value="no">{t('no')}</option>
            </select>
          </div>

          {/* Language at Home */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('languageAtHome')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="languageAtHome"
              required
              value={formData.languageAtHome}
              onChange={handleChange}
              className={
                isNotFilled && formData.languageAtHome.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              } />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mother's Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('motherName')}
            </label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className='w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
            />
          </div>

          {/* Father's Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('fatherName')}
            </label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className='w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mother's Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('motherPhone')} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="motherPhone"
              required
              value={formData.motherPhone}
              onChange={handleChange}
              className={
                isNotFilled && formData.motherPhone.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              } />
          </div>

          {/* Father's Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('fatherPhone')}<span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="fatherPhone"
              value={formData.fatherPhone}
              onChange={handleChange}
              className={
                isNotFilled && formData.fatherPhone.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              } />
          </div>
        </div>

        {/* Parent's Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t('parentEmail')}
          </label>
          <input
            type="email"
            name="parentEmail"
            value={formData.parentEmail}
            onChange={handleChange}
            className='w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Emergency Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('emergencyContact')}
            </label>
            <input
              type="text"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className='w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
            />
          </div>

          {/* Emergency Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('emergencyPhone')}
            </label>
            <input
              type="tel"
              name="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={handleChange}
              className='w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
            />
          </div>
        </div>


        {/** Medical History Section */}

        <div className='block justify-center items-center text-center w-full mb-4'>
          <hr className=" text-sm font-medium text-gray-700 mb-1" />
          <h3 className=" text-xl font-semibold mt-5 text-gray-800 mb-4">{t('medicalHistory')}</h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('medicalTaking')}<span className="text-red-500">*</span></label>
            <input type="text" name="medicalMedication" value={formData.medicalMedication} onChange={handleChange}
              className={
                isNotFilled && formData.medicalMedication.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              }
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('allergy')}<span className="text-red-500">*</span></label>
            <input type="text" name="medicalDrugAllergy" value={formData.medicalDrugAllergy} onChange={handleChange}
              className={
                isNotFilled && formData.medicalDrugAllergy.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              } />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('foodAllergy')}<span className="text-red-500">*</span></label>
            <input type="text" name="medicalFoodAllergy" value={formData.medicalFoodAllergy} onChange={handleChange}
              className={
                isNotFilled && formData.medicalFoodAllergy.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              } />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('enviromentalAllergy')}<span className="text-red-500">*</span></label>
            <input type="text" name="medicalEnvAllergy" value={formData.medicalEnvAllergy} onChange={handleChange}
              className={
                isNotFilled && formData.medicalEnvAllergy.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              } />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('chronicConditions')}<span className="text-red-500">*</span></label>
            <input type="text" name="chronicConditions" value={formData.chronicConditions} onChange={handleChange}
              className={
                isNotFilled && formData.chronicConditions.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              } />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('headInjury')}<span className="text-red-500">*</span></label>
            <select name="headInjury" value={formData.headInjury} onChange={handleChange}
              className={
                isNotFilled && formData.headInjury.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              }                >
              <option value="">{t('select')}</option>
              <option value="yes">{t('yes')}</option>
              <option value="no">{t('no')}</option>
            </select>
          </div>


          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('diagnosesByDoctor')}<span className="text-red-500">*</span></label>
            <input type="text" name="medicalDiagnosis" value={formData.medicalDiagnosis} onChange={handleChange}
              className={
                isNotFilled && formData.medicalDiagnosis.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              } />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('medicalConsent')} <span className="text-red-500">*</span>
            </label>
            <input type="text" name="medicalConsent" placeholder="Parent/Guardian initials" value={formData.medicalConsent} onChange={handleChange}
              className={
                isNotFilled && formData.medicalConsent.trim() === ''
                  ? 'w-full px-3 py-2 border  rounded-md focus:outline-none shadow focus:ring-2 focus:ring-red-500 focus:border-red-500 border-red-500'
                  : 'w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300'
              } />
          </div>

        </div>

        {!showSubmit &&
          <div className={remindRequiredConset ? "bg-red-50 p-4 border shadow border-red-300 rounded-lg cursor-pointer hover:bg-red-100 transition-colors duration-200" : "bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"}
            onClick={() => setShowModal(true)}
          >
            <p className="text-sm text-red-700">
              <span className="text-red-500">*</span> {t('acceptTerms')}
            </p>
            {remindRequiredConset && (
              <p className="text-sm text-red-500 mt-2">
                <span className="text-red-500">*</span>{t('remindRequiredConset')}
              </p>
            )}
          </div>
        }

        {showModal &&
          <div
            className="fixed pt-20 inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-lg overflow-y-auto"
            tabIndex={-1}
            ref={el => {
              if (el && showModal) {
                el.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowModal(false);
                setRemindRequiredConset(false);
                setShowRequiredSign(false);
              }
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
                setRemindRequiredConset(false);
                setShowRequiredSign(false);
              }
            }}
          >
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-3xl relative mx-4 my-12 mt-40">
              <div>
                <button>
                  <svg
                    onClick={() => {
                      setShowModal(false);
                      setRemindRequiredConset(false);
                      setShowRequiredSign(false);
                    }}
                    className="absolute top-4 right-4 w-6 h-6 text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">

                {/* Alert box */}
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                  <h3 className="text-lg font-semibold text-amber-800 mb-2">
                    {t('reviewCarefully')}
                  </h3>
                  <p className="text-gray-800 text-md leading-relaxed">
                    {t('acceptforAccidentallyTreatment')}<span className="text-red-500">*</span>

                  </p>
                </div>


                {/* Radio agreement list */}
                <div className='pl-4'>
                  <ul className="list-disc text-gray-800 ">
                    {[
                      t('conset1'),
                      t('conset2'),
                      t('conset3'),
                      t('conset4'),
                    ].map((item, index) => (
                      <li key={index} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <span className="text-sm md:text-base flex-1"> - {item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className='pl-4 text-gray-800'>
                  <p>
                    <span className="text-red-500">*</span>{t('credentials')}
                  </p>
                  <p>
                    {t('underCredentials')}
                  </p>
                </div>

                {showRequiredSign && <div
                  className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 transition cursor-pointer"
                >
                  <label className="block text-sm font-medium text-red-700">
                    {t('requiredSign')} <span className="text-red-500">*</span>
                  </label>
                </div>}

                {/* Signature pad */}
                <div>
                  <label className="block text-base font-medium text-gray-700 mb-2">{t('parentSignature')}<span className="text-red-500">*</span></label>
                  <div className="border border-gray-300 rounded-md p-2 w-full bg-gray-50 flex items-center justify-center">
                    <SignatureCanvas
                      ref={signatureCanvasRef}
                      penColor="purple"
                      canvasProps={{
                        height: 300,
                        className: ' bg-white rounded-md w-auto min-w-full',
                        style: { border: '1px solid #ccc', borderRadius: '4px' }
                      }}
                    />
                  </div>

                  {/* Buttons under signature pad */}
                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      onClick={clearSignature}
                      type="button"
                      className="bg-gray-100 text-gray-800 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-200 transition"
                    >
                      {t('clearSignature')}
                    </button>
                  </div>
                </div>


                {/* Final Agreement */}
                <div
                  className="bg-gray-100 p-4 rounded-lg text-center hover:bg-gray-200 transition cursor-pointer"
                  onClick={() => {
                    if (
                      !signatureCanvasRef.current ||
                      signatureCanvasRef.current.isEmpty()
                    ) {
                      setShowRequiredSign(true);
                      return;
                    }
                    saveSignature();
                    setFormData(prev => ({
                      ...prev,
                      parentSignDate: new Date().toISOString(),
                      acceptforAccidentallyTreatment: 'yes',
                    }));
                    setRemindRequiredConset(false);
                    setShowSubmit(true);
                    setShowModal(false);
                  }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    {t('acceptTerm1')} <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        }



        {
          showSubmit &&
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className='text-sm text-gray-700 mb-2'>
              <span className="text-red-500">*</span> {t('acceptTerm')}
            </p>
            <p className="text-sm text-gray-600 mb-2">
            </p>
            <p className="text-sm text-gray-600">
              <span className="text-red-500">*</span> {t('requiredFields')}
            </p>
          </div>
        }


        <button
          type={!showSubmit ? "button" : "submit"}
          disabled={showSubmit ? isSubmitting : false}
          onClick={() => {
            if (!signatureCanvasRef.current ||
              signatureCanvasRef.current.isEmpty()) {
              setRemindRequiredConset(true);
              validateForm();
            }
          }}
          className={
            !showSubmit
              ? "w-full bg-gray-200 text-white py-3 px-4 rounded-md font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              : "w-full bg-emerald-600 text-white py-3 px-4 rounded-md font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          }
        >
          {
            isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('submiting')}
              </>
            ) : (
              t('submit')
            )}
        </button>

      </form >
    </div >
  );
};

export default RegistrationForm;
