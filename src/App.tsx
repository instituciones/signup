import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client/react';
import Dashboard from './components/Dashboard';
import { NuevosPage } from './components/admin/NuevosPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { apolloClient } from './lib/apollo';
import './App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/nuevos" element={
                <ProtectedRoute>
                  <NuevosPage />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
