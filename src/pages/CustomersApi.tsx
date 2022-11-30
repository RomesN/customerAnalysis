import DataTable from "../components/DataTable";
import ErrorBoundary from "../components/ErrorBoundary";
import Filter from "../components/Filter";
import styles from "../styles/customerApi.module.css";

const CustomerApi = () => {
    return (
        <div className={styles.customerApiContainer}>
            <div className={styles.customerApiFilterContainer}>
                <h4>Filter</h4>
                <ErrorBoundary>
                    <Filter />
                </ErrorBoundary>
            </div>
            <div className={styles.customerApiDataContainer}>
                <ErrorBoundary>
                    <DataTable />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default CustomerApi;
