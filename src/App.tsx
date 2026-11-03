import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './app/AppContext.tsx';
import { Header } from './shared/components/Header.tsx';
import { Footer } from './shared/components/Footer.tsx';
import { CommunityList } from './components/CommunityList.tsx';
import { CommunityPage } from './pages/CommunityPage.tsx';
import { ChallengesPage } from './pages/ChallengesPage.tsx';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<CommunityList />} />
            <Route path="/comunidad/:id" element={<CommunityPage />} />
            <Route path="/retos" element={<ChallengesPage />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
