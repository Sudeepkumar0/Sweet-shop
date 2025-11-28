import React, { useState } from "react";
import "./styles/about.css";

export default function About() {
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
      `Inquiry from SweetShop website - ${name || "Visitor"}`
    );
    const body = encodeURIComponent(
      `${message}\n\n---\nName: ${name || "(not provided)"}\nEmail: ${email}`
    );

    // attempt to open user's mail client
    window.location.href = `mailto:hello@sweetshop.example?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="logo-hero">🍬</div>
          <h1>SweetShop — Handcrafted Confections</h1>
          <p className="tagline">
            Small-batch sweets made with real ingredients, delivered with care.
          </p>
          <a className="btn-primary" href="/sweets">
            Browse Sweets
          </a>
        </div>
      </section>

      <section className="about-content container">
        <div className="grid-2">
          <div>
            <h2>About The Shop</h2>
            <p>
              SweetShop is a neighbourhood confectionery blending traditional
              recipes with modern flavors. We prepare small-batch sweets using
              high-quality ingredients and seasonal produce where possible. Our
              goal is to deliver memorable treats — whether you're picking up a
              single pastry or placing a wholesale order for events.
            </p>

            <h3>Owner</h3>
            <p>
              <strong>Sudeep</strong> — Founder & Head Pastry Chef. Trained in
              artisanal baking and pastry arts, Sudeep brings over X years of
              experience creating pastries, chocolates and custom desserts for
              events.
            </p>

            <h3>Our Team</h3>
            <p>
              A small, dedicated team of bakers, packers and customer service
              staff focused on quality and care. We hire locally and emphasize
              food-safety training and friendly customer experiences.
            </p>
          </div>

          <aside className="contact-card">
            <h3>Contact & Delivery</h3>
            <p>
              <strong>Address:</strong>
              <br />
              Sai Mistrywood layout
              <br />
              Yalahanka, Bangalore - 560064
            </p>

            <p>
              <strong>Hours:</strong>
              <br />
              Mon–Sat: 9:00 AM – 7:00 PM
              <br />
              Sun: 10:00 AM – 5:00 PM
            </p>

            <p>
              <strong>Phone:</strong>
              <br />
              (555) 123-4567
            </p>

            <p>
              <strong>Email:</strong>
              <br />
              hello@sweetshop.example
            </p>

            <div className="delivery-info">
              <h4>Delivery</h4>
              <p>
                Local delivery available same-day within a 10 km radius.
                National shipping for selected non-perishable items (2–5
                business days). Tracking provided for all online orders.
              </p>
            </div>

            <a className="btn-secondary" href="/contact">
              Contact Us
            </a>
          </aside>
        </div>

        <div className="company-values">
          <h3>Our Commitments</h3>
          <ul>
            <li>Freshness: Baked or prepared daily in small batches.</li>
            <li>
              Transparency: Full ingredient lists and allergy info available for
              each product.
            </li>
            <li>
              Community: We partner with local suppliers and support nearby
              events.
            </li>
          </ul>
        </div>
      </section>

      <section className="testimonials container">
        <h3>What Customers Say</h3>
        <div className="test-grid">
          <blockquote>
            “Exceptional pastries — the honey truffles are my favourite. Fast
            delivery and perfect packaging.”
            <cite>— A. Customer</cite>
          </blockquote>
          <blockquote>
            “Perfect for events. The team helped create a custom box for our
            wedding — guests loved it.”
            <cite>— J. Event Planner</cite>
          </blockquote>
        </div>
      </section>

      <footer className="about-cta">
        <div className="container">
          <h3>Ready to try our sweets?</h3>
          <a className="btn-primary" href="/sweets">
            Shop Now
          </a>
        </div>
        <div className="container about-contact-footer">
          <h4>Contact Us</h4>
          <form className="about-contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                name="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <textarea
                name="message"
                placeholder="Write a short message (order inquiry, question...)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            {error && <div className="form-error">{error}</div>}
            {submitted && (
              <div className="form-success">
                Your email client should open now.
              </div>
            )}
            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Send Message
              </button>
              <small className="contact-note">
                Or email hello@sweetshop.example
              </small>
            </div>
          </form>
        </div>
      </footer>
    </main>
  );
}
