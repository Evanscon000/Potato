import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "../src/pages/LandingPage"
import InvestmentPage from "../src/pages/InvestmentPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/invest" element={<InvestmentPage />} />
            </Routes>
        </BrowserRouter>
    );
}
