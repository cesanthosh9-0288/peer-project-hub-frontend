import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Success from "./pages/Success";
import Fail from "./pages/Fail";
import ProjectFeed from "./pages/ProjectFeed"
import ProjectDetails from "./pages/ProjectDetails";
import AddProject from "./pages/AddProject";
import EditProject from "./pages/EditProject";
import Favorites from "./pages/Favorites";
import UserProfile from "./pages/UserProfile";
import Analytics from "./pages/Analytics";


function AppContent() {
  const location = useLocation();
  
  // Hide navbar on login/success/fail pages
  const hideNavbar = ["/", "/success", "/fail"].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />
        <Route path="/projects" element={<ProjectFeed />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/add" element={<AddProject />} />
        <Route path="/editproject/:id" element={<EditProject />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/user/:userId" element={<UserProfile />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}