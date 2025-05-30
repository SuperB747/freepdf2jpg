

export default function About() {
  return (
    <div className="p-8 text-gray-100 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">About FreePDF2JPG</h1>
      <p className="mb-6 text-lg leading-relaxed">
        FreePDF2JPG is a modern and secure web application designed to help you easily convert your PDF files to JPG images and vice versa. 
        Our service is completely free to use, and your privacy is our top priority. When you upload a file, it is securely processed through our server and 
        permanently deleted right after the conversion is completed — no backups, no tracking. You can use our tool with peace of mind, knowing your files 
        stay safe and private..
      </p>

      <div className="mb-6">
        <p className="text-xl font-semibold mb-2">✨ Quick Highlights</p>
        <ul className="list-disc list-inside space-y-2 text-lg">
          <li>🔐 Secure file processing on our server</li>
          <li>🧹 Files are deleted right after conversion</li>
          <li>⚡ Fast and user-friendly interface</li>
          <li>💸 100% free with no sign-up required</li>
          <li>🌍 Works on all devices and browsers</li>
        </ul>
      </div>

      <div>
        <p className="text-2xl font-bold mb-4">Why Choose FreePDF2JPG?</p>
        <p className="text-lg leading-relaxed">
          With so many tools out there, we understand it can be hard to choose. That’s why we’ve built FreePDF2JPG with simplicity and trust in mind.
          There are no hidden costs, no data tracking, and no complicated steps — just a reliable tool that does exactly what you need.
          Whether you're working on a project, sharing documents, or organizing your files, FreePDF2JPG is here to help you get the job done quickly and securely.
        </p>
      </div>
    </div>
  );
}
