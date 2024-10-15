import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';

const NotFoundPage = () => {
  return (
    <>
      <h3>404 This pag is Not Found. Go to the home page by clicking here <Link to="/">Home page</Link></h3>
    </>
  )
}

export default NotFoundPage