import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useQueryParam() {
    const [searchParams, setSearchParams] = useSearchParams();
    const postalSearchWith = searchParams.get("postalStartsWith");
    const [appliedFilter, setAppliedFilter] = useState<string | null>(postalSearchWith);

    useEffect(() => {
        if (appliedFilter && postalSearchWith !== appliedFilter) {
            setSearchParams({
                postalStartsWith: appliedFilter,
            });
        }
    }, [appliedFilter]);

    useEffect(() => {
        if (postalSearchWith !== appliedFilter) {
            setAppliedFilter(postalSearchWith);
        }
    }, [postalSearchWith]);

    return [appliedFilter, setAppliedFilter] as [typeof appliedFilter, typeof setAppliedFilter];
}
