
import { motion } from "framer-motion";

function Hero() {
  function scrollToUpload() {
    document
      .getElementById("upload")
      ?.scrollIntoView({
        behavior: "smooth"
      });
  }

  return (
    <section className="hero">
      <div className="hero-overlay" />

      <motion.div
        className="hero-content"
        initial={{
          opacity: 0,
          y: 30
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 1
        }}
      >
        <p className="hero-label">
          MEMORY / JOURNAL
        </p>

        <h1>
          Những điều
          <br />
          muốn lưu lại.
        </h1>

        <p className="hero-description">
          Một nơi để những khoảnh khắc,
          những bức ảnh và những điều
          chưa từng nói được ở lại.
        </p>

        <button
          className="hero-button"
          onClick={scrollToUpload}
        >
          Lưu một khoảnh khắc
        </button>
      </motion.div>

      <button
        className="hero-scroll"
        onClick={scrollToUpload}
        aria-label="Scroll to upload"
      >
        ↓
      </button>
    </section>
  );
}

export default Hero;

