import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import Filter from "./components/Filter";

function App() {
    return (
        <Routes>
            <Route
                path="/customers"
                element={
                    <ErrorBoundary>
                        <Filter></Filter>
                    </ErrorBoundary>
                }
            />
        </Routes>
    );
}

export default App;
