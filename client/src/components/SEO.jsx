import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, keywords }) => {
  const location = useLocation();
  const currentUrl = `https://freepdf2jpg.ca${location.pathname}`;
  
  // Default values
  const defaultTitle = "FreePDF2JPG - Free Online PDF to JPG & JPG to PDF Converter";
  const defaultDescription = "Convert PDF to JPG and JPG to PDF online for free. No registration required. Fast, secure, and easy to use. High-quality conversion with instant download.";
  const defaultKeywords = "pdf to jpg converter, jpg to pdf converter, free pdf converter, online pdf tools, convert pdf to jpg online, convert jpg to pdf online, pdf image converter, bulk pdf converter, free file converter, document conversion";

  return (
    <Helmet>
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title || defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={title || defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      
      <link rel="canonical" href={currentUrl} />
    </Helmet>
  );
};

export default SEO; 