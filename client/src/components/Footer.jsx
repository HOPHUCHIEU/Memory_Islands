function Footer() {
  return (
    <footer className="footer">
      <div>
        <p className="footer-title">
          MEMORY
        </p>

        <p>
          Những khoảnh khắc
          không bị lãng quên.
        </p>
      </div>

      <span>
        © {new Date().getFullYear()}
      </span>
    </footer>
  )
}

export default Footer