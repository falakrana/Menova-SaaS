import React from 'react';
import { X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: string;
  restaurantName: string;
}

export default function LocationModal({ isOpen, onClose, location, restaurantName }: LocationModalProps) {
  if (!isOpen) return null;

  const getGoogleMapsEmbedUrl = (locationString: string) => {
    // If it's already a Google Maps URL, extract coordinates or place info
    if (locationString.includes('google.com/maps')) {
      try {
        const url = new URL(locationString);
        
        // Extract coordinates from URL if present (e.g., /@22.2997017,73.1251965)
        const coordMatch = locationString.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coordMatch) {
          const lat = coordMatch[1];
          const lng = coordMatch[2];
          return `https://maps.google.com/maps?q=${lat},${lng}&output=embed`;
        }
        
        // Extract place_id if present
        const placeIdMatch = locationString.match(/place_id=([^&]+)/);
        if (placeIdMatch) {
          return `https://maps.google.com/maps?q=place_id:${placeIdMatch[1]}&output=embed`;
        }
        
        // Extract query parameter if present
        const qParam = url.searchParams.get('q');
        if (qParam) {
          return `https://maps.google.com/maps?q=${encodeURIComponent(qParam)}&output=embed`;
        }
        
        // If all else fails, try to extract from pathname
        const pathParts = url.pathname.split('/');
        const placeIndex = pathParts.indexOf('place');
        if (placeIndex !== -1 && pathParts[placeIndex + 1]) {
          const placeName = decodeURIComponent(pathParts[placeIndex + 1]);
          return `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&output=embed`;
        }
      } catch (e) {
        // If URL parsing fails, fall through to default behavior
      }
    }
    
    // For plain text addresses
    const encodedLocation = encodeURIComponent(locationString);
    return `https://maps.google.com/maps?q=${encodedLocation}&output=embed`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 sm:inset-6 md:inset-8 m-auto w-full max-w-4xl h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)] md:h-[calc(100vh-4rem)] max-h-[700px] z-50"
          >
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col max-h-full">
              <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 border-b border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-base sm:text-lg text-slate-900 truncate">{restaurantName}</h3>
                    <p className="text-xs sm:text-sm text-slate-500">Location</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-600 hover:text-slate-900 flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              
              <div className="flex-1 relative min-h-0">
                <iframe
                  src={getGoogleMapsEmbedUrl(location)}
                  className="w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Location of ${restaurantName}`}
                  allowFullScreen
                />
              </div>

              <div className="p-3 sm:p-4 md:p-6 border-t border-slate-200 bg-slate-50">
                <div className="flex items-start gap-2 sm:gap-3">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed break-words">{location}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
