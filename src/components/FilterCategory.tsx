import { useCustomerAnalysisContext } from "../hooks/CustomerAnalysisContext";
import { FilterCategory as FilterCategoryType } from "../shared/types";

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
        >
            <div>
                <p>psc: {category.name}</p>
            </div>
            <div>
                <p>count: {category.records}</p>
            </div>
        </div>
    );
};

export default FilterCategory;
