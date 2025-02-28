import Column1 from "./componentsFooter/Column1";
import Column2 from "./componentsFooter/Column2";
import Column3 from "./componentsFooter/Column3";
import Copyright from "./componentsFooter/Copyright";

const Footer = () => {
  return (
    <footer className="bg-[#3D021E] text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cột 1 */}
          <Column1/>

          {/* Cột 2 */}
          <Column2/>

          {/* Cột 3 */}
          <Column3/>
        </div>

        {/* Copyright Section */}
        <Copyright/>
      </div>
    </footer>
  );
};

export default Footer;
