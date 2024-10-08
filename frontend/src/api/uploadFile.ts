import { callApi } from "@/lib/callApi";
import { HTTP_METHOD } from "@/lib/enums";
import { PresignedUrlData, UploadFileParams } from "@/lib/types";

export async function uploadFile({
  fileName,
  file,
  uploadPath,
  user,
  overwrite = false,
}: UploadFileParams) {
  const body = {
    file: {
      fileName: fileName,
      folderPath: uploadPath,
      overwrite: overwrite,
    },
    user: user,
  };

  const urlResponse = await callApi<PresignedUrlData>(
    "/files",
    HTTP_METHOD.POST,
    body
  );

  if (!urlResponse || !urlResponse.data || !urlResponse.data.url) {
    throw new Error("Failed to retrieve presigned URL");
  }

  const presignedUrl = urlResponse.data.url;

  return fetch(presignedUrl, {
    method: HTTP_METHOD.PUT,
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });
}
