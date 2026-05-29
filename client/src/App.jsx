import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const initialForm = {
  name: "",
  email: "",
  message: "",
};

function validateForm(form) {
  const errors = {};

  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.message.trim()) {
    errors.message = "Message is required.";
  } else if (form.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }

  return errors;
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setStatus({ type: "", message: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateForm(form);

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setForm(initialForm);
      setStatus({
        type: "success",
        message: "Form Submitted Successfully",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message === "Failed to fetch"
            ? "Backend is not reachable. Please start the server and try again."
            : error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <div className="brand-mark">
            <span className="brand-icon">
              <HeartHandshake size={28} />
            </span>
            <span>She Can Foundation</span>
          </div>

          <h1>Every message can begin a stronger future.</h1>
          <p>
            Connect with She Can Foundation through this contact
            form
          </p>

          <div className="hero-actions">
            <a href="#contact" className="primary-link">
              Contact Us <ArrowRight size={18} />
            </a>
          </div>
        </div>

        <div className="impact-panel" aria-label="Foundation highlights">
          <div className="panel-topline">
            <Sparkles size={20} />
            <span>For Women</span>
          </div>
          <div className="impact-number">Together We Can Change <span className="highlight-word">THE WORLD</span></div>
          <p>Supporting women through education,
              technology, leadership, and community initiatives.</p>
          <div className="impact-grid">
            {/* <span>Validation</span>
            <span>Responsive</span>
            <span>REST API</span>
            <span>Admin Route</span> */}
          </div>
        </div>
      </section>

      <section className="content-band" id="contact">
        <div className="section-heading">
          <span>Contact Form</span>
          <h2>Send your message</h2>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>
              <User size={18} /> Name
              <span className="required">*</span>
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? <small>{errors.name}</small> : null}
          </label>

          <label className="field">
            <span>
              <Mail size={18} /> Email
              <span className="required">*</span>
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? <small>{errors.email}</small> : null}
          </label>

          <label className="field field-wide">
            <span>
              <MessageSquare size={18} /> Message
              <span className="required">*</span>
            </span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              rows="6"
              aria-invalid={Boolean(errors.message)}
            />
            {errors.message ? <small>{errors.message}</small> : null}
          </label>

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Form"}
            <ArrowRight size={18} />
          </button>

          {status.message ? (
            <div className={`status-message ${status.type}`} role="status">
              {status.type === "success" ? <CheckCircle2 size={20} /> : null}
              <span>{status.message}</span>
            </div>
          ) : null}
        </form>
      </section>
    </main>
  );
}
