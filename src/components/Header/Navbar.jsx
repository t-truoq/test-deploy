import './Navbar.css';
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand" href="#">
          <img
            src="/logo/logo.webp" // Thay thế bằng đường dẫn logo của bạn
            alt="Beauty Logo"
            style={{ height: "40px" }}
          />
          BEAUTYA
        </a>

        {/* Toggle button cho mobile */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list fs-3"></i>
        </button>

        {/* Menu items */}
        <div className="collapse navbar-collapse" id="navbarNav" style={{ zIndex: 1000 }}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <a className="nav-link py-2" href="#makeup">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#skincare">
                About
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#gifts">
                Blog
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#branches">
                Products
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#our-brand">
                Services
              </a>
            </li>
            <li className="nav-item mt-2 mt-lg-0">
              <form className="d-flex">
                <div className="input-group">
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    placeholder="Tìm kiếm..."
                    aria-label="Search"
                  />
                  <button className="btn btn-outline btn-sm" type="submit">
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </form>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#language">
                US (EN)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
