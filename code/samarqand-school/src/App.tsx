import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './lib/i18n';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Program from './pages/Program';
import Registration from './pages/Registration';
import Abstracts from './pages/Abstracts';
import Venue from './pages/Venue';
import News from './pages/News';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import Invoice from './pages/Invoice';

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/program" element={<Program />} />
                <Route path="/registration" element={<Registration />} />
                <Route path="/abstracts" element={<Abstracts />} />
                <Route path="/venue" element={<Venue />} />
                <Route path="/news" element={<News />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/developer" element={<DeveloperDashboard />} />
                <Route path="/invoice/:id" element={<Invoice />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;
