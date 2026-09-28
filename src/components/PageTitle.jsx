import { useEffect } from "react";

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = `${title} | VYASON`;
  }, [title]);

  return null;
};

export default PageTitle;