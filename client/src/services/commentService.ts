import Axios from "axios";

const createComment = async ({ id, text }: { id: string; text: string }) => {
  try {
    let resp = await (await Axios.post(`/api/comments/${id}`, { text })).data;
    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const deleteComment = async ({
  comment_id,
  property_id,
}: {
  property_id: string;
  comment_id: string;
}) => {
  try {
    let resp = (
      await Axios.delete(`/api/comments/${property_id}/${comment_id}`)
    ).data;
    return resp;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { createComment, deleteComment };
