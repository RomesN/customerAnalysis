import { useEffect } from "react";
import FilterCategory from "./FilterCategory";
import { FilterCategory as FilterCategoryType } from "../shared/types";
import { getZipCodesRowCountStartingWith } from "../utils/helperFuncions";
import Loading from "./Loading";
import { useCustomerAnalysisContext } from "../hooks/CustomerAnalysisContext";

const Filter = () => {
    const { getAppliedFilter, getFilterCategories, getIsLoading, setIsLoadingState, setFilterCategoriesState } =
        useCustomerAnalysisContext();
    const currentFilterApplied = getAppliedFilter();
    const calculatedCategories = getFilterCategories();

    const calculatePostalCodesCategories = async (currentFilter: string) => {
        const categories = [] as FilterCategoryType[];
        if (currentFilter.length > 6) {
            setFilterCategoriesState(null);
            setIsLoadingState(false);
            return;
        }
        for (let i = 1; i < 11; i++) {
            let count;
            let categoryName;

            if (i === 10) {
                categoryName = currentFilter.length !== 0 ? currentFilter + " " : "others";
                count =
                    currentFilter.length !== 0
                        ? await getZipCodesRowCountStartingWith(" ")
                        : await getZipCodesRowCountStartingWith(null);
            } else {
                categoryName = `${currentFilter}${i}`;
                count = await getZipCodesRowCountStartingWith(categoryName);
            }

            if (typeof count === "string" && !Number.isNaN(parseInt(count)) && parseInt(count) !== 0) {
                while (categoryName.length < 6) {
                    categoryName = categoryName.concat("x");
                }
                categories.push({
                    name: categoryName,
                    records: parseInt(count),
                });
            }
        }
        setFilterCategoriesState(categories);
        setIsLoadingState(false);
    };

    useEffect(() => {
        console.log(calculatedCategories);
        setIsLoadingState(true);
        calculatePostalCodesCategories(currentFilterApplied || "");
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
