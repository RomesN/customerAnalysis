import React, { useContext, useState } from "react";
import { Customer, FilterCategory, Props } from "../shared/types";
import useQueryParam from "./useQueryParam";

type CustomerAnalysisContextType = {
    getData: () => Customer[] | null;
    getPage: () => string | null;
    getAppliedFilter: () => string | null;
    getFilterCategories: () => null | FilterCategory[];
    getIsFilterLoading: () => boolean;
    getIsDataLoading: () => boolean;
    setAppliedFilterState: (selectedCategoryString: string) => void;
    setFilterCategoriesState: (filterCategories: null | FilterCategory[]) => void;
    setDataState: (receivedData: any) => void;
    setIsFilterLoadingState: (isLoadingState: boolean) => void;
    setIsDataLoadingState: (isLoadingState: boolean) => void;
    setPageState: (newPage: string) => void;
};

export const CustomerAnalysisContext = React.createContext({} as CustomerAnalysisContextType);

export function useCustomerAnalysisContext() {
    return useContext(CustomerAnalysisContext);
}

export const CustomerAnalysisContextProvider = ({ children }: Props) => {
    const [data, setData] = useState<Customer[] | null>(null);
    const [appliedFilter, setAppliedFilter] = useQueryParam("postalStartsWith");
    const [filterCategories, setFilterCategories] = useState<null | FilterCategory[]>(null);
    const [isFilterLoading, setIsFilterLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [page, setPage] = useQueryParam("page");

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

    function getIsFilterLoading() {
        return isFilterLoading;
    }

    function getIsDataLoading() {
        return isDataLoading;
    }

    function setDataState(receivedData: any) {
        setData(receivedData);
    }

    function setPageState(newPage: string) {
        setPage(newPage);
    }

    function setAppliedFilterState(selectedCategoryString: string) {
        setAppliedFilter(selectedCategoryString);
    }

    function setFilterCategoriesState(filterCategories: null | FilterCategory[]) {
        setFilterCategories(filterCategories);
    }

    function setIsFilterLoadingState(isLadingState: boolean) {
        setIsFilterLoading(isLadingState);
    }

    function setIsDataLoadingState(isLadingState: boolean) {
        setIsDataLoading(isLadingState);
    }

    return (
        <CustomerAnalysisContext.Provider
            value={{
                getData,
                getPage,
                getAppliedFilter,
                getFilterCategories,
                getIsFilterLoading,
                getIsDataLoading,
                setAppliedFilterState,
                setFilterCategoriesState,
                setPageState,
                setDataState,
                setIsFilterLoadingState,
                setIsDataLoadingState,
            }}
        >
            {children}
        </CustomerAnalysisContext.Provider>
    );
};
