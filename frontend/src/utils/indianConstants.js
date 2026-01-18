// Indian Market Constants

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

export const INDIAN_CATEGORIES = [
  'Groceries & Staples',
  'Fruits & Vegetables',
  'Dairy & Bakery',
  'Snacks & Beverages',
  'Personal Care & Hygiene',
  'Home & Kitchen',
  'Electronics & Appliances',
  'Fashion & Apparel',
  'Footwear',
  'Mobile & Accessories',
  'Books & Stationery',
  'Toys & Baby Products',
  'Health & Wellness',
  'Sports & Fitness',
  'Home Decor & Furnishing',
  'Hardware & Tools',
  'Pet Supplies',
  'Pooja & Festive Items',
  'Ayurvedic & Herbal Products',
  'Beauty & Cosmetics',
  'Automotive',
  'Other'
];

// Validation functions
export const validateIndianPhone = (phone) => {
  // Matches: 9876543210 or +919876543210 or +91-9876543210
  const regex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
  return regex.test(phone);
};

export const validatePincode = (pincode) => {
  return /^\d{6}$/.test(pincode);
};

export const validateGST = (gst) => {
  if (!gst) return true; // Optional
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
};

export const validateFSSAI = (fssai) => {
  if (!fssai) return true; // Optional
  return /^\d{14}$/.test(fssai);
};

// Format phone for display
export const formatIndianPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

// Format pincode
export const formatPincode = (pincode) => {
  return pincode.replace(/\D/g, '').slice(0, 6);
};

export const BUSINESS_TYPES = [
  'Individual',
  'Sole Proprietorship',
  'Partnership',
  'Private Limited Company',
  'Limited Liability Partnership (LLP)',
  'Public Limited Company'
];

export const DELIVERY_TIME_SLOTS = [
  { id: '9-12', label: 'Morning (9 AM - 12 PM)' },
  { id: '12-15', label: 'Afternoon (12 PM - 3 PM)' },
  { id: '15-18', label: 'Evening (3 PM - 6 PM)' },
  { id: '18-21', label: 'Night (6 PM - 9 PM)' }
];
