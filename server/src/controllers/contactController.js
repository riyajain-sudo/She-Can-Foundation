import mongoose from "mongoose";
import { Contact } from "../models/contactModel.js";

function validateContact(body) {
const errors = {};

const name = body.name?.trim() || "";
const email = body.email?.trim() || "";
const message = body.message?.trim() || "";

if (!name) {
errors.name = "Name is required.";
} else if (name.length < 3) {
errors.name = "Name must be at least 3 characters.";
}

if (!email) {
errors.email = "Email is required.";
} else if (!/^\S+@\S+.\S+$/.test(email)) {
errors.email = "Enter a valid email address.";
}

if (!message) {
errors.message = "Message is required.";
} else if (message.length < 10) {
errors.message = "Message should be at least 10 characters.";
}

return {
errors,
values: {
name,
email,
message,
},
};
}

export async function submitContact(req, res) {
  const { errors, values } = validateContact(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed.",
      errors,
    });
  }

  console.log("\n===== NEW FORM SUBMISSION =====");
  console.log("Name:", values.name);
  console.log("Email:", values.email);
  console.log("Message:", values.message);
  console.log("===============================\n");

  try {
    if (mongoose.connection.readyState === 1) {
      const savedContact = await Contact.create(values);

      return res.status(201).json({
        success: true,
        message: "Form Submitted Successfully",
        contact: savedContact,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Form Submitted Successfully",
      contact: {
        ...values,
        stored: false,
      },
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit form right now.",
    });
  }
}

  export async function getContacts(req, res) {
  try {

  ```
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json({
      success: true,
      contacts: [],
      database: "disconnected",
    });
  }

  const contacts = await Contact.find()
    .sort({ createdAt: -1 })
    .limit(50);

  return res.status(200).json({
    success: true,
    contacts,
  });
  ```

  } catch (error) {

  ```
  return res.status(500).json({
    success: false,
    message: "Unable to fetch contacts.",
    error: error.message,
  });
  ```

  }
  }
