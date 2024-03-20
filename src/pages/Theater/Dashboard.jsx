import React from 'react';

const TheaterDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Theater Dashboard</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Replace with your dashboard content */}
          <div className="px-4 py-8 bg-white shadow sm:rounded-lg">
            <p className="text-lg text-gray-700">Welcome to the theater dashboard! Here, you can manage your website or application.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TheaterDashboard;