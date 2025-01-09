import React from 'react';
import AppRouter from './routers/AppRouter';
import './global.css';
import { COLORS } from './components/Colors';

const Layout = ({ children }) => {
  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '100vh', 
      backgroundColor: COLORS.background
    }}>
      {children}
    </div>
  );
};

function App() {
  return <Layout>
    <AppRouter />
  </Layout>;
}

export default App;