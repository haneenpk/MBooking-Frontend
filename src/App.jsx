import React from 'react';
import { Toaster } from 'sonner'
import Layout from "./layouts/Layout";

function App() {
  return (
    <div>
      <Toaster richColors position="top-center"/>
      <Layout />
    </div>
  )
};

export default App;
