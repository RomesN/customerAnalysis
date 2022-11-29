import React, { useContext, useState } from "react";
import { Customer, FilterCategory, Props } from "../shared/types";
import useQueryParam from "./useQueryParam";

type CustomerAnalysisContextType = {
    getData: () => Customer | null;
    getPage: () => number;
    getAppliedFilter: () => string | null;
    getFilterCategories: () => null | FilterCategory[];
    getIsLoading: () => boolean;
    setAppliedFilterState: (selectedCategoryString: string) => void;
    setFilterCategoriesState: (filterCategories: null | FilterCategory[]) => void;
    setDataState: (receivedData: any) => void;
    setIsLoadingState: (isLoadingState: boolean) => void;
    setPageState: (newPage: number) => void;
};

export const CustomerAnalysisContext = React.createContext({} as CustomerAnalysisContextType);

export function useCustomerAnalysisContext() {
    return useContext(CustomerAnalysisContext);
}

export const CustomerAnalysisContextProvider = ({ children }: Props) => {
    const [data, setData] = useState<Customer | null>(null);
    const [appliedFilter, setAppliedFilter] = useQueryParam();
    const [filterCategories, setFilterCategories] = useState<null | FilterCategory[]>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    function getData() {
        return data;
    }

    function getPage() {
        return page;
    }

    function getAppliedFilter() {
        return appliedFilter;
    }

    function getFilterCategories() {
        return filterCategories;
    }

    function getIsLoading() {
        return isLoading;
    }

    function setDataState(receivedData: any) {
        setData(receivedData);
    }

    function setPageState(newPage: number) {
        setPage(newPage);
    }

    function setAppliedFilterState(selectedCategoryString: string) {
        setAppliedFilter(selectedCategoryString);
    }

    function setFilterCategoriesState(filterCategories: null | FilterCategory[]) {
        setFilterCategories(filterCategories);
    }

    function setIsLoadingState(isLadingState: boolean) {
        setIsLoading(isLadingState);
    }

    return (
        <CustomerAnalysisContext.Provider
            value={{
                getData,
                getPage,
                getAppliedFilter,
                getFilterCategories,
                getIsLoading,
                setAppliedFilterState,
                setFilterCategoriesState,
                setPageState,
                setDataState,
                setIsLoadingState,
            }}
        >
            {children}
        </CustomerAnalysisContext.Provider>
    );
};
