import { useCustomerAnalysisContext } from "../hooks/CustomerAnalysisContext";
import { FilterCategory as FilterCategoryType } from "../shared/types";
import styles from "../styles/filterCategory.module.css";

type FilterCategoryProps = {
    category: FilterCategoryType;
};

const FilterCategory = ({ category }: FilterCategoryProps) => {
    const { setAppliedFilterState } = useCustomerAnalysisContext();
    return (
        <div
            onClick={() => {
                setAppliedFilterState(category.name.replaceAll("x", ""));
            }}
            className={styles.filterCategoryContainer}
        >
            <div className={styles.filterCategoryFilter}>
                <p>PSC: {category.name.includes("others") ? "others" : category.name}</p>
            </div>
            <div className={styles.filterCategoryCount}>
                <p>count: {category.records}</p>
            </div>
        </div>
    );
};

export default FilterCategory;
