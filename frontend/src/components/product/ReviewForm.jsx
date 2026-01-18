import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { showSuccess, showError } from '../../utils/toast';

const ReviewForm = ({ productId, onReviewSubmitted, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      showError('Please select a rating');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const reviewData = {
        productId,
        rating,
        title,
        comment,
        images,
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showSuccess('Review submitted successfully!');
      onReviewSubmitted(reviewData);
      
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setImages([]);
    } catch (error) {
      showError('Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      showError('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Rating *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              {star <= (hoverRating || rating) ? (
                <StarIcon className="w-8 h-8 text-yellow-400" />
              ) : (
                <StarOutlineIcon className="w-8 h-8 text-gray-300" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Review Title */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Review Title *
        </label>
        <input
          type="text"
          required
          className="input-field"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
        />
      </div>

      {/* Review Comment */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Your Review *
        </label>
        <textarea
          required
          rows={5}
          className="input-field"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about the product..."
          maxLength={500}
        />
        <p className="text-xs text-gray-500 mt-1">{comment.length}/500 characters</p>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Add Photos (Optional)
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="review-images"
        />
        <label
          htmlFor="review-images"
          className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary-500 transition-colors"
        >
          <PhotoIcon className="w-6 h-6 text-gray-400" />
          <span className="text-sm text-gray-600">Upload images (max 5)</span>
        </label>

        {images.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mt-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square">
                <img
                  src={img}
                  alt={`Review ${idx + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn-primary flex-1"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
