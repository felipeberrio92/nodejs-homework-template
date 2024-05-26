const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const router = express.Router();

const { schema, id } = require("../../validation/validation");

router.get("/", async (req, res, next) => {
  try {
    const data = await listContacts();
    res.json({
      data: JSON.parse(data),
    });
  } catch (error) {
    console.error(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (JSON.stringify(contact) === "{}") {
      res.status(404);
      res.json({ message: "Not found." });
      return;
    }
    res.json({ message: "contact exist.", contact });
  } catch (error) {
    console.error(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const { error, value } = schema.validate({ name, email, phone });
    if (error) {
      res.status(400);
      res.json(error.details);
    } else {
      const newContact = await addContact(value);
      res.status(newContact.status);
      res.json(newContact);
    }
  } catch (error) {
    return error;
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { error, value } = id.validate({ id: req.params.contactId });
    console.log(value);
    if (error) {
      console.log(error);
    } else {
      const { message, status } = await removeContact(value);
      res.status(status);
      res.json({ message });
    }
  } catch (error) {
    console.log(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const { error, value } = schema.validate({ name, email, phone });
  if (error) {
    res.status(400);
    res.json(error.details);
  } else {
    const updateDataContact = await updateContact(req.params.contactId, value);
    console.log("updateContact => ", updateDataContact);
    res.json(updateDataContact);
  }
});

module.exports = router;
