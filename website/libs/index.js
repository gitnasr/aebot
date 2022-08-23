function isValidURL(string) {
  const res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
  );
  return res !== null;
}
export function isValidSchema(text) {
  if (isValidURL(text)) {
    if (
      text.includes("old.") ||
      text.includes("arabseed") ||
      text.includes("akwam")
    ) {
      return true;
    }
  } else {
    return false;
  }

  return false;
}

export const TextFile = (name) => {
  const element = document.createElement("a");
  const file = new Blob([document.getElementById("links").value], {
    type: "text/plain",
  });
  element.href = URL.createObjectURL(file);
  element.download = name + ".txt";
  document.body.appendChild(element);
  element.click();
};

export const ChooseService = (link) => {
  try {
    const AKOAM_SCHEMA = "akwam";
    const OLD_SCHEMA = "old.akwam";
    const ARAB_SCHEMA = "arabseed";
    if (link.includes(OLD_SCHEMA)) return { service: "OLD_AKOAM" };
    if (link.includes(AKOAM_SCHEMA)) return { service: "NEW_AKOAM" };
    if (link.includes(ARAB_SCHEMA)) return { service: "ARABSEED" };

    return { service: "NOT_DETECTED" };
  } catch (error) {
    return { service: "ERROR, " + error };
  }
};