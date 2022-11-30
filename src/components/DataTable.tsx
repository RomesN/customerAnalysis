import { useEffect } from "react";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loading from "./Loading";
import { useCustomerAnalysisContext } from "../hooks/CustomerAnalysisContext";
import { getAllData, getFilteredData } from "../api/customersApi";

const DataTable = () => {
    const { getAppliedFilter, getData, getIsDataLoading, getPage, setIsDataLoadingState, setDataState, setPageState } =
        useCustomerAnalysisContext();
    const appliedFilter = getAppliedFilter();
    const currentPage = parseInt(getPage() || "1");
    const totalNumberOfPages = Math.ceil((getData()?.length || 0) / 20);

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

    const showPage = () => {
        return getData()
            ?.slice((currentPage - 1) * 20, (currentPage - 1) * 20 + 20)
            .map((customer) => {
                return (
                    <tr key={customer.id}>
                        <td>{customer.nazev}</td>
                        <td>{`${customer.ulice}`}</td>
                        <td>{customer.psc}</td>
                    </tr>
                );
            });
    };

    const showPages = (pageCount: number) => {
        const result = [];
        let min;
        let max;
        if (pageCount < 7) {
            min = 1;
            max = pageCount;
        } else {
            min = currentPage < 5 ? 1 : Math.max(1, currentPage - 3);
            max = currentPage < 5 ? Math.min(pageCount, 7) : Math.min(pageCount, currentPage + 3);
        }
        if (min === max) {
            return;
        }

        for (let i = min; i <= max; i++) {
            result.push(
                <button
                    onClick={() => {
                        setPageState(i.toString());
                    }}
                    disabled={i === currentPage}
                    key={i}
                >
                    {i}
                </button>
            );
        }

        if (max < totalNumberOfPages) {
            result.push(
                <FontAwesomeIcon
                    onClick={() => {
                        setPageState(Math.min(currentPage + 7, pageCount).toString());
                    }}
                    size="sm"
                    icon={faChevronRight}
                />
            );
        }

        if (min > 1) {
            result.splice(
                0,
                0,
                <FontAwesomeIcon
                    onClick={() => {
                        setPageState(Math.max(currentPage - 7, 1).toString());
                    }}
                    size="sm"
                    icon={faChevronLeft}
                />
            );
        }
        return result;
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
            {Number.isNaN(currentPage) && <p>Not valid page number</p>}
            {!Number.isNaN(currentPage) && currentPage <= totalNumberOfPages && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Postal</th>
                        </tr>
                    </thead>
                    <tbody>{showPage()}</tbody>
                </table>
            )}
            {showPages(totalNumberOfPages)}
        </>
    );
};

export default DataTable;
