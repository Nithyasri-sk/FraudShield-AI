import { HashRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Dashboard } from "./pages/Dashboard";
import { AnalyzeTransaction } from "./pages/AnalyzeTransaction";
import { DetectionHistory } from "./pages/DetectionHistory";
import { ToastProvider } from "./context/ToastContext";
import { AnalysisHistoryProvider } from "./context/AnalysisHistoryContext";
import { TransactionInsightsPage } from "./pages/TransactionInsightsPage";
import { Model2Upload } from "./pages/Model2Upload";
function App() {
    return (<ToastProvider>
      <AnalysisHistoryProvider>
        <HashRouter>
          <div className="min-h-screen">
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />}/>
              <Route path="/analyze" element={<AnalyzeTransaction />}/>
              <Route path="/history" element={<DetectionHistory />}/>
              <Route path="/insights" element={<TransactionInsightsPage />} />
              <Route path="/model2" element={<Model2Upload />} />
            </Routes>
            <footer className="border-t border-ink-800 py-8 text-center text-xs text-ink-500">
              FraudShield AI · Secure Prediction Engine · Decision-support only
            </footer>
          </div>
        </HashRouter>
      </AnalysisHistoryProvider>
    </ToastProvider>);
}
export default App;
