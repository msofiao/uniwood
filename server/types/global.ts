export type FileInfo = {
  filename: string;
  location: string;
  mimetype: string;
  fieldname: string;
  encoding: string;
  extension: string;
};
export type FilesInfo<T extends string> = {
  [key in T]: FileInfo;
};
