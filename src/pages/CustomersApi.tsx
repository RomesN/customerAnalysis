import ErrorBoundary from "../components/ErrorBoundary";
import Filter from "../components/Filter";

const CustomerApi = () => {
    return (
        <div>
            <ErrorBoundary>
                <Filter></Filter>
            </ErrorBoundary>
            <ErrorBoundary></ErrorBoundary>
        </div>
    );
};

export default CustomerApi;
