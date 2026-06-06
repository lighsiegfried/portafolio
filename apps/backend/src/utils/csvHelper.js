function toCSV(data, fields) {
  if (!data || data.length === 0) {
    const header = fields.map((f) => escapeField(f)).join(',');
    return header + '\n';
  }

  const header = fields.map((f) => escapeField(f)).join(',');
  const rows = data.map((row) => {
    return fields.map((f) => escapeField(String(row[f] ?? ''))).join(',');
  });

  return [header, ...rows].join('\n') + '\n';
}

function escapeField(value) {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

module.exports = { toCSV, escapeField };
