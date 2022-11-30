import { useEffect } from "react";
import Loading from "./Loading";
import { useCustomerAnalysisContext } from "../hooks/CustomerAnalysisContext";
import { getAllData, getFilteredData } from "../api/customersApi";

const DataTable = () => {
    const { getIsDataLoading, setIsDataLoadingState, getAppliedFilter, getData, setDataState } =
        useCustomerAnalysisContext();
    const appliedFilter = getAppliedFilter();

    const fetchData = async () => {
        let data;
        if (!appliedFilter) {
            data = await getAllData();
        } else {
            data = await getFilteredData(appliedFilter);
        }
        setDataState(data);
        setIsDataLoadingState(false);
    };

    useEffect(() => {
        setIsDataLoadingState(true);
        fetchData();
    }, [appliedFilter]);

    if (getIsDataLoading()) {
        return <Loading></Loading>;
    }

    return (
        <>
            {getData()?.map((customer) => {
                return <p key={customer.id}>{customer.psc}</p>;
            })}
        </>
    );
};

export default DataTable;
