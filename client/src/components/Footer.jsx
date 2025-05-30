export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 mt-auto py-6">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <p className="text-gray-400 text-sm">
          © {currentYear} FreePDF2JPG. All rights reserved.
        </p>
        <p className="text-gray-500 text-xs mt-2">
          Free online PDF to JPG and JPG to PDF converter. Fast, secure, and easy to use.
        </p>
      </div>
    </footer>
  );
}