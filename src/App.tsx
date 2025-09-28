import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import Dashboard from './components/Dashboard';
import { apolloClient } from './lib/apollo';
import './App.css';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <div className="App">
        <Dashboard />
      </div>
    </ApolloProvider>
  );
}

export default App;
