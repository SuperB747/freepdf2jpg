export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-white mb-6">Privacy Policy</h1>
        
        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Introduction</h2>
            <p>
              At FreePDF2JPG, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our online file conversion services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
              <li>Files you upload for conversion</li>
              <li>Technical information about your device and browser</li>
              <li>Usage data about how you interact with our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">How We Use Your Information</h2>
            <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
              <li>To provide our file conversion services</li>
              <li>To improve our website and services</li>
              <li>To respond to your inquiries and support requests</li>
              <li>To maintain the security of our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">File Storage and Security</h2>
            <p>
              We do not permanently store your uploaded files. All files are automatically deleted from our servers after conversion is complete or within a maximum of 24 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
            <p>
              We may use third-party services to help operate our website and provide our services. These services may collect information about you as described in their respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside mt-2 ml-4 space-y-2">
              <li>Access your personal information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
              <li>Request correction of inaccurate information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:support@freepdf2jpg.ca" className="text-blue-400 hover:text-blue-300">
                support@freepdf2jpg.ca
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
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