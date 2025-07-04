import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import ImageLoader from '../components/ImageLoader';
import { supabase } from '../subabaseClient';

interface CaptionImage {
  en?: string,
  ru?: string,
  uz?: string
}

interface Image {
  id?: string,
  url?: string,
  alt?: CaptionImage,
  category?: CaptionImage,
}


interface CategoryOption {
  key: string;
  label: string;
}

const Gallery: React.FC = () => {

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [images, setImages] = useState<Image[]>([])
  const { t, language } = useLanguage();

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryOption | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("category_image")
        .select("en, ru, uz");

      if (error || !data) {
        console.error("❌ Error fetching categories:", error?.message);
        return;
      }

      const catOptions: CategoryOption[] = [
        { key: 'all', label: t('all') }, // qo‘shimcha "All" varianti
        ...data.map((cat: CaptionImage) => ({
          key: cat?.en ?? '', // "en" – key uchun, fallback to empty string
          label: getTranslation(cat), // tarjima
        }))
      ];

      setCategories(catOptions);
      setActiveCategory(catOptions[0]); // default: "All"
    };

    fetchCategories();
  }, [t]);

  useEffect(() => {
    const fetchImageFromDB = async () => {
      const { data, error } = await supabase
        .from("images")
        .select(`id, url, alt (en, ru, uz), category (en, ru, uz)`);

      if (error || !data) {
        console.error("❌ Error fetching image:", error?.message);
        return;
      }

      const processed = data
        .filter(image => image.id !== 'bf61e4fe-0d76-420f-8666-b419e02f6564')
        .map(image => ({
          id: image.id,
          url: image.url,
          alt: Array.isArray(image.alt) ? image.alt[0] : image.alt,
          category: Array.isArray(image.category) ? image.category[0] : image.category,
        }));

      setImages(processed);
      // console.log("✅ Images fetched:", processed);
    };

    fetchImageFromDB();
  }, []);



  const filteredImages = activeCategory?.key === 'all'
    ? images
    : images.filter(image =>
      getTranslation( image.category) === activeCategory?.label
    );


 function getTranslation( caption?: CaptionImage): string {
    if (!caption) return '';
    return caption[language] || caption.en || caption.uz || caption.ru || '';
  }



  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[40vh] from-emerald-50 to-blue-50 bg-gradient-to-tr overflow-hidden">

        <div className="absolute inset-0 backdrop-blur-md bg-white/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('gallery')}
          </h1>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto">
            {t('galleryDesc')}
          </p>
        </div>
      </section>


      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${ activeCategory?.key === category.key
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'
                  }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                onClick={() => setSelectedImage(image.url ?? null)}
              >
                <div className="aspect-w-16 aspect-h-12 relative">
                  <ImageLoader url={image.url} imageId={image.id} style='w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300' />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 bg-white">
                  <span className="text-sm text-emerald-600 font-medium">{getTranslation(image.category)}</span>
                  <p className="text-gray-700 mt-1">{getTranslation(image.alt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-15 right-0 text-white justify-center items-center hover:text-gray-300 transition-colors"
            >
              <X className="h-8 w-8 " />
            </button>
            <img
              src={selectedImage}
              alt="Gallery image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;