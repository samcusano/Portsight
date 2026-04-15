import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import Compliance from './pages/Compliance';
import Reports from './pages/Reports';
import Assignments from './pages/Assignments';
import DesignLabPage from './__design_lab/DesignLabPage';
import FontPreviewPage from './__design_lab/FontPreviewPage';
import CardPreview from './pages/CardPreview';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <div className="app-shell">
        <Header />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/compliance/:shipmentId" element={<Compliance />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/assignments" element={<Assignments />} />
            <Route path="/__design_lab" element={<DesignLabPage />} />
            <Route path="/__design_lab/fonts" element={<FontPreviewPage />} />
            <Route path="/__card_preview" element={<CardPreview />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
