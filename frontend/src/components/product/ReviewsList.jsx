import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, HandThumbUpIcon } from '@heroicons/react/24/outline';
import { HandThumbUpIcon as HandThumbUpSolidIcon } from '@heroicons/react/24/solid';
import { formatDate } from '../common/UIComponents';

const ReviewsList = ({ reviews = [], onHelpfulClick }) => {
  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const averageRating = getAverageRating();
  const distribution = getRatingDistribution();
  const totalReviews = reviews.length;

  if (reviews.length === 0) {
    return (
      <div className="card text-center py-12">
        <StarOutlineIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="text-5xl font-bold text-gray-900 mb-2">{averageRating}</div>
            <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`w-6 h-6 ${
                    star <= Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = distribution[rating];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id || review.id} className="card">
            {/* Review Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-5 h-5 ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="font-semibold text-gray-900">{review.userId?.profile?.name || 'Anonymous'}</p>
                {review.verified && (
                  <span className="text-xs text-green-600">✓ Verified Purchase</span>
                )}
              </div>
              <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
            </div>

            {/* Review Title */}
            {review.title && (
              <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
            )}

            {/* Review Comment */}
            <p className="text-gray-700 mb-3">{review.comment}</p>

            {/* Review Images */}
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-3">
                {review.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Review ${idx + 1}`}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                  />
                ))}
              </div>
            )}

            {/* Helpful Button */}
            <div className="flex items-center gap-2 pt-3 border-t">
              <button
                onClick={() => onHelpfulClick && onHelpfulClick(review._id || review.id)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
              >
                {review.helpful && review.helpful.length > 0 ? (
                  <HandThumbUpSolidIcon className="w-5 h-5 text-primary-600" />
                ) : (
                  <HandThumbUpIcon className="w-5 h-5" />
                )}
                <span>Helpful {review.helpful && review.helpful.length > 0 ? `(${review.helpful.length})` : ''}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsList;
