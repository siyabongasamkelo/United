import { Routes, Route } from "react-router-dom";
import Register from "./features/auth/pages/Register";

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Register />} />
    </Routes>
  );
}

export default App;
