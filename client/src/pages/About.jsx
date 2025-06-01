export default function About() {
  return (
    <div className="py-8 px-4 text-gray-100 max-w-4xl mx-auto">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-6 text-center">About FreePDF2JPG</h1>
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <p className="text-lg leading-relaxed text-gray-300">
        FreePDF2JPG is a modern and secure web application designed to help you easily convert your PDF files to JPG images and vice versa. 
        Our service is completely free to use, and your privacy is our top priority. When you upload a file, it is securely processed through our server and 
        permanently deleted right after the conversion is completed — no backups, no tracking. You can use our tool with peace of mind, knowing your files 
            stay safe and private.
      </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">✨ Key Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">Security & Privacy</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-3">🔐</span>
                <span>Secure file processing with end-to-end encryption</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">🧹</span>
                <span>Immediate file deletion after conversion</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">🛡️</span>
                <span>No data tracking or storage</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-green-400">User Experience</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="mr-3">⚡</span>
                <span>Fast and intuitive interface</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">💸</span>
                <span>100% free with no registration required</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">🌍</span>
                <span>Compatible with all modern devices and browsers</span>
              </li>
        </ul>
      </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose FreePDF2JPG?</h2>
        <div className="bg-gray-800 rounded-lg p-8">
          <p className="text-lg leading-relaxed text-gray-300">
            With so many tools out there, we understand it can be hard to choose. That's why we've built FreePDF2JPG with simplicity and trust in mind.
          There are no hidden costs, no data tracking, and no complicated steps — just a reliable tool that does exactly what you need.
          </p>
          <p className="text-lg leading-relaxed text-gray-300 mt-4">
          Whether you're working on a project, sharing documents, or organizing your files, FreePDF2JPG is here to help you get the job done quickly and securely.
            Our commitment to privacy and ease of use makes us the perfect choice for all your PDF and JPG conversion needs.
        </p>
      </div>
      </section>
    </div>
  );
}
