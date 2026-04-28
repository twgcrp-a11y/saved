/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';
import CandidateScreening from './pages/CandidateScreening';
import Pipeline from './pages/Pipeline';
import Reports from './pages/Reports';
import RecruiterPerformance from './pages/RecruiterPerformance';
import Recruiters from './pages/Recruiters';
import Mapping from './pages/Mapping';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { DataProvider } from '@/src/contexts/DataContext';

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/candidates" element={<Candidates />} />
              <Route path="/candidates/:id/screen" element={<CandidateScreening />} />
              <Route path="/pipeline" element={<Pipeline />} />
              <Route path="/mapping" element={<Mapping />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/performance" element={<RecruiterPerformance />} />
              <Route path="/recruiters" element={<Recruiters />} />
            </Routes>
          </Layout>
          <Toaster />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}
