import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | FreePDF2JPG</title>
        <meta name="description" content="Read the Privacy Policy for FreePDF2JPG to understand how we handle your data and protect your privacy during file conversions."
        />
        <link rel="canonical" href="https://freepdf2jpg.ca/privacy-policy" />
      </Helmet>
      <div className="max-w-3xl mx-auto px-4 py-10 text-gray-300">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-lg">
            Last updated: March 14, 2024
          </p>
        </header>

        <div className="bg-gray-800 rounded-lg shadow-xl p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Introduction</h2>
            <p className="leading-relaxed">
              Welcome to FreePDF2JPG ("us", "we", or "our"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://freepdf2jpg.ca" className="text-blue-400 hover:text-blue-300">https://freepdf2jpg.ca</a> (the "Site") and use our file conversion services (the "Services"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
            <p className="leading-relaxed">
              We do not collect any personal information from you when you use our Site or Services. You are not required to create an account or provide any personal data to convert files.
            </p>
            <h3 className="text-xl font-semibold text-white mt-4 mb-2">File Handling</h3>
            <p className="leading-relaxed">
              When you upload files for conversion, these files are temporarily stored on our secure servers solely for the purpose of performing the conversion. All uploaded files, as well as the converted output files, are automatically and permanently deleted from our servers immediately after the conversion process is completed or after a short period of inactivity (typically a few minutes) if the download is not initiated. We do not store, review, or make backups of your files.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
            <p className="leading-relaxed">
              Since we do not collect personal information, we do not use it for any purpose. The files you upload are used exclusively for the conversion service you request and are not accessed or used for any other reason.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Disclosure of Your Information</h2>
            <p className="leading-relaxed">
              We do not sell, trade, rent, or otherwise transfer your uploaded files or any potential metadata to third parties. As files are deleted immediately after processing, there is no data to disclose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational security measures designed to protect the security of any files you upload. We use HTTPS encryption for all data transfers between your browser and our servers. While we have taken reasonable steps to secure the files you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Cookies and Tracking Technologies</h2>
            <p className="leading-relaxed">
              Our Site may use cookies and similar tracking technologies (like web beacons and pixels) to enhance user experience and to analyze site traffic. These are used for purposes such as maintaining session information for file uploads or understanding how users interact with our Site. We do not use cookies to collect personal information. You can control the use of cookies at the individual browser level. If you reject cookies, you may still use our Site, but your ability to use some features or areas of our Site may be limited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Third-Party Services</h2>
            <p className="leading-relaxed">
              We may use third-party services, such as analytics providers (e.g., Google Analytics), to help us understand the usage of our Site. These third parties may use cookies or other tracking technologies to collect information about your use of our Site. The information collected is typically anonymous and aggregated. We do not share uploaded files with these third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Children's Privacy</h2>
            <p className="leading-relaxed">
              Our Services are not intended for use by children under the age of 13. We do not knowingly collect any personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to This Privacy Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact us at:
              <a href="mailto:freepdf2jpg@gmail.com" className="text-blue-400 hover:text-blue-300 ml-1">
                freepdf2jpg@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </>
  );
} 