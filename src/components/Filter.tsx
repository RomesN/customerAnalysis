import { useEffect } from "react";
import { getCategories } from "../shared/filterService";
import FilterCategory from "./FilterCategory";
import Loading from "./Loading";
import { useCustomerAnalysisContext } from "../hooks/CustomerAnalysisContext";
import styles from "../styles/filter.module.css";

const Filter = () => {
    const {
        getAppliedFilter,
        getFilterCategories,
        getIsFilterLoading,
        setAppliedFilterState,
        setIsFilterLoadingState,
        setFilterCategoriesState,
        setPageState,
    } = useCustomerAnalysisContext();
    const currentFilterApplied = getAppliedFilter();
    const calculatedCategories = getFilterCategories();

    const calculateCategoriesAndSetStates = async (currentFilter: string | null) => {
        const calculatedCategories = await getCategories(currentFilter);
        setPageState(1);
        setFilterCategoriesState(calculatedCategories);
        setIsFilterLoadingState(false);
    };

    useEffect(() => {
        setIsFilterLoadingState(true);
        calculateCategoriesAndSetStates(currentFilterApplied);
    }, [currentFilterApplied]);

    if (getIsFilterLoading()) {
        return <Loading></Loading>;
    }

    return (
        <>
            <button
                disabled={!getAppliedFilter()}
                onClick={() => {
                    setAppliedFilterState(null);
                }}
                className={styles.removeFilterButton}
            >
                Remove filter
            </button>
            {calculatedCategories &&
                calculatedCategories.length > 1 &&
                getFilterCategories()?.map((category) => {
                    return <FilterCategory category={category} key={category[0]}></FilterCategory>;
                })}
            {(!calculatedCategories || calculatedCategories.length <= 1) && (
                <p className={styles.noDrillDown}>No further drill down possible.</p>
            )}
        </>
    );
};

export default Filter;
