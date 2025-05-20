import { ApiError } from "../api";
import { APPOINTMENT_API } from "../urls";

interface PetReportParams {
    from: string;
    to: string;
    token: string;
}

export const getAppointmentReport = async ({ token, from, to }: PetReportParams) => {
    const queryParams = new URLSearchParams({ from, to }).toString();

    const res = await fetch(`${APPOINTMENT_API}/report?${queryParams}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const data = await res.json();
        return data as ApiError;
    }

    return await res.blob(); 
};
