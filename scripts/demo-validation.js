export const SAMPLE_REGISTRATION = Object.freeze({ name: 'Sample Visitor', college: 'Sample College', email: 'visitor@example.com', phone: '99999-99999', city: 'Pilani', year: '1st', gender: 'other', head: 'false', mentor: 'false' });
export function validateRegistration(values) {
  const errors = [];
  for (const key of ['name', 'college', 'city']) {
    if (typeof values[key] !== 'string' || !values[key].trim() || values[key].length > 100) errors.push(`Please enter a valid ${key}.`);
  }
  if (typeof values.email !== 'string' || values.email.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.push('Please enter a valid sample email.');
  if (!/^\d{5}-\d{5}$/.test(values.phone || '')) errors.push('Use a sample phone in 99999-99999 format.');
  if (!['1st', '2nd', '3rd', '4th'].includes(values.year)) errors.push('Please choose a year of study.');
  if (!['male', 'female', 'other'].includes(values.gender)) errors.push('Please choose a gender option.');
  for (const key of ['head', 'mentor']) if (!['true', 'false'].includes(values[key])) errors.push(`Please choose a ${key} option.`);
  return errors;
}
