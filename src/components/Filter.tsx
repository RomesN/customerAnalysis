import { useEffect } from "react";
import { calculatePostalCodesCategories } from "../utils/helperFuncions";
import FilterCategory from "./FilterCategory";
import Loading from "./Loading";
import { useCustomerAnalysisContext } from "../hooks/CustomerAnalysisContext";
import styles from "../styles/filter.module.css";

const Filter = () => {
    const {
        getAppliedFilter,
        getFilterCategories,
        getIsFilterLoading,
        setIsFilterLoadingState,
        setFilterCategoriesState,
    } = useCustomerAnalysisContext();
    const currentFilterApplied = getAppliedFilter();
    const calculatedCategories = getFilterCategories();

    const calculateCategoriesAndSetStates = async (currentFilter: string | null) => {
        const calculatedCategories = calculatePostalCodesCategories(currentFilter);
        setFilterCategoriesState((await calculatedCategories).categories);
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
            {calculatedCategories &&
                calculatedCategories.length > 1 &&
                getFilterCategories()?.map((category) => {
                    return <FilterCategory category={category} key={category.name}></FilterCategory>;
                })}
            {(!calculatedCategories || calculatedCategories.length <= 1) && (
                <p className={styles.noDrillDown}>No further drill down possible.</p>
            )}
        </>
    );
};

export default Filter;
