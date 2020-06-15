import RequestApi from "./RequestApi";

const prefix = "http://localhost:5000/crane";

class CraneApi extends RequestApi {

    async fetchScore() {
        try {
            const response = await this.makeRequest(prefix, { method: "GET" });
            if (!response.ok)
                throw new Error(`${response.status} : ${response.statusText}`);
            const data = await response.json();
            if (!data.status) 
                throw new Error(data.message);
            return data.result;
        } catch(e) {
            throw e;
        }
    }
}

const craneApi = new CraneApi();
export default craneApi;