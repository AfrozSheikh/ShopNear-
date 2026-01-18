import { useState } from 'react';
import { XMarkIcon, PhotoIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { showSuccess, showError, showLoading, dismissToast } from '../../utils/toast';

const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB = 5 
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const uploadToCloudinary = async (file) => {
    // For now, using a simple base64 preview
    // In production, replace with actual Cloudinary upload
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    
    // Validate number of images
    if (images.length + fileArray.length > maxImages) {
      showError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file types and sizes
    for (const file of fileArray) {
      if (!acceptedFormats.includes(file.type)) {
        showError(`Invalid file type: ${file.name}. Only JPG, PNG, WebP allowed.`);
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        showError(`File too large: ${file.name}. Max ${maxSizeMB}MB.`);
        return;
      }
    }

    setUploading(true);
    const toastId = showLoading('Uploading images...');

    try {
      const uploadPromises = fileArray.map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      onImagesChange([...images, ...uploadedUrls]);
      showSuccess(`${uploadedUrls.length} image(s) uploaded successfully!`);
    } catch (error) {
      showError('Failed to upload images');
      console.error(error);
    } finally {
      dismissToast(toastId);
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    handleFiles(e.dataTransfer.files);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={acceptedFormats.join(',')}
          onChange={handleChange}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          {uploading ? (
            <CloudArrowUpIcon className="w-12 h-12 text-primary-600 animate-bounce mb-4" />
          ) : (
            <PhotoIcon className="w-12 h-12 text-gray-400 mb-4" />
          )}
          
          <p className="text-lg font-medium text-gray-700 mb-2">
            {uploading ? 'Uploading...' : 'Drop images here or click to upload'}
          </p>
          
          <p className="text-sm text-gray-500">
            {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} • Max {maxSizeMB}MB • Up to {maxImages} images
          </p>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <p className="text-sm text-gray-500">
          {images.length} / {maxImages} images • First image is the primary image
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
