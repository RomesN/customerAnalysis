import { Route, Routes, Navigate } from "react-router-dom";
import "./styles/general/index.css";
import CustomerApi from "./pages/CustomersApi";

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Navigate to="/customers" />} />
                <Route path="/customers" element={<CustomerApi />} />
            </Routes>
        </>
    );
}

export default App;
