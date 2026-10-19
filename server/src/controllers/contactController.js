import mongoose from "mongoose";
import { Contact } from "../models/contactModel.js";

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 1000;

export function validateContact(body) {
  const errors = {};
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { errors: { form: "A JSON object is required." }, values: {} };
  }

  const fields = ["name", "email", "message"];
  for (const field of fields) {
    if (typeof body[field] !== "string") {
      errors[field] = `${field} must be text.`;
    } else if (body[field].length > ({ name: MAX_NAME_LENGTH, email: MAX_EMAIL_LENGTH, message: MAX_MESSAGE_LENGTH })[field]) {
      errors[field] = `${field} is too long.`;
    }
  }
  if (Object.keys(errors).length) return { errors, values: {} };

  const values = {
    name: body.name.trim(),
    email: body.email.trim(),
    message: body.message.trim(),
  };
  if (values.name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (!values.email) errors.email = "Email is required.";
  else if (!/^\S+@\S+\.\S+$/.test(values.email)) errors.email = "Enter a valid email address.";
  if (values.message.length < 10) errors.message = "Message should be at least 10 characters.";
  return { errors, values };
}

export async function submitContact(req, res) {
  const { errors, values } = validateContact(req.body);
  if (Object.keys(errors).length) {
    return res.status(400).json({ success: false, message: "Validation failed.", errors });
  }

  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        code: "DEMO_ONLY",
        message: "Demo mode: this project is not configured to retain or deliver contact messages.",
      });
    }

    const savedContact = await Contact.create(values);
    return res.status(201).json({
      success: true,
      message: "Your message was saved.",
      receiptId: String(savedContact._id),
    });
  } catch {
    return res.status(500).json({ success: false, message: "Unable to submit form right now." });
  }
}

// Contact-list access is intentionally disabled until real admin authorization exists.
export async function getContacts(_req, res) {
  return res.status(403).json({ success: false, message: "Contact listing is disabled." });
}
