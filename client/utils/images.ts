export function fileToString(file: File) {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return (reader.onload = () => {
    console.log(reader.result);
    return reader.result?.toString();
  });
}
