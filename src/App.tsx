import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from './components/Layout';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return <Layout />;
}
