import React, { useState } from "react";
import axios from "axios";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [media, setMedia] = useState<File[]>([]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMedia(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("text", text);
    media.forEach((file) => formData.append("media", file)); // same field name as multer expects

    try {
      const res = await axios.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer YOUR_AUTH_TOKEN`, // if needed
        },
      });
      console.log("Post created:", res.data);
    } catch (err) {
      console.error("Error uploading post:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleMediaChange}
      />
      <button type="submit">Post</button>
    </form>
  );
};

export default CreatePost;
