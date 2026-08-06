import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter((x) => x);

  return (

     <>
         <div className="container mx-auto px-4 pt-6 text-end">
          <nav className="flex items-center text-sm text-gray-600">
            <Link
              to="/dashboard"
              className="hover:text-blue-600 font-medium"
            >
              Dashboard
            </Link>

            {pathnames.slice(1).map((name, index) => {
              const routeTo =
                "/" + pathnames.slice(0, index + 2).join("/");

              const isLast =
                index === pathnames.slice(1).length - 1;

              return (
                <React.Fragment key={routeTo}>
                  <span className="mx-2">/</span>

                  {isLast ? (
                    <span className="font-semibold text-gray-900 capitalize">
                      {name.replace("-", " ")}
                    </span>
                  ) : (
                    <Link
                      to={routeTo}
                      className="hover:text-blue-600 capitalize"
                    >
                      {name.replace("-", " ")}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          </div>
 
 


     
        <Outlet />
    </>
    

  );
};

export default Dashboard;