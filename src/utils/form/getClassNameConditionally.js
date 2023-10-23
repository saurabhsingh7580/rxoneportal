const getClassNameConditionally = (initialClassName, additionalClassName) =>
  `${initialClassName} ${
    additionalClassName ? additionalClassName : ""
  }`.trim();

export default getClassNameConditionally;
