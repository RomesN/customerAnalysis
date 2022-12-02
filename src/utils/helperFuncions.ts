import { getAllPostals, getCountPostalEqual, getFilteredPostals } from "../api/customersApi";
import { Customer, FilterCategory, PostalCount } from "../shared/types";

export const getCategories = async (appliedFilter: string | null) => {
    // filtered
    if (appliedFilter === "empty") {
        return [];
    }

    // no filter applied = give categories for all data
    if (!appliedFilter) {
        const data = await getAllPostals();
        if (Array.isArray(data)) {
            return await calculatePostalCategoriesForGivenFilter(data, "");
        } else {
            return [];
        }
    }

    const withoutOthers = appliedFilter.replaceAll("others", "");

    // filter applied and the user want an exact category = filter postals with given filter and calculate categories
    if (appliedFilter.length === withoutOthers.length) {
        const filteredData = await getFilteredPostals(appliedFilter);
        if (Array.isArray(filteredData)) {
            return await calculatePostalCategoriesForGivenFilter(filteredData, appliedFilter);
        } else {
            return [];
        }
        // filter applied and the user wants "others" category = filter out combinations which were not in other on previous levels and calculate categories from the rest
    } else {
        const numberOfOthers = (appliedFilter.length - withoutOthers.length) / "others".length;
        let data = withoutOthers.length > 0 ? await getFilteredPostals(withoutOthers) : await getAllPostals();
        if (!Array.isArray(data)) {
            data = [];
        }
        let categories = await calculatePostalCategoriesForGivenFilter(data, withoutOthers);
        for (let i = 0; i < numberOfOthers; i++) {
            for (let category of categories) {
                if (category[0] !== "others") {
                    data = data.filter((customer) => {
                        if (category[0] === "empty") {
                            return customer.psc.length > 0;
                        } else {
                            return !RegExp(`^${category[0]}`).test(customer.psc.toLocaleUpperCase());
                        }
                    });
                }
            }
            console.table(categories);
            if (categories[categories.length - 1][1] === 4) {
                console.table(data);
            }
            categories = await calculatePostalCategoriesForGivenFilter(data, withoutOthers);
        }
        return categories;
    }
};

export const calculatePostalCategoriesForGivenFilter = async (data: Customer[], appliedNonOtherFilter: string) => {
    const count = {} as PostalCount;

    // all combinations counted
    data.forEach((customer) => {
        if (customer.psc.length === 0) {
            count["empty"] = (count["empty"] || 0) + 1;
        }
        for (let i = appliedNonOtherFilter.length; i < customer.psc.length; i++) {
            const combination = customer.psc.toUpperCase().slice(0, i + 1);
            count[combination] = (count[combination] || 0) + 1;
        }
    });

    // removing superior category if it has only one subcategory
    for (const combination of Object.entries(count)) {
        let subcategories = [];
        for (const otherCombination of Object.entries(count)) {
            if (
                combination[0].length + 1 === otherCombination[0].length &&
                RegExp(`^${combination[0]}`, "g").test(otherCombination[0])
            ) {
                subcategories.push(otherCombination);
                if (subcategories.length > 1) break;
            }
        }
        if (subcategories.length === 1 && subcategories[0][1] === combination[1]) delete count[combination[0]];
    }

    // removing subcategories if there is superior one for it
    for (const combination of Object.keys(count)) {
        let found = false;
        for (const otherCombination of Object.keys(count)) {
            found = combination.length !== otherCombination.length && RegExp(`^${otherCombination}`).test(combination);
            if (found) break;
        }
        if (found) delete count[combination];
    }

    // adding combination for case that there is combination with no additional characters
    if (appliedNonOtherFilter.length > 0) {
        const rowCountCombinationOnly = (await getCountPostalEqual(appliedNonOtherFilter)) || "0";
        if (rowCountCombinationOnly !== "0" && !Number.isNaN(parseInt(rowCountCombinationOnly))) {
            count[`${appliedNonOtherFilter}only`] = parseInt(rowCountCombinationOnly);
        }
    }

    const sortedCombinations = Object.entries(count).sort((pairOne, pairTwo) => pairTwo[1] - pairOne[1]);

    let coefficientOfVariation = 0;
    if (sortedCombinations.length <= 10) {
        coefficientOfVariation = calculateCoefficientOfVariation(
            sortedCombinations.slice(0, sortedCombinations.length)
        );
    }

    // reclassing categories into "others" category until there is less than 10 categories and variation is not above tolerated level
    while (
        sortedCombinations.length > 10 ||
        (sortedCombinations.length > 2 &&
            coefficientOfVariation > parseFloat(process.env.REACT_APP_TOLERATED_VARIATION_COEFFICIENT || "0.5"))
    ) {
        sortedCombinations.splice(sortedCombinations.length - 2, 2, [
            "others",
            sortedCombinations[sortedCombinations.length - 1][1] + sortedCombinations[sortedCombinations.length - 2][1],
        ]);
        if (sortedCombinations.length <= 10) {
            coefficientOfVariation = calculateCoefficientOfVariation(
                sortedCombinations.slice(0, sortedCombinations.length)
            );
        }
    }

    return sortedCombinations as FilterCategory[];
};

const calculateMean = (array: FilterCategory[]) => {
    if (!array.length) {
        return 0;
    }
    const sum = array.reduce((accumulator, current) => accumulator + current[1], 0);
    return sum / array.length;
};

const standardDeviation = (array: FilterCategory[]) => {
    if (!array.length) {
        return 0;
    }
    const mean = calculateMean(array);
    let variance = 0;
    array.forEach((num) => {
        variance += (num[1] - mean) * (num[1] - mean);
    });
    return Math.sqrt(variance / array.length);
};

const calculateCoefficientOfVariation = (array: FilterCategory[]) => {
    if (!array.length) {
        return 0;
    }
    return standardDeviation(array) / calculateMean(array);
};
