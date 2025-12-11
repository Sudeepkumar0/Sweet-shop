import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/about.css";

export default function About() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !message) {
      setError("Please provide your email and a short message.");
      return;
    }

    const subject = encodeURIComponent(
      `Inquiry from SweetShop - ${name || "Visitor"}`
    );
    const body = encodeURIComponent(
      `${message}\n\n---\nName: ${name || "(not provided)"}\nEmail: ${email}`
    );

    window.location.href = `mailto:hello@sweetshop.example?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <main className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <span className="hero-badge">Est. 2020</span>
          <h1 className="hero-title">Crafting Sweet Memories</h1>
          <p className="hero-subtitle">
            Artisanal confections made with premium ingredients, <br />
            delivered fresh to your doorstep
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/sweets")}>
              Explore Collection
            </button>
            <button
              className="btn-secondary"
              onClick={() =>
                document
                  .querySelector(".contact-section")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🍬</div>
              <div className="stat-number">500+</div>
              <div className="stat-label">Products Sold Daily</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-number">1000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🍰</div>
              <div className="stat-number">50+</div>
              <div className="stat-label">Sweet Varieties</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🚚</div>
              <div className="stat-number">100%</div>
              <div className="stat-label">Fresh & On-Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <span className="section-badge">Our Story</span>
              <h2>Where Tradition Meets Innovation</h2>
              <p className="lead-text">
                Founded in 2020, SweetShop began with a simple mission: to bring
                the joy of handcrafted confections to every home.
              </p>
              <p>
                What started as a small neighborhood bakery has grown into a
                beloved destination for sweet lovers across the city. We blend
                time-honored recipes passed down through generations with modern
                flavor profiles and presentation techniques.
              </p>
              <p>
                Every sweet we create is made in small batches using premium
                ingredients sourced from trusted suppliers. We believe that the
                best confections come from patience, precision, and passion –
                values that guide everything we do.
              </p>
              <div className="story-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Premium Quality Ingredients</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Small Batch Production</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Traditional Recipes</span>
                </div>
              </div>
            </div>
            <div className="story-image">
              <div className="image-placeholder">
                <span className="placeholder-icon">🍰</span>
                <p>Crafting Excellence Daily</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Our Team</span>
            <h2>Meet the Artisans</h2>
            <p>
              Passionate professionals dedicated to creating extraordinary
              experiences
            </p>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">👨‍🍳</div>
              <h3>Sudeep Kumar</h3>
              <p className="team-role">Founder & Master Confectioner</p>
              <p className="team-bio">
                With over 10 years of experience in artisanal baking and pastry
                arts, Sudeep brings expertise in creating custom desserts and
                traditional sweets with a modern twist.
              </p>
            </div>
            <div className="team-card">
              <div className="team-avatar">👩‍🍳</div>
              <h3>Head Pastry Chef</h3>
              <p className="team-role">Lead Baker & Recipe Developer</p>
              <p className="team-bio">
                Our head chef specializes in innovative flavor combinations and
                ensures every batch meets our high standards of quality and
                taste.
              </p>
            </div>
            <div className="team-card">
              <div className="team-avatar">🎨</div>
              <h3>Design Team</h3>
              <p className="team-role">Presentation & Packaging</p>
              <p className="team-bio">
                Our creative team ensures every sweet not only tastes amazing
                but looks stunning, perfect for gifting or special occasions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Our Values</span>
            <h2>What We Stand For</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🌟</div>
              <h3>Quality First</h3>
              <p>
                We never compromise on ingredients or craftsmanship. Every
                product is made with care and attention to detail.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Freshness Guaranteed</h3>
              <p>
                All sweets are prepared fresh daily in small batches to ensure
                maximum flavor and quality.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Community Focus</h3>
              <p>
                We support local suppliers and participate in community events,
                giving back to those who support us.
              </p>
            </div>
            <div className="value-card">
              <div className="value-icon">💚</div>
              <h3>Transparency</h3>
              <p>
                Full ingredient lists and allergen information available for
                every product we create.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="info-section">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📍</div>
              <h3>Visit Us</h3>
              <p className="info-detail">
                Sai Mistrywood Layout
                <br />
                Yalahanka, Bangalore - 560064
                <br />
                Karnataka, India
              </p>
              <p className="info-hours">
                <strong>Store Hours:</strong>
                <br />
                Monday - Saturday: 9:00 AM - 7:00 PM
                <br />
                Sunday: 10:00 AM - 5:00 PM
              </p>
            </div>
            <div className="info-card">
              <div className="info-icon">📞</div>
              <h3>Call Us</h3>
              <p className="info-detail">
                <a href="tel:+915551234567">+91 (555) 123-4567</a>
              </p>
              <p className="info-hours">
                Available during business hours
                <br />
                Quick response to urgent inquiries
              </p>
            </div>
            <div className="info-card">
              <div className="info-icon">✉️</div>
              <h3>Email Us</h3>
              <p className="info-detail">
                <a href="mailto:hello@sweetshop.example">
                  hello@sweetshop.example
                </a>
              </p>
              <p className="info-hours">
                We respond within 24 hours
                <br />
                For orders, inquiries & feedback
              </p>
            </div>
            <div className="info-card">
              <div className="info-icon">🚚</div>
              <h3>Delivery</h3>
              <p className="info-detail">Free delivery on orders above ₹500</p>
              <p className="info-hours">
                Same-day within 10km radius
                <br />
                2-5 business days nationwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Testimonials</span>
            <h2>What Our Customers Say</h2>
            <p>Don't just take our word for it</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Absolutely exceptional! The honey truffles are divine, and the
                packaging is so elegant. Perfect for gifting. Will definitely
                order again!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">A</div>
                <div>
                  <div className="author-name">Anjali Sharma</div>
                  <div className="author-role">Regular Customer</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Ordered custom boxes for our wedding. The team was incredibly
                helpful and the sweets were a huge hit with our guests. Highly
                recommend!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">R</div>
                <div>
                  <div className="author-name">Rajesh Kumar</div>
                  <div className="author-role">Event Planner</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Best sweets in Bangalore! Fresh, delicious, and always
                delivered on time. The quality is consistently outstanding."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">P</div>
                <div>
                  <div className="author-name">Priya Reddy</div>
                  <div className="author-role">Food Blogger</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-us-section">
        <div className="container">
          <div className="contact-us-header">
            <h2>Contact Us</h2>
            <p className="contact-us-subtitle">
              We'd love to hear from you. Get in touch with us today!
            </p>
          </div>

          <div className="contact-us-wrapper">
            {/* Contact Info Grid */}
            <div className="contact-info-grid">
              <div className="contact-info-card">
                <div className="contact-icon">📍</div>
                <h3>Visit Us</h3>
                <p>
                  Sai Mistrywood Layout
                  <br />
                  Bangalore, India 560001
                </p>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon">📞</div>
                <h3>Call Us</h3>
                <p>
                  <a href="tel:+919876543210">+91 9876543210</a>
                </p>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon">📧</div>
                <h3>Email</h3>
                <p>
                  <a href="mailto:hello@sweetshop.com">hello@sweetshop.com</a>
                </p>
              </div>

              <div className="contact-info-card">
                <div className="contact-icon">🕐</div>
                <h3>Hours</h3>
                <p>
                  Mon - Fri: 10 AM - 8 PM
                  <br />
                  Sat - Sun: 11 AM - 7 PM
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-wrapper">
              <h3 className="form-title">Send us a Message</h3>
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">
                    Message <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your inquiry..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                {error && <div className="form-error">{error}</div>}
                {submitted && (
                  <div className="form-success">
                    ✓ Thank you! We'll get back to you soon.
                  </div>
                )}

                <button type="submit" className="submit-btn">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Our Sweet Creations?</h2>
            <p>Explore our collection and order your favorites today</p>
            <button
              className="btn-primary btn-large"
              onClick={() => navigate("/sweets")}
            >
              Start Shopping
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
