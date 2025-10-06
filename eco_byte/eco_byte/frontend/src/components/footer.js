import '../styles/footer.css';
import { FaInstagram, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        {/* Company Info + Contact */}
        <div>
          <h2>Eco_Byte</h2>
          <p>A student-led startup for a cleaner & greener India 🌱.</p>
          <p>📍 Vijayawada, Andhra Pradesh</p>
          <p>✉️ support@eco_byte.com</p>
          <p>📞 +91 98765 43210</p>
        </div>

        {/* Quick Links */}
        <div>
          <h2>Quick Links</h2>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/book">Book Now</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2>Follow Us</h2>
          <div className="social-icons">
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
              <FaYoutube />
            </a>
            {/* <a href="https://www.x.com" target="_blank" rel="noopener noreferrer">
              <FaXTwitter />
            </a> */}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Eco_Byte | All Rights Reserved
      </div>
    </footer>
  );
}
