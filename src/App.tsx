import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SupplierList } from './pages/SupplierList';
import { SupplierForm } from './pages/SupplierForm';

function App() {
  return (
    <Router>
      <div className="min-vh-100 bg-light">
        <nav className="navbar navbar-dark bg-primary shadow-sm">
          <div className="container-fluid">
            <span className="navbar-brand mb-0 h1">
              Sistema de Fornecedores
            </span>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/suppliers" replace />} />
            <Route path="/suppliers" element={<SupplierList />} />
            <Route path="/suppliers/new" element={<SupplierForm />} />
            <Route path="*" element={<Navigate to="/suppliers" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;