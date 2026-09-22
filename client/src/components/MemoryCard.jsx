
// import { motion } from "framer-motion";

// function formatDate(date) {
//   return new Intl.DateTimeFormat(
//     "vi-VN",
//     {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric"
//     }
//   ).format(new Date(date));
// }

// function MemoryCard({ memory, index }) {
//   return (
//     <motion.article
//       className="memory-card"
//       initial={{
//         opacity: 0,
//         y: 30
//       }}
//       whileInView={{
//         opacity: 1,
//         y: 0
//       }}
//       viewport={{
//         once: true,
//         amount: 0.15
//       }}
//       transition={{
//         duration: 0.7,
//         delay: index * 0.05
//       }}
//     >
//       <div className="memory-date">
//         {formatDate(memory.date)}
//       </div>

//       <div className="memory-image-wrapper">
//         <img
//           src={memory.imageUrl}
//           alt="Memory"
//           loading="lazy"
//           className="memory-image"
//         />
//       </div>

//       <div className="memory-content">
//         <p>
//           {memory.message}
//         </p>
//       </div>
//     </motion.article>
//   );
// }

// export default MemoryCard;


import { motion } from "framer-motion";
import { getImageUrl } from "../services/api";

function formatDate(date) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

function MemoryCard({ memory, index }) {
  return (
    <motion.article
      className="memory-card"
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.7,
        delay: index * 0.05,
      }}
    >
      <div className="memory-date">
        {formatDate(memory.date)}
      </div>

      <div className="memory-image-wrapper">
        <img
          src={getImageUrl(memory.imageId)}
          alt={memory.imageFilename || "Memory"}
          loading="lazy"
          className="memory-image"
          onError={(event) => {
            console.error(
              "Không thể tải hình ảnh:",
              getImageUrl(memory.imageId)
            );
            event.currentTarget.style.display = "none";
          }}
        />
      </div>

      <div className="memory-content">
        <p>
          {memory.message}
        </p>
      </div>
    </motion.article>
  );
}

export default MemoryCard;