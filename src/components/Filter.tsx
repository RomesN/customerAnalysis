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
        let sum = 0;
        for (let i = 0; i < 11; i++) {
            let count;
            let categoryName;

            if (i === 10) {
                categoryName = `${currentFilter}others`;

                const appliedFilterCount = currentFilter
                    ? await getZipCodesRowCountStartingWith(currentFilter)
                    : await getPostalCountAll();
                const parsedAppliedFilterCount =
                    typeof appliedFilterCount === "string" ? parseInt(appliedFilterCount) : 0;
                count = !Number.isNaN(parsedAppliedFilterCount) ? parsedAppliedFilterCount - sum : 0;

                if (categories.length === 10 && count !== 0) {
                    count = count + categories[0].records;
                    categories.splice(0, 1);
                }
            } else {
                categoryName = `${currentFilter ? currentFilter : ""}${i}`;
                const categoryCount = await getZipCodesRowCountStartingWith(categoryName);
                const parsedCategoryCount = typeof categoryCount === "string" ? parseInt(categoryCount) : 0;
                count = !Number.isNaN(parsedCategoryCount) ? parsedCategoryCount : 0;
            }

            if (count !== 0) {
                while (categoryName.length < 5) {
                    categoryName = categoryName.concat("x");
                }
                sum += count;
                categories.push({
                    name: categoryName,
                    records: count,
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
