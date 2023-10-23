const download = (filename, text) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/pdf;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

export default download;
