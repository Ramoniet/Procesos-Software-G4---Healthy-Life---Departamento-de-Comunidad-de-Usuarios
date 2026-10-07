import { Header } from './shared/components/Header.tsx';
import { Footer } from './shared/components/Footer.tsx';
import { CommunityList } from './components/CommunityList.tsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <CommunityList/>
      <Footer/>
    </div>
  )
}

export default App
