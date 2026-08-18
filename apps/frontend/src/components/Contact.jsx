import React, { useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";
import { post } from "../services/api";
import { useLanguage } from "../context/LanguageContext";

const MIN_NAME = 2;
const MAX_NAME = 120;
const MAX_EMAIL = 180;
const MIN_MESSAGE = 10;
const MAX_MESSAGE = 2000;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Fill `{token}` placeholders in a dictionary string.
 *
 * Every message is authored as a complete sentence per language, so numbers are
 * substituted into the resolved template rather than concatenated around
 * fragments — word order differs between ES and EN.
 *
 * @param {string | undefined} template
 * @param {Record<string, string | number>} [values]
 * @returns {string}
 */
const format = (template, values = {}) =>
  Object.entries(values).reduce(
    (text, [token, value]) => text.replace("{" + token + "}", String(value)),
    template || ""
  );

/**
 * Validate the contact form.
 *
 * Pure and module-level: the copy is injected so the function never needs the
 * language hook. Only the messages are localized — the rules (lengths, regex,
 * branching) are language independent and unchanged.
 *
 * @param {{ name: string, email: string, message: string }} values
 * @param {Record<string, string>} [copy] - the `t.contact` namespace.
 * @returns {{ name?: string, email?: string, message?: string }}
 */
function validateForm({ name, email, message }, copy = {}) {
  const errors = {};

  const trimmedName = name.trim();
  if (!trimmedName) {
    errors.name = format(copy.validationNameRequired);
  } else if (trimmedName.length < MIN_NAME) {
    errors.name = format(copy.validationNameMin, { min: MIN_NAME });
  } else if (trimmedName.length > MAX_NAME) {
    errors.name = format(copy.validationNameMax, { max: MAX_NAME });
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    errors.email = format(copy.validationEmailRequired);
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = format(copy.validationEmailInvalid);
  } else if (trimmedEmail.length > MAX_EMAIL) {
    errors.email = format(copy.validationEmailMax, { max: MAX_EMAIL });
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    errors.message = format(copy.validationMessageRequired);
  } else {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < MIN_MESSAGE) {
      errors.message = format(copy.validationMessageMin, { min: MIN_MESSAGE });
    } else if (trimmedMessage.length > MAX_MESSAGE) {
      errors.message = format(copy.validationMessageMax, { max: MAX_MESSAGE });
    }
  }

  return errors;
}

