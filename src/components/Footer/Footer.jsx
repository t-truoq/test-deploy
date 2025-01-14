import { Container, Row, Col, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

function Footer() {
  return (
    <footer className=" text-light">
      <Container>
        <Row>
          <Col sm={4}>
            <h3>How Can We Help?</h3>
            <Nav className="flex-column">
              <Nav.Link href="#">Beautya Branches</Nav.Link>
              <Nav.Link href="#">Contact Us</Nav.Link>
              <Nav.Link href="#">FAQ</Nav.Link>
              <Nav.Link href="#">Our Brand</Nav.Link>
              <Nav.Link href="#">Blog</Nav.Link>
            </Nav>
          </Col>
          <Col sm={4}>
            <h3>Products</h3>
            <Nav className="flex-column">
              <Nav.Link href="#">Dưỡng ẩm</Nav.Link>
              <Nav.Link href="#">Kem chống nắng</Nav.Link>
              <Nav.Link href="#">Sửa rửa mặt</Nav.Link>
            </Nav>
          </Col>
          <Col sm={4}>
            <h3>Keep In Touch With Beautya</h3>
            <form>
              <input type="email" placeholder="Email Address" />
              <button type="submit">Subscribe</button>
            </form>
            <p>By submitting your email, you agree to receive advertising emails from Beautya. Please review our Privacy Policy, which includes our Financial Incentive Notice for CA Residents.</p>
            <div className="social-icons">
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-pinterest"></i></a>
              <a href="#"><i className="fab fa-tiktok"></i></a>
            </div>
          </Col>
        </Row>
        <div className="copyright">
          <p>© 2023 Beautya. All rights reserved.</p>
          <Nav className="justify-content-end">
            <Nav.Link href="#">Terms & Conditions</Nav.Link>
            <Nav.Link href="#">Privacy Policy</Nav.Link>
          </Nav>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;