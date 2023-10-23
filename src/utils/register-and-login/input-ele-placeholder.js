const getPlaceholder = name => {
  const nameWordsArr = name.split("-");
  let placeholder = "";

  for (const nameWord of nameWordsArr) {
    placeholder += nameWord[0].toUpperCase() + nameWord.substring(1) + " ";
  }

  return placeholder.trim();
};

export default getPlaceholder;
