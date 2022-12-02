import { useEffect } from "react";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllData, getAllEmpty, getAllEqualTo, getPostalDataStartingWith } from "../api/customersApi";
import { onlyWithouAdditions, othersCategoryName, emptyCategoryName } from "../shared/specialCategoryNames";
import Loading from "./Loading";
import { useCustomerAnalysisContext } from "../hooks/CustomerAnalysisContext";
import styles from "../styles/dataTable.module.css";
import { getCategories } from "../shared/filterService";
import { Customer, FilterCategory } from "../shared/types";

const DataTable = () => {
    const { getAppliedFilter, getData, getIsDataLoading, getPage, setIsDataLoadingState, setDataState, setPageState } =
        useCustomerAnalysisContext();
    const appliedFilter = getAppliedFilter();
    const currentPage = getPage() || 1;
    const totalNumberOfPages = Math.ceil((getData()?.length || 0) / 20);

    const fetchData = async () => {
        let fetchResult: Customer[] | string | undefined;
        if (!appliedFilter) {
            fetchResult = await getAllData();
        } else if (appliedFilter === emptyCategoryName) {
            fetchResult = await getAllEmpty();
        } else if (appliedFilter.includes(onlyWithouAdditions)) {
            fetchResult = await getAllEqualTo(appliedFilter.replace(onlyWithouAdditions, ""));
        } else if (!appliedFilter.includes(othersCategoryName)) {
            fetchResult = await getPostalDataStartingWith(appliedFilter);
        } else if (appliedFilter.includes(othersCategoryName)) {
            const withoutOthers = appliedFilter.replaceAll(othersCategoryName, "");
            const numberOfOthers = (appliedFilter.length - withoutOthers.length) / othersCategoryName.length;
            let categories = [] as FilterCategory[];

            if (withoutOthers.length > 0) {
                fetchResult = await getPostalDataStartingWith(withoutOthers);
            } else {
                fetchResult = await getAllData();
            }

            let i = 0;
            let categoryString = withoutOthers;
            do {
                categories = [
                    ...categories,
                    ...(await getCategories(categoryString.length > 0 ? categoryString : null)),
                ];
                categoryString = categoryString.concat(othersCategoryName);
                i++;
            } while (i < numberOfOthers);

            const categoriesMapped = categories
                .filter((category) => category[0] !== othersCategoryName)
                .map((category) => category[0]);

            if (Array.isArray(fetchResult)) {
                fetchResult = fetchResult.filter((customer) => {
                    if (categoriesMapped.includes(emptyCategoryName) && customer.psc.length === 0) {
                        return false;
                    } else {
                        return !categoriesMapped.some((catString) => customer.psc.startsWith(catString));
                    }
                });
            }
        }

        if (Array.isArray(fetchResult)) {
            setDataState(fetchResult);
            setIsDataLoadingState(false);
        }
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

    const showPagesSelection = (pageCount: number) => {
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
                        setPageState(i);
                    }}
                    disabled={i === currentPage}
                    className={i === currentPage ? styles.currentPage : styles.otherPages}
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
                        setPageState(Math.min(currentPage + 7, pageCount));
                    }}
                    size="sm"
                    key="right"
                    icon={faChevronRight}
                    className={styles.chevron}
                />
            );
        }

        if (min > 1) {
            result.splice(
                0,
                0,
                <FontAwesomeIcon
                    onClick={() => {
                        setPageState(Math.max(currentPage - 7, 1));
                    }}
                    size="sm"
                    key="left"
                    icon={faChevronLeft}
                    className={styles.chevron}
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
            <table className={styles.dataTable}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Postal</th>
                    </tr>
                </thead>
                <tbody>{showPage()}</tbody>
            </table>
            <div className={styles.pageContainer}>{showPagesSelection(totalNumberOfPages)}</div>
        </>
    );
};

export default DataTable;
