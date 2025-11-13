interface Types {
  [key: string]: string | number | null | undefined;
}

export const validateFields = <T extends object>(
  allFields: boolean,
  fields: T,
  fieldsToValidate: (keyof T)[] = [],
  optionalFields: (keyof T)[] = [],
): boolean => {
  // Decide which keys to validate
  const keysToValidate = allFields
    ? (Object.keys(fields) as (keyof T)[])
    : fieldsToValidate.length > 0
      ? fieldsToValidate
      : [];

  if (keysToValidate.length === 0) return true;

  // for (const key of keysToValidate) {
  //   // Skip optional fields
  //   if (optionalFields.includes(key)) continue;

  //   const value = fields[key];

  //   // Type-based validation
  //   switch (typeof value) {
  //     case 'string':
  //       if (!value || value.trim() === '') return false;
  //       break;

  //     case 'number':
  //       if (isNaN(value)) return false;
  //       break;

  //     case 'boolean':
  //       // always valid
  //       break;

  //     case 'undefined':
  //       return false;

  //     default:
  //       if (value === null) return false;
  //       break;
  //   }
  // }

  for (const key of keysToValidate) {
    if (optionalFields.includes(key)) continue;
    const value = fields[key];

    if (value === null || value === undefined) {
      console.log(`❌ Missing field: ${String(key)} =`, value);
      return false;
    }

    switch (typeof value) {
      case 'string':
        if (!value.trim()) {
          console.log(`❌ Empty string at: ${String(key)}`);
          return false;
        }
        break;
      case 'number':
        if (isNaN(value)) {
          console.log(`❌ Invalid number at: ${String(key)}`);
          return false;
        }
        break;
    }
  }

  return true;
};

// OUTPUTS

// console.log(validateFields(true, project, [], ["description"])); // ✅ true
// console.log(validateFields(true, project)); // ❌ false
// console.log(validateFields(false, project, ["name", "budget"])); // ✅ true
