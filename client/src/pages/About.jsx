import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function About() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Helmet>
        <title>About Us | FreePDF2JPG</title>
        <meta name="description" content="Learn more about FreePDF2JPG, our mission, and our commitment to providing free, secure, and easy-to-use file conversion tools." />
        <link rel="canonical" href="https://freepdf2jpg.ca/about" />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">About FreePDF2JPG</h1>
          <p className="text-xl text-gray-300">
            Your reliable partner for simple and secure file conversions.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">Our Mission</h2>
          <div className="bg-gray-800 rounded-lg p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-start mb-6">
              <span className="text-4xl mr-4">🎯</span>
              <h3 className="text-2xl font-semibold text-purple-400">Empowering Digital Conversion</h3>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                At FreePDF2JPG, our mission is to provide everyone with easy-to-use, reliable, and completely free file conversion tools. We believe that basic utilities like converting PDFs to JPGs or merging JPGs into PDFs should be accessible to all, without intrusive ads or hidden fees.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <span className="text-2xl mb-2 block">🚀</span>
                  <h4 className="text-white font-semibold mb-2">Simplicity</h4>
                  <p className="text-gray-300 text-sm">Easy-to-use tools for everyone</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <span className="text-2xl mb-2 block">💎</span>
                  <h4 className="text-white font-semibold mb-2">Quality</h4>
                  <p className="text-gray-300 text-sm">High-quality conversion results</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <span className="text-2xl mb-2 block">🔒</span>
                  <h4 className="text-white font-semibold mb-2">Security</h4>
                  <p className="text-gray-300 text-sm">Your privacy is our priority</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-white mb-6 text-center">Why Choose Us?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-blue-400">Privacy & Security</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🔒</span>
                  <span>Your files are processed securely and deleted immediately after conversion.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">⚡</span>
                  <span>All conversions happen on our secure servers, not in your browser.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🛡️</span>
                  <span>We never store or share your files with third parties.</span>
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-2xl font-semibold mb-4 text-green-400">User-Focused Experience</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start">
                  <span className="text-2xl mr-3">⚡</span>
                  <span>Enjoy a fast, intuitive, and straightforward interface designed for everyone.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">💸</span>
                  <span>Absolutely 100% free to use, with no hidden costs or mandatory subscriptions.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-2xl mr-3">🌍</span>
                  <span>Accessible on all modern devices and browsers, so you can convert files anytime, anywhere.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold text-white mb-6">Ready to Convert Your Files?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Experience the simplicity and security of FreePDF2JPG today.
          </p>
          <div className="space-x-4">
            <button
              onClick={() => handleNavigation('/pdf-to-jpg')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-300"
            >
              PDF to JPG
            </button>
            <button
              onClick={() => handleNavigation('/jpg-to-pdf')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-300"
            >
              JPG to PDF
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
