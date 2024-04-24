import axiosClient from "../utils/axios";

export const search_converse = ({ query }: { query: string }) => {
  return axiosClient
    .get(`/converse/search?q=${query}`)
    .then((res) => res.data.data);
};

// export const sendMessage = ({
//   accessToken,
//   chat,
//   media,
//   type,
//   recipientId,
// }: {
//   accessToken: string;
//   chat?: string;
//   type: MessageType;
//   recipientId: string;
//   media: Record<string, File>[];
// }) => {};

export const messageSender = ({
  recipientId,
  accessToken,
  type,
  chat,
  media,
}: MessageSenderProps) => {
  if (type === "TEXT") {
    return axiosClient.post(
      "/converse/sendMessage",
      {
        recipient_id: recipientId,
        type,
        chat,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } else if (type === "IMAGE") {
    return axiosClient.post(
      "/converse/sendMessage",
      {
        recipient_id: recipientId,
        type,
        ...media,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
  } else {
    return axiosClient.post(
      "/converse/sendMessage",
      {
        recipient_id: recipientId,
        type,
        ...media,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
  }
};

export const getConverseMedia = ({
  converseId,
  recipientId,
  accessToken,
}: GetConverseMediaProps) => {
  return axiosClient.get(`/converse/media`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      converseId,
      recipientId,
    },
  });
};

type MessageType = "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "FILE";

interface MessageSenderProps {
  recipientId: string;
  accessToken: string;
  type: MessageType;
  chat?: string;
  media?: Record<string, File>[];
}

interface GetConverseMediaProps {
  converseId: string;
  recipientId: string;
  accessToken: string;
}
