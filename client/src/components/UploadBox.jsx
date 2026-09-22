
import { useRef, useState } from "react";
import { motion } from "framer-motion";

import { createMemory } from "../services/api";

function UploadBox({ onMemoryCreated }) {
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [message, setMessage] = useState("");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn một file hình ảnh.");
      return;
    }

    setImage(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);
  }

  function handleDrop(event) {
    event.preventDefault();

    const file =
      event.dataTransfer.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn một file hình ảnh.");
      return;
    }

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!image) {
      setError("Bạn chưa chọn hình ảnh.");
      return;
    }

    if (!message.trim()) {
      setError("Bạn chưa viết lời nhắn.");
      return;
    }

    try {
      setUploading(true);

      const response = await createMemory({
        image,
        message,
        date
      });

      onMemoryCreated({
        ...response.data,
        imageUrl: `${
          import.meta.env.VITE_API_URL
        }/api/images/${response.data.imageId}`
      });

      setImage(null);
      setPreview(null);
      setMessage("");

      setDate(
        new Date()
          .toISOString()
          .split("T")[0]
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setError(
        error.message ||
        "Không thể lưu kỷ niệm."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <section
      id="upload"
      className="upload-section"
    >
      <div className="section-heading">
        <p className="section-label">
          SAVE A MEMORY
        </p>

        <h2>
          Lưu lại một
          <br />
          khoảnh khắc.
        </h2>

        <p>
          Chọn một bức ảnh và viết lại
          điều bạn muốn giữ lại.
        </p>
      </div>

      <form
        className="upload-form"
        onSubmit={handleSubmit}
      >
        <div
          className="drop-zone"
          onDragOver={(event) =>
            event.preventDefault()
          }
          onDrop={handleDrop}
          onClick={() =>
            fileInputRef.current?.click()
          }
        >
          {preview ? (
            <motion.img
              src={preview}
              alt="Preview"
              className="upload-preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          ) : (
            <div className="drop-content">
              <span className="drop-icon">
                +
              </span>

              <strong>
                Chọn một bức ảnh
              </strong>

              <span>
                hoặc kéo ảnh vào đây
              </span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            hidden
          />
        </div>

        <div className="form-row">
          <label>
            Ngày
            <input
              type="date"
              value={date}
              onChange={(event) =>
                setDate(event.target.value)
              }
            />
          </label>
        </div>

        <label className="message-field">
          Lời nhắn

          <textarea
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Viết điều bạn muốn lưu lại..."
            maxLength={5000}
            rows={7}
          />
        </label>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <button
          className="submit-button"
          type="submit"
          disabled={uploading}
        >
          {uploading
            ? "Đang lưu..."
            : "Lưu kỷ niệm"}
        </button>
      </form>
    </section>
  );
}

export default UploadBox;

