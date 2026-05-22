import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8">
    <h1 className="font-bold text-[2.5rem]">404</h1>
    <p className="mb-0">Page not found.</p>

    <Link
      to="/"
      className="font-medium text-primary hover:text-primary-hover hover:scale-[1.01] transition-all duration-200"
    >
      Back to login
    </Link>
  </div>
);

export default NotFound;
