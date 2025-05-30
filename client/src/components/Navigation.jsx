import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-blue-700' : '';
  };

  return (
    <nav className="bg-gray-800 p-4 mb-6">
      <div className="max-w-4xl mx-auto flex flex-wrap gap-4">
        <Link
          to="/"
          className={`text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ${isActive('/')}`}
        >
          Home
        </Link>
        <Link
          to="/pdf-to-jpg"
          className={`text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ${isActive('/pdf-to-jpg')}`}
        >
          PDF to JPG
        </Link>
        <Link
          to="/jpg-to-pdf"
          className={`text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors ${isActive('/jpg-to-pdf')}`}
        >
          JPG to PDF
        </Link>
      </div>
    </nav>
  );
} 