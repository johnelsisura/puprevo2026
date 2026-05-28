import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Checkout from './pages/Checkout'
import Ticket from './pages/Ticket'
import AdminLogin from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Scanner from './pages/admin/Scanner'
import Contact from './pages/Contact'
import NewsPress from './pages/NewsPress'
import NewsArticle from './pages/NewsArticle'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/ticket/:code" element={<Ticket />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/scanner" element={<Scanner />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/news" element={<NewsPress />} />
        <Route path="/news/:id" element={<NewsArticle />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
