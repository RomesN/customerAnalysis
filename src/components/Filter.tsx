import { useEffect } from "react";
import FilterCategory from "./FilterCategory";
import { FilterCategory as FilterCategoryType } from "../shared/types";
import { getPostalCountAll } from "../api/customersApi";
import { getZipCodesRowCountStartingWith } from "../utils/helperFuncions";
import Loading from "./Loading";
import { useCustomerAnalysisContext } from "../hooks/CustomerAnalysisContext";

const Filter = () => {
    const { getAppliedFilter, getFilterCategories, getIsLoading, setIsLoadingState, setFilterCategoriesState } =
        useCustomerAnalysisContext();
    const currentFilterApplied = getAppliedFilter();
    const calculatedCategories = getFilterCategories();

    const calculatePostalCodesCategories = async (currentFilter: string | null) => {
        const categories = [] as FilterCategoryType[];
        if (currentFilter && currentFilter.length > 6) {
            setFilterCategoriesState(null);
            setIsLoadingState(false);
            return;
        }
        let sum = 0;
        for (let i = 1; i < 11; i++) {
            let count;
            let categoryName;

            if (i === 10) {
                const currentFilterCount = currentFilter
                    ? await getZipCodesRowCountStartingWith(currentFilter)
                    : await getPostalCountAll();
                categoryName = `${currentFilter}others`;
                if (typeof currentFilterCount === "string") {
                    const parsedCount = parseInt(currentFilterCount);
                    count = !Number.isNaN(parsedCount) ? `${parsedCount - sum}` : 0;
                }
            } else {
                categoryName = `${currentFilter ? currentFilter : ""}${i}`;
                count = await getZipCodesRowCountStartingWith(categoryName);
            }

            const parsedCount = typeof count === "string" ? parseInt(count) : 0;

            if (!Number.isNaN(parsedCount) && parsedCount !== 0) {
                while (categoryName.length < 6) {
                    categoryName = categoryName.concat("x");
                }
                sum += parsedCount;
                categories.push({
                    name: categoryName,
                    records: parsedCount,
                });
            }
        }
        setFilterCategoriesState(categories);
        setIsLoadingState(false);
    };

    useEffect(() => {
        setIsLoadingState(true);
        calculatePostalCodesCategories(currentFilterApplied);
    }, [currentFilterApplied]);

    if (getIsLoading()) {
        return <Loading></Loading>;
    }

    return (
        <>
            {calculatedCategories &&
                calculatedCategories.length > 1 &&
                getFilterCategories()?.map((category) => {
                    return <FilterCategory category={category} key={category.name}></FilterCategory>;
                })}
            {(!calculatedCategories || calculatedCategories.length === 1) && <p>No further drill down possible.</p>}
        </>
    );
};

export default Filter;
