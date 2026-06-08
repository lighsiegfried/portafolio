import React, { useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { post } from "../services/api";

const MIN_NAME = 2;
const MAX_NAME = 120;
const MAX_EMAIL = 180;
const MIN_MESSAGE = 10;
const MAX_MESSAGE = 2000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateForm({ name, email, message }) {
  const errors = {};

  const trimmedName = name.trim();
  if (!trimmedName) {
    errors.name = "El nombre es requerido.";
  } else if (trimmedName.length < MIN_NAME) {
    errors.name = `Tu nombre debe tener al menos ${MIN_NAME} caracteres.`;
  } else if (trimmedName.length > MAX_NAME) {
    errors.name = `Tu nombre no puede superar ${MAX_NAME} caracteres.`;
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    errors.email = "El correo electrónico es requerido.";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Ingresa un correo electrónico válido.";
  } else if (trimmedEmail.length > MAX_EMAIL) {
    errors.email = `El correo no puede superar ${MAX_EMAIL} caracteres.`;
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    errors.message = "El mensaje es requerido.";
  } else {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < MIN_MESSAGE) {
      errors.message = `Tu mensaje debe tener al menos ${MIN_MESSAGE} caracteres.`;
    } else if (trimmedMessage.length > MAX_MESSAGE) {
      errors.message = `Tu mensaje no puede superar ${MAX_MESSAGE} caracteres.`;
    }
  }

  return errors;
}

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [serverError, setServerError] = useState(null);
  const [limitNotice, setLimitNotice] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus(null);
    setServerError(null);
    setFormErrors({});

    const errors = validateForm(form);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      await post("/contact", {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });

      setStatus("success");
      setLimitNotice("");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      const code = err?.code || err?.error?.code;
      const message = err?.message || err?.error?.message;

      if (code === "VALIDATION_ERROR" && message) {
        setServerError(message);
      } else {
        setServerError(
          "No pudimos enviar el mensaje en este momento. Intenta nuevamente más tarde."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
  const { name, value } = e.target;

  setStatus(null);
  setServerError(null);

  let nextValue = value;

  if (name === "message") {
    if (value.length > MAX_MESSAGE) {
      nextValue = value.slice(0, MAX_MESSAGE);
      setLimitNotice(`Tu mensaje llegó al límite de ${MAX_MESSAGE} caracteres.`);
    } else if (value.length === MAX_MESSAGE) {
      setLimitNotice(`Tu mensaje llegó al límite de ${MAX_MESSAGE} caracteres.`);
    } else {
      setLimitNotice("");
    }
  }

  setForm((prev) => ({
    ...prev,
    [name]: nextValue,
  }));

  if (formErrors[name]) {
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }
  };

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75] bg-black-100 p-8 rounded-2xl'
      >
        <p className={styles.sectionSubText}>Ponte en contacto</p>
        <h3 className={styles.sectionHeadText}>Contacto</h3>

        {status === "success" && (
          <div className='mt-6 p-4 bg-green-900/50 border border-green-500 rounded-lg text-green-300 text-sm'>
            Gracias, tu mensaje fue recibido correctamente.
          </div>
        )}

        {serverError && (
          <div className='mt-6 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm'>
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className='mt-12 flex flex-col gap-8'
        >
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Tu nombre</span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              maxLength={MAX_NAME}
              placeholder="¿Cuál es tu nombre?"
              className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium ${
                formErrors.name ? "ring-2 ring-red-500" : ""
              }`}
            />
            {formErrors.name && (
              <span className='mt-1 text-red-400 text-xs'>
                {formErrors.name}
              </span>
            )}
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Tu e-mail</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              maxLength={MAX_EMAIL}
              placeholder="¿Cuál es tu correo electrónico?"
              className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium ${
                formErrors.email ? "ring-2 ring-red-500" : ""
              }`}
            />
            {formErrors.email && (
              <span className='mt-1 text-red-400 text-xs'>
                {formErrors.email}
              </span>
            )}
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Tu mensaje</span>
            <textarea
              rows={7}
              name='message'
              value={form.message}
              onChange={handleChange}
              maxLength={MAX_MESSAGE}
              placeholder='¿En qué puedo ayudarte?'
              className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium ${
                formErrors.message ? "ring-2 ring-red-500" : ""
              }`}
            />
            <div className='mt-2 flex items-center justify-between text-xs'>
              <span
                className={
                  form.message.trim().length > 0 &&
                  form.message.trim().length < MIN_MESSAGE
                    ? "text-red-400"
                    : "text-secondary"
                }
              >
                {form.message.trim().length > 0 &&
                form.message.trim().length < MIN_MESSAGE
                  ? `Faltan ${MIN_MESSAGE - form.message.trim().length} caracteres para poder enviar.`
                  : `${MAX_MESSAGE - form.message.length} caracteres restantes.`}
              </span>

              <span
                className={
                  form.message.length >= MAX_MESSAGE
                    ? "text-yellow-300"
                    : "text-secondary"
                }
              >
                {form.message.length} / {MAX_MESSAGE}
              </span>
            </div>

            {limitNotice && (
              <span className='mt-1 text-yellow-300 text-xs'>
                {limitNotice}
              </span>
            )}
            
            {formErrors.message && (
              <span className='mt-1 text-red-400 text-xs'>
                {formErrors.message}
              </span>
            )}
          </label>

          <button
            type='submit'
            disabled={loading}
            className={`bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-auto md:h-[550px] h-[250px] sm:h-[350px]'
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
