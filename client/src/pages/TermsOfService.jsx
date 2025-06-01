export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Agreement to Terms</h2>
            <p>
              By accessing and using FreePDF2JPG.ca, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Description of Service</h2>
            <p>
              FreePDF2JPG.ca provides online file conversion services, specifically:
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
              <li>Converting PDF files to JPG images</li>
              <li>Converting JPG images to PDF files</li>
              <li>Related file conversion services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Use of Service</h2>
            <p>You agree to:</p>
            <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
              <li>Use the service only for lawful purposes</li>
              <li>Not upload malicious files or content</li>
              <li>Not attempt to circumvent any service limitations</li>
              <li>Not interfere with the proper working of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">File Handling and Privacy</h2>
            <p>
              We handle your files with utmost care and privacy. Files uploaded to our service:
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
              <li>Are processed securely</li>
              <li>Are automatically deleted after conversion or within 24 hours</li>
              <li>Are not shared with third parties</li>
              <li>Are subject to our Privacy Policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Service Limitations</h2>
            <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
              <li>Maximum file size: 15MB per file</li>
              <li>Supported formats: PDF and JPG files only</li>
              <li>Service availability may vary based on server load</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Disclaimer of Warranties</h2>
            <p>
              The service is provided "as is" without any warranties. We do not guarantee that:
            </p>
            <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
              <li>The service will be uninterrupted or error-free</li>
              <li>All file conversions will be successful</li>
              <li>The quality of conversions will meet your requirements</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Limitation of Liability</h2>
            <p>
              We shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:support@freepdf2jpg.ca" className="text-blue-400 hover:text-blue-300">
                support@freepdf2jpg.ca
              </a>
            </p>
          </section>

          <p className="text-sm text-gray-400 mt-8">
            Last updated: March 21, 2024
          </p>
        </div>
      </div>
    </div>
  );
} 