import { Home } from './pages/Home';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Home />
      <footer className="py-6 text-center text-xs text-slate-500 border-t border-slate-800/40">
        <p>StudySpark - AI Study Assistant</p>
      </footer>
    </div>
  );
}

export default App;
