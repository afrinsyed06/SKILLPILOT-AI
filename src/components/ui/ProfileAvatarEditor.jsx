import React, { useRef, useState } from 'react';
import { Camera, Trash2, Upload, Loader2, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * Optimizes an uploaded image using HTML5 Canvas to keep localStorage payload
 * lightweight (< 80KB) while looking razor-sharp on high-DPI displays.
 */
function resizeImageFile(file, maxWidth = 512, maxHeight = 512, quality = 0.88) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Please select an image file (PNG, JPG, WebP, etc.)'));
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function ProfileAvatarEditor({
  photo = '',
  name = 'Student',
  size = 'lg',
  className = '',
  onPhotoChange,
  showRemove = true,
}) {
  const { updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const initials = (name || 'U')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('') || 'U';

  const sizeClasses = {
    md: { box: 'w-16 h-16', text: 'text-xl', badge: 'w-7 h-7', icon: 13 },
    lg: { box: 'w-24 h-24', text: 'text-3xl', badge: 'w-8 h-8', icon: 15 },
    xl: { box: 'w-32 h-32', text: 'text-4xl', badge: 'w-10 h-10', icon: 18 },
  };

  const currentSize = sizeClasses[size] || sizeClasses.lg;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be re-selected if desired
    e.target.value = '';

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const resizedBase64 = await resizeImageFile(file, 512, 512, 0.88);
      // Update global context & local storage
      updateProfile({ profilePhoto: resizedBase64 });
      if (onPhotoChange) {
        onPhotoChange(resizedBase64);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      console.error('Error uploading profile photo:', err);
      setErrorMsg(err.message || 'Failed to process image');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    if (window.confirm('Remove your profile photo and revert to initials?')) {
      updateProfile({ profilePhoto: '' });
      if (onPhotoChange) {
        onPhotoChange('');
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <div className={`relative flex flex-col items-center sm:items-start ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Avatar Container */}
      <div className="relative group">
        <div
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          title="Click to change profile photo"
          className={`relative ${currentSize.box} rounded-2xl overflow-hidden cursor-pointer select-none transition-all duration-300 ring-2 ring-blue-500/20 group-hover:ring-cyan-400/60 shadow-lg group-hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]`}
        >
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center ${currentSize.text} font-black text-white`}
              style={{ boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}
            >
              {initials}
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1 z-10">
            {isProcessing ? (
              <Loader2 size={18} className="animate-spin text-cyan-400" />
            ) : (
              <>
                <Camera size={18} className="text-cyan-400" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-200">
                  {photo ? 'Change' : 'Upload'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Button: Edit / Upload badge */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          title="Upload or change profile photo"
          className={`absolute -bottom-1 -right-1 ${currentSize.badge} rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white flex items-center justify-center shadow-lg border border-white/20 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-20`}
        >
          {isProcessing ? (
            <Loader2 size={currentSize.icon} className="animate-spin" />
          ) : showSuccess ? (
            <Check size={currentSize.icon} className="text-emerald-300" />
          ) : (
            <Camera size={currentSize.icon} />
          )}
        </button>

        {/* Remove Photo button if photo exists */}
        {photo && showRemove && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            title="Remove profile photo"
            className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center shadow-md border border-white/20 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer z-20"
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>

      {/* Text trigger & status under avatar */}
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Upload size={11} />
          {photo ? 'Change Photo' : 'Upload Photo'}
        </button>
        {photo && showRemove && (
          <>
            <span className="text-slate-600 text-xs">•</span>
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="text-[11px] font-medium text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              Remove
            </button>
          </>
        )}
      </div>

      {/* Feedback Messages */}
      {showSuccess && (
        <span className="text-[11px] text-emerald-400 font-semibold animate-pulse mt-0.5">
          Photo updated!
        </span>
      )}
      {errorMsg && (
        <span className="text-[11px] text-red-400 font-medium mt-0.5 max-w-[140px] truncate" title={errorMsg}>
          {errorMsg}
        </span>
      )}
    </div>
  );
}
