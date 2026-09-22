
import { useEffect, useState } from "react";

import Hero from "./components/Hero";
import UploadBox from "./components/UploadBox";
import Timeline from "./components/Timeline";
import Footer from "./components/Footer";

import { getMemories } from "./services/api";

function App() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadMemories() {
    try {
      setLoading(true);

      const response = await getMemories();

      setMemories(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMemories();
  }, []);

  function handleMemoryCreated(memory) {
    setMemories((current) => [
      memory,
      ...current
    ]);
  }

  return (
    <div className="app">
      <Hero />

      <main>
        <UploadBox
          onMemoryCreated={handleMemoryCreated}
        />

        <Timeline
          memories={memories}
          loading={loading}
        />
      </main>

      <Footer />
    </div>
  );
}

export default App;

