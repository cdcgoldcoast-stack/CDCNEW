import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <SEO
        title="Page Not Found"
        description="The requested page could not be found."
        url={location.pathname}
        noIndex={true}
      />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <h2 className="mb-4 text-xl font-normal text-muted-foreground">Oops! Page not found</h2>
        <div className="text-sm">
          <Link to="/" className="text-primary underline hover:text-primary/90">
            Return to the Gold Coast renovation home page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
