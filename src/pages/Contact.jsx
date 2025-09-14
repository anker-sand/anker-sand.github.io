import { useState } from "react";
import { motion } from "framer-motion";
import "./Contact.css";

const EMAIL = "anker2000@hotmail.com"; // change this

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    const subject = encodeURIComponent("Portfolio Inquiry");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <motion.section
      className="contact-page"
      initial={{ opacity: 0, y: 28 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.45, ease: "easeOut" },
      }}
    >
      <div className="contact-inner">
        <h1 className="contact-title">Let’s Talk!</h1>
        <p className="contact-lead">
          Are you looking for a curious and creative intern to join your team?{" "}
          <br />
          I’d love to hear from you — whether it’s about a project, a
          collaboration, or just a quick hello.
        </p>
        <p className="contact-lead">
          You can reach me directly by email:{" "}
          <a className="contact-mail-link" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>{" "}
          or use the form below.
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={update}
              required
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label htmlFor="email">Your Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={update}
              required
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={6}
              value={form.message}
              onChange={update}
              required
            />
          </div>

          <div className="actions">
            <button
              type="submit"
              disabled={!form.name || !form.email || !form.message}
            >
              Send Email
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  );
}
