// Date and number formatting utilities for Indian market

// Format date in Indian format (DD/MM/YYYY)
export const formatIndianDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Format time in Indian format (12-hour with AM/PM)
export const formatIndianTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Format date and time together
export const formatIndianDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Format currency in Indian Rupees with proper formatting
export const formatIndianCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

// Format numbers in Indian numbering system (with lakhs and crores)
export const formatIndianNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

// Convert amount to words in Indian format
export const amountToWords = (amount) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (amount === 0) return 'Zero Rupees';

  let words = '';
  
  // Crores
  if (amount >= 10000000) {
    words += amountToWords(Math.floor(amount / 10000000)) + ' Crore ';
    amount %= 10000000;
  }
  
  // Lakhs
  if (amount >= 100000) {
    words += amountToWords(Math.floor(amount / 100000)) + ' Lakh ';
    amount %= 100000;
  }
  
  // Thousands
  if (amount >= 1000) {
    words += amountToWords(Math.floor(amount / 1000)) + ' Thousand ';
    amount %= 1000;
  }
  
  // Hundreds
  if (amount >= 100) {
    words += ones[Math.floor(amount / 100)] + ' Hundred ';
    amount %= 100;
  }
  
  // Tens and ones
  if (amount >= 20) {
    words += tens[Math.floor(amount / 10)] + ' ';
    amount %= 10;
  } else if (amount >= 10) {
    words += teens[amount - 10] + ' ';
    amount = 0;
  }
  
  if (amount > 0) {
    words += ones[amount] + ' ';
  }
  
  return words.trim() + ' Rupees';
};

// Format relative time in Indian context
export const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatIndianDate(date);
};
