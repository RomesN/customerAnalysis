import { getPostalCountStartingWithNumber, getPostalCountEmpty, getPostalCountAll } from "../api/customersApi";
import { FilterCategory as FilterCategoryType } from "../shared/types";

export const getZipCodesRowCountStartingWith = async (inspected: number | string | null) => {
    if (typeof inspected == "number" && (inspected < 1 || inspected > 9)) {
        return "0";
    }

    if (!inspected) {
        return await getPostalCountEmpty();
    } else {
        return await getPostalCountStartingWithNumber(inspected);
    }
};

export const calculatePostalCodesCategories = async (currentFilter: string | null) => {
    const categories = [] as FilterCategoryType[];
    let sum = 0;
    let othersContainZero = false;

    for (let i = 0; i < 11; i++) {
        let count;
        let categoryName;

        if (i === 10) {
            categoryName = `${currentFilter ? currentFilter : ""}others`;

            const appliedFilterCount = currentFilter
                ? await getZipCodesRowCountStartingWith(currentFilter)
                : await getPostalCountAll();
            const parsedAppliedFilterCount = typeof appliedFilterCount === "string" ? parseInt(appliedFilterCount) : 0;
            count = !Number.isNaN(parsedAppliedFilterCount) ? parsedAppliedFilterCount - sum : 0;

            if (categories.length === 10 && count !== 0) {
                count = count + categories[0].records;
                categories.splice(0, 1);
                othersContainZero = true;
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

    return { categories, othersContainZero };
};
