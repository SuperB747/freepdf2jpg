import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function QA() {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      question: "Is this service completely free?",
      answer: "Yes, our service is 100% free to use. There are no hidden fees, subscriptions, or limitations on the number of conversions you can perform."
    },
    {
      question: "Are my files secure?",
      answer: "Yes, your files are completely secure. All conversions are processed on our servers and files are automatically deleted after conversion. We never store or share your files, and all transfers are encrypted using HTTPS."
    },
    {
      question: "What's the maximum file size I can convert?",
      answer: "For both PDF to JPG and JPG to PDF conversions, there is a 15MB file size limit. For JPG to PDF conversion, this means the total combined size of all JPG files cannot exceed 15MB. These limits help ensure fast and reliable conversion times for all users."
    },
    {
      question: "How long does the conversion process take?",
      answer: "Conversion time depends on the file size and number of pages/images. Most conversions complete within 10-30 seconds. Larger files may take longer. You can see the progress in real-time during conversion."
    },
    {
      question: "What is the quality of the converted files?",
      answer: "We maintain high quality in all conversions. For PDF to JPG, images are converted at 300 DPI by default, ensuring clear, readable results. For JPG to PDF, we preserve the original image quality in the PDF output."
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
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Frequently Asked Questions</h1>
        <p className="text-gray-300 mb-6">
          Find answers to common questions about our PDF to JPG and JPG to PDF conversion tools.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                className={`w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-700 transition-colors ${
                  openQuestion === index ? 'bg-gray-700' : ''
                }`}
                onClick={() => toggleQuestion(index)}
              >
                <span className="text-white font-medium">{faq.question}</span>
                <span className={`ml-4 transition-transform duration-200 ${
                  openQuestion === index ? 'rotate-180' : ''
                }`}>
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                <div className="px-6 py-4 bg-gray-900 border-t border-gray-700">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Still Have Questions?</h2>
        <p className="text-gray-300 mb-4">
          If you couldn't find the answer you were looking for, feel free to contact us. We're here to help!
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact Support
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
