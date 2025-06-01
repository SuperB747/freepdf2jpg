import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className="bg-gray-900 py-2 px-3 sm:px-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link to="/" className="text-white font-semibold text-lg sm:text-xl whitespace-nowrap">
          FreePDF2JPG
        </Link>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm sm:text-base">
          <Link to="/pdf-to-jpg" className="text-gray-300 hover:text-white px-2 py-1">
            PDF to JPG
          </Link>
          <Link to="/jpg-to-pdf" className="text-gray-300 hover:text-white px-2 py-1">
            JPG to PDF
          </Link>
          <Link to="/about" className="text-gray-300 hover:text-white px-2 py-1">
            About
          </Link>
          <Link to="/qa" className="text-gray-300 hover:text-white px-2 py-1">
            Q&A
          </Link>
          <Link to="/contact" className="text-gray-300 hover:text-white px-2 py-1 whitespace-nowrap">
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 