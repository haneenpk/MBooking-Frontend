import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 px-6 flex justify-center items-center">
      <p className="text-center">&copy; {new Date().getFullYear()} MBooking. All rights reserved.</p>
    </footer>
  );
};

export default Footer;