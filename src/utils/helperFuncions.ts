import { getPostalCountStartingWithNumber, getPostalCountEmpty } from "../api/customersApi";

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
