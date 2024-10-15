import React, { useEffect } from 'react'
import Layout from '../Components/Layout';

const AboutPage = () => {
  // Page title
  useEffect(() => {
    document.title = 'Jobseek — About page';
  }, []);
  
  return (
    <>
      <h1>About Page</h1>
    </>
  )
}

export default AboutPage