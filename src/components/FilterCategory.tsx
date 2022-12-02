import { useCustomerAnalysisContext } from "../hooks/CustomerAnalysisContext";
import { FilterCategory as FilterCategoryType } from "../shared/types";
import { withoutAdditionsName, othersCategoryName, emptyCategoryName } from "../shared/specialCategoryNames";
import styles from "../styles/filterCategory.module.css";

type FilterCategoryProps = {
    category: FilterCategoryType;
};

const FilterCategory = ({ category }: FilterCategoryProps) => {
    const { getAppliedFilter, setAppliedFilterState } = useCustomerAnalysisContext();
    const getAdjustedName = (categoryName: string) => {
        if (["null", "test"].includes(categoryName.toLocaleLowerCase())) {
            return categoryName;
        } else if ([othersCategoryName, emptyCategoryName].includes(categoryName.toLocaleLowerCase())) {
            return categoryName.replaceAll("$", "");
        } else if (categoryName.includes(withoutAdditionsName)) {
            return categoryName.replaceAll(withoutAdditionsName, "") + " with no additions";
        } else {
            while (categoryName.length < 6) {
                categoryName = categoryName.concat("x");
            }
            return categoryName;
        }
    };
    return (
        <div
            onClick={() => {
                setAppliedFilterState(
                    category[0] === othersCategoryName ? (getAppliedFilter() || "") + category[0] : category[0]
                );
            }}
            className={styles.filterCategoryContainer}
        >
            <div className={styles.filterCategoryFilter}>
                <p>Postal: {getAdjustedName(category[0])}</p>
            </div>
            <div className={styles.filterCategoryCount}>
                <p>count: {category[1]}</p>
            </div>
        </div>
    );
};

export default FilterCategory;
