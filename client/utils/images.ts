export function fileToString(file: File) {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return (reader.onload = () => {
    return reader.result?.toString();
  });
}