const Contact = () => {
  const { t } = useLanguage();
  const copy = t.contact;

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

    const errors = validateForm(form, copy);

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
        // Backend-supplied detail: rendered verbatim, it is not dictionary copy.
        setServerError(message);
      } else {
        setServerError(copy.errorMessage);
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
      setLimitNotice(format(copy.limitReached, { max: MAX_MESSAGE }));
    } else if (value.length === MAX_MESSAGE) {
      setLimitNotice(format(copy.limitReached, { max: MAX_MESSAGE }));
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

  const trimmedMessageLength = form.message.trim().length;
  const isMessageTooShort =
    trimmedMessageLength > 0 && trimmedMessageLength < MIN_MESSAGE;

  // Only reference nodes that are actually rendered, otherwise screen readers
  // announce a dangling `aria-describedby` target.
  const messageDescribedBy = [
    "contact-message-hint",
    limitNotice ? "contact-message-limit" : null,
    formErrors.message ? "contact-message-error" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className='flex-[0.75] bg-black-100 p-8 rounded-2xl'
      >
        <p className={styles.sectionSubText}>{copy.badge}</p>
        <h3 className={styles.sectionHeadText}>{copy.title}</h3>

        {status === "success" && (
          <div
            role='status'
            className='mt-6 p-4 rounded-lg text-sm border bg-emerald-500/10 border-emerald-600/40 text-emerald-700 dark:bg-emerald-900/40 dark:border-emerald-500 dark:text-emerald-300'
          >
            {copy.successMessage}
          </div>
        )}

        {serverError && (
          <div
            role='alert'
            className='mt-6 p-4 rounded-lg text-sm border bg-red-500/10 border-red-600/40 text-red-700 dark:bg-red-900/40 dark:border-red-500 dark:text-red-300'
          >
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className='mt-12 flex flex-col gap-8'
        >
          <label className='flex flex-col'>
            <span className='text-ink font-medium mb-4'>{copy.nameLabel}</span>
            <input
              type='text'
              name='name'
              value={form.name}
              onChange={handleChange}
              maxLength={MAX_NAME}
              placeholder={copy.namePlaceholder}
              aria-invalid={formErrors.name ? "true" : "false"}
              aria-describedby={formErrors.name ? "contact-name-error" : undefined}
              className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-ink rounded-lg outline-none border border-line/10 font-medium ${
                formErrors.name ? "ring-2 ring-red-500" : ""
              }`}
            />
            {formErrors.name && (
              <span
                id='contact-name-error'
                className='mt-1 text-red-600 dark:text-red-400 text-xs'
              >
                {formErrors.name}
              </span>
            )}
          </label>
          <label className='flex flex-col'>
            <span className='text-ink font-medium mb-4'>{copy.emailLabel}</span>
            <input
              type='email'
              name='email'
              value={form.email}
              onChange={handleChange}
              maxLength={MAX_EMAIL}
              placeholder={copy.emailPlaceholder}
              aria-invalid={formErrors.email ? "true" : "false"}
              aria-describedby={formErrors.email ? "contact-email-error" : undefined}
              className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-ink rounded-lg outline-none border border-line/10 font-medium ${
                formErrors.email ? "ring-2 ring-red-500" : ""
              }`}
            />
            {formErrors.email && (
              <span
                id='contact-email-error'
                className='mt-1 text-red-600 dark:text-red-400 text-xs'
              >
                {formErrors.email}
              </span>
            )}
          </label>
          <label className='flex flex-col'>
            <span className='text-ink font-medium mb-4'>{copy.messageLabel}</span>
            <textarea
              rows={7}
              name='message'
              value={form.message}
              onChange={handleChange}
              maxLength={MAX_MESSAGE}
              placeholder={copy.messagePlaceholder}
              aria-invalid={formErrors.message ? "true" : "false"}
              aria-describedby={messageDescribedBy}
              className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-ink rounded-lg outline-none border border-line/10 font-medium ${
                formErrors.message ? "ring-2 ring-red-500" : ""
              }`}
            />
            <div className='mt-2 flex items-center justify-between text-xs'>
              <span
                id='contact-message-hint'
                className={
                  isMessageTooShort
                    ? "text-red-600 dark:text-red-400"
                    : "text-secondary"
                }
              >
                {isMessageTooShort
                  ? format(copy.charsMissing, {
                      count: MIN_MESSAGE - trimmedMessageLength,
                    })
                  : format(copy.charsRemaining, {
                      count: MAX_MESSAGE - form.message.length,
                    })}
              </span>

              <span
                className={
                  form.message.length >= MAX_MESSAGE
                    ? "text-amber-600 dark:text-amber-300"
                    : "text-secondary"
                }
              >
                {format(copy.charsCounter, {
                  count: form.message.length,
                  max: MAX_MESSAGE,
                })}
              </span>
            </div>

            {limitNotice && (
              <span
                id='contact-message-limit'
                className='mt-1 text-amber-600 dark:text-amber-300 text-xs'
              >
                {limitNotice}
              </span>
            )}

            {formErrors.message && (
              <span
                id='contact-message-error'
                className='mt-1 text-red-600 dark:text-red-400 text-xs'
              >
                {formErrors.message}
              </span>
            )}
          </label>

          <button
            type='submit'
            disabled={loading}
            className={`bg-accent-solid py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? copy.sending : copy.sendButton}
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
