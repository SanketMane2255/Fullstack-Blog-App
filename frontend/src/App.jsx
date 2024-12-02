import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Blogs from './pages/Blogs';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CreateBlog from './pages/CreateBlog';
import Profile from './pages/Profile';
import EditBlog from './pages/EditBlog';


function App() {
  return (
    <div>
  
      <AppNavbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path='/createblog' element={<CreateBlog/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/edit-blog/:blogId' element={<EditBlog/>}/>
        
      </Routes>
    </div>
  );
}

export default App;
