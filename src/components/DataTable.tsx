import Loading from "./Loading";
import { useCustomerAnalysisContext } from "../hooks/CustomerAnalysisContext";

const DataTable = () => {
    const { getIsLoading } = useCustomerAnalysisContext();

    if (getIsLoading()) {
        return <Loading></Loading>;
    }

    return <></>;
};

export default DataTable;
