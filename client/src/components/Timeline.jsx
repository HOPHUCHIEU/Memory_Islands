import MemoryCard from "./MemoryCard";

function Timeline({
  memories,
  loading
}) {
  return (
    <section className="timeline-section">
      <div className="section-heading timeline-heading">
        <p className="section-label">
          MEMORIES
        </p>

        <h2>
          Những điều
          <br />
          đã ở lại.
        </h2>
      </div>

      {loading ? (
        <div className="loading">
          Đang tải kỷ niệm...
        </div>
      ) : memories.length === 0 ? (
        <div className="empty-state">
          <p>
            Chưa có kỷ niệm nào.
          </p>

          <span>
            Hãy là người đầu tiên lưu
            lại một khoảnh khắc.
          </span>
        </div>
      ) : (
        <div className="timeline">
          {memories.map(
            (memory, index) => (
              <MemoryCard
                key={memory._id}
                memory={memory}
                index={index}
              />
            )
          )}
        </div>
      )}
    </section>
  );
}

export default Timeline;