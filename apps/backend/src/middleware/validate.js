const { ValidationError } = require('../utils/errors');

const VALIDATORS = {
  string: (v) => typeof v === 'string',
  number: (v) => typeof v === 'number' && !Number.isNaN(v),
  boolean: (v) => typeof v === 'boolean',
  array: (v) => Array.isArray(v),
  object: (v) => v !== null && typeof v === 'object' && !Array.isArray(v),
};

function validate(schema, data) {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const isNested = field.includes('.*.');

    if (isNested) {
      const [parent, , child] = field.split('.*.');
      const parentValue = getNestedValue(data, parent);

      if (Array.isArray(parentValue)) {
        parentValue.forEach((item, index) => {
          const childValue = item ? item[child] : undefined;
          const fieldErrors = validateField(`${parent}[${index}].${child}`, childValue, rules);
          errors.push(...fieldErrors);
        });
      }
      continue;
    }

    const value = getNestedValue(data, field);
    const fieldErrors = validateField(field, value, rules);
    errors.push(...fieldErrors);
  }

  return errors;
}

function validateField(field, value, rules) {
  const errors = [];

  if (rules.required && (value === undefined || value === null || value === '')) {
    errors.push({ field, message: `El campo '${field}' es obligatorio` });
    return errors;
  }

  if (value === undefined || value === null) {
    return errors;
  }

  if (rules.type && VALIDATORS[rules.type]) {
    if (!VALIDATORS[rules.type](value)) {
      errors.push({ field, message: `El campo '${field}' debe ser de tipo ${rules.type}` });
      return errors;
    }
  }

  if (rules.type === 'string' && typeof value === 'string') {
    if (rules.minLength != null && value.length < rules.minLength) {
      errors.push({ field, message: `El campo '${field}' debe tener al menos ${rules.minLength} caracteres` });
    }
    if (rules.maxLength != null && value.length > rules.maxLength) {
      errors.push({ field, message: `El campo '${field}' no debe exceder ${rules.maxLength} caracteres` });
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push({ field, message: `El campo '${field}' no tiene un formato válido` });
    }
  }

  if (rules.type === 'number' && typeof value === 'number') {
    if (rules.min != null && value < rules.min) {
      errors.push({ field, message: `El campo '${field}' debe ser mayor o igual a ${rules.min}` });
    }
    if (rules.max != null && value > rules.max) {
      errors.push({ field, message: `El campo '${field}' debe ser menor o igual a ${rules.max}` });
    }
  }

  if (rules.type === 'array' && Array.isArray(value)) {
    if (rules.minLength != null && value.length < rules.minLength) {
      errors.push({ field, message: `El campo '${field}' debe tener al menos ${rules.minLength} elemento(s)` });
    }
    if (rules.maxLength != null && value.length > rules.maxLength) {
      errors.push({ field, message: `El campo '${field}' no debe exceder ${rules.maxLength} elementos` });
    }
  }

  if (rules.enum && !rules.enum.includes(value)) {
    errors.push({ field, message: `El campo '${field}' debe ser uno de: ${rules.enum.join(', ')}` });
  }

  return errors;
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current != null ? current[key] : undefined;
  }, obj);
}

function middleware(schema) {
  return (event) => {
    let body = {};

    if (event.body) {
      try {
        body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      } catch (e) {
        throw new ValidationError('El body debe ser JSON válido');
      }
    }

    const errors = validate(schema, body);

    if (errors.length > 0) {
      throw new ValidationError('Error de validación');
    }

    event.validatedBody = body;
  };
}

module.exports = { middleware, validate, VALIDATORS };
