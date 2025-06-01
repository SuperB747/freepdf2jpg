import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function QA() {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      question: "How secure is this service?",
      answer: "We take your privacy and security very seriously. All uploaded files are processed securely on our servers and are automatically deleted immediately after the conversion is complete. We do not store your files, and no backups are made."
    },
    {
      question: "Is this service really free?",
      answer: "Yes, our PDF to JPG and JPG to PDF conversion tools are completely free to use. There are no hidden charges or subscription fees. We aim to provide a reliable service accessible to everyone."
    },
    {
      question: "Are there any limitations on file size or number of conversions?",
      answer: "For optimal performance and to ensure the service remains free for everyone, we currently have a file size limit of 15MB per file (and total for JPG to PDF). There is no hard limit on the number of conversions you can perform."
    },
    {
      question: "Can I convert multiple files at once?",
      answer: "For JPG to PDF: Yes, you can upload multiple JPG files and combine them into a single PDF, as long as their total size doesn't exceed 15MB. For PDF to JPG: You can upload one PDF file (up to 15MB), and all pages will be converted to separate JPG images, delivered in a ZIP file."
    },
    {
      question: "What if my file is larger than 15MB?",
      answer: "If your file is larger than 15MB, we recommend using a file compression tool first to reduce the size, or splitting your file into smaller parts. This helps ensure quick and reliable conversion."
    },
    {
      question: "What file formats are supported?",
      answer: "Currently, we support PDF to JPG conversion and JPG to PDF conversion. For images, we accept .jpg and .jpeg formats. For documents, we accept PDF files. We're working on adding support for more formats in the future."
    },
    {
      question: "Do I need to create an account?",
      answer: "No, you don't need to create an account or register to use our service. Simply visit the website and start converting your files immediately."
    },
    {
      question: "Can I reorder pages in the PDF?",
      answer: "Yes, when converting JPG to PDF, you can drag and drop the images in the list to reorder them before conversion. The final PDF will maintain this order."
    },
    {
      question: "What happens if the conversion fails?",
      answer: "If a conversion fails, you'll receive an error message explaining what went wrong. Common issues include exceeding the 15MB file size limit, corrupt files, or network problems. You can try reducing the file size or checking your file's integrity before trying again."
    }
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>Q&A | FreePDF2JPG</title>
        <meta name="description" content="Find answers to frequently asked questions about FreePDF2JPG's PDF to JPG and JPG to PDF conversion tools." />
        <link rel="canonical" href="https://freepdf2jpg.ca/qa" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-300">
            Find answers to common questions about our PDF to JPG and JPG to PDF conversion tools.
          </p>
        </header>

        <div className="bg-gray-800 rounded-lg shadow-xl p-8 mb-10">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded-lg overflow-hidden transition-all duration-300 hover:border-blue-500"
              >
                <button
                  className={`w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700 focus:outline-none transition-colors ${
                    openQuestion === index ? 'bg-gray-700' : ''
                  }`}
                  onClick={() => toggleQuestion(index)}
                  aria-expanded={openQuestion === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="text-white font-medium text-lg">{faq.question}</span>
                  <span className={`ml-4 transition-transform duration-300 transform ${
                    openQuestion === index ? 'rotate-180' : ''
                  }`}>
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>
                {openQuestion === index && (
                  <div id={`faq-answer-${index}`} className="px-6 py-5 bg-gray-900 border-t border-gray-700">
                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <section className="text-center bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Still Have Questions?</h2>
          <p className="text-gray-300 mb-6">
            If you couldn't find the answer you were looking for, feel free to contact us. We're here to help!
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
          >
            <svg
              className="w-5 h-5 mr-2 -ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
            Contact Support
          </Link>
        </section>
      </div>
    </>
  );
}
