// import React, { useState } from "react";
// import {
// ArrowRight,
// CheckCircle2,
// Mail,
// MessageSquare,
// User,
// } from "lucide-react";

// const API_URL =
// import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// const initialForm = {
// name: "",
// email: "",
// message: "",
// };

// function validateForm(form) {
// const errors = {};

// if (!form.name.trim()) {
// errors.name = "Name is required.";
// }

// if (!form.email.trim()) {
// errors.email = "Email is required.";
// } else if (!/^\S+@\S+.\S+$/.test(form.email)) {
// errors.email = "Enter a valid email address.";
// }

// if (!form.message.trim()) {
// errors.message = "Message is required.";
// } else if (form.message.trim().length < 10) {
// errors.message = "Message should be at least 10 characters.";
// }

// return errors;
// }

// export default function ContactForm() {
// const [form, setForm] = useState(initialForm);
// const [errors, setErrors] = useState({});
// const [status, setStatus] = useState({
// type: "",
// message: "",
// });
// const [isSubmitting, setIsSubmitting] = useState(false);

// function handleChange(event) {
// const { name, value } = event.target;

// ```
// setForm((current) => ({
//   ...current,
//   [name]: value,
// }));

// setErrors((current) => ({
//   ...current,
//   [name]: "",
// }));

// setStatus({
//   type: "",
//   message: "",
// });
// ```

// }

// async function handleSubmit(event) {
// event.preventDefault();

// const validationErrors = validateForm(form);

// if (Object.keys(validationErrors).length > 0) {
//   setErrors(validationErrors);
//   return;
// }

// setIsSubmitting(true);

// try {
//   const response = await fetch(`${API_URL}/contacts`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(form),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       data.message || "Something went wrong."
//     );
//   }

//   setForm(initialForm);

//   setStatus({
//     type: "success",
//     message: "Form Submitted Successfully",
//   });
// } catch (error) {
//   setStatus({
//     type: "error",
//     message:
//       error.message === "Failed to fetch"
//         ? "Backend is not reachable. Please start the server and try again."
//         : error.message,
//   });
// } finally {
//   setIsSubmitting(false);
// }


// }

// return ( <form
//    className="contact-form"
//    onSubmit={handleSubmit}
//    noValidate
//  > <label className="field"> <span> <User size={18} /> Name <span className="required">*</span> </span>

//     <input
//       type="text"
//       name="name"
//       value={form.name}
//       onChange={handleChange}
//       placeholder="Enter your full name"
//       aria-invalid={Boolean(errors.name)}
//     />

//     {errors.name && (
//       <small>{errors.name}</small>
//     )}
//   </label>

//   <label className="field">
//     <span>
//       <Mail size={18} /> Email
//       <span className="required">*</span>
//     </span>

//     <input
//       type="email"
//       name="email"
//       value={form.email}
//       onChange={handleChange}
//       placeholder="you@example.com"
//       aria-invalid={Boolean(errors.email)}
//     />

//     {errors.email && (
//       <small>{errors.email}</small>
//     )}
//   </label>

//   <label className="field field-wide">
//     <span>
//       <MessageSquare size={18} /> Message
//       <span className="required">*</span>
//     </span>

//     <textarea
//       name="message"
//       value={form.message}
//       onChange={handleChange}
//       placeholder="Write your message here..."
//       rows={6}
//       aria-invalid={Boolean(errors.message)}
//     />

//     {errors.message && (
//       <small>{errors.message}</small>
//     )}
//   </label>

//   <button
//     className="submit-button"
//     type="submit"
//     disabled={isSubmitting}
//   >
//     {isSubmitting
//       ? "Submitting..."
//       : "Submit Message"}

//     <ArrowRight size={18} />
//   </button>

//   {status.message && (
//     <div
//       className={`status-message ${status.type}`}
//       role="status"
//     >
//       {status.type === "success" && (
//         <CheckCircle2 size={20} />
//       )}

//       <span>{status.message}</span>
//     </div>
//   )}
// </form>


// );
// }
