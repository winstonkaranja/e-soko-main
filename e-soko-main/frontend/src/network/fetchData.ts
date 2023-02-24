import { UnauthorizedError } from "../errors/http_errors";
export async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    } else {
        const errBody = await response.json()
        const errMessage = errBody.error;

        if (response.status === 401) {
            throw new UnauthorizedError(errMessage);
        } else {
            throw Error (`Request failed with status ${response.status} and error message ${errMessage}`);
        }
    }

}