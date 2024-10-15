import React, { useEffect } from 'react';
import Layout from '../Components/Layout';

const ContactPage = () => {
    // Page title
  useEffect(() => {
    document.title = 'Jobseek — Contact page';
  }, []);
  
  return (
    <>
      <h1>ContactPage</h1>
    </>
  )
}

export default ContactPage