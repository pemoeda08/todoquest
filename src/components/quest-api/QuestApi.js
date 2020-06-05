import RequestApi from "./RequestApi";

const prefix = "http://localhost:5000/quest";

class QuestApi extends RequestApi {

    async fetchQuests() {
        try {
            const response = await this.makeRequest(prefix, { method: "GET" });
            if (!response.ok)
                throw new Error(`${response.status} : ${response.statusText}`);
            const data = await response.json();
            if (!data.status)
                throw new Error(data.message);
            return data.result;
        } catch (e) {
            throw e;
        }

    }

    async fetchQuest(id) {
        try {
            const response = await this.makeRequest(`${prefix}/${id}`, { method: "GET" });
            if (!response.ok)
                throw new Error(`${response.status} : ${response.statusText}`);
            const data = await response.json();
            if (!data.status)
                throw new Error(data.message);
            return data.result;
        } catch (e) {
            throw e;
        }
    }

    async fetchParty(id) {
        try {
            const response = await this.makeRequest(`${prefix}/${id}/party`, { method: "GET" });
            if (!response.ok)
                throw new Error(`${response.status} : ${response.statusText}`);
            const data = await response.json();
            if (!data.status)
                throw new Error(data.message);
            return data.result;
        } catch (e) {
            throw e;
        }
    }

    async postNewComment(id, jsonBody) {
        try {
            const response = await this.makeRequest(`${prefix}/${id}/comment`, {
                method: "POST",
                body: jsonBody
            });
            if (!response.ok)
                throw new Error(`${response.status} : ${response.statusText}`);
            const data = await response.json();
            if (!data.status)
                throw new Error(data.message);
            return data.message;
        } catch (e) {
            throw e;
        }
    }

    async joinQuest(body) {
        try {
            const response = await this.makeRequest(`${prefix}/join`, {
                method: "POST",
                body: body
            });

            if (!response.ok)
                throw new Error(`${response.status} : ${response.statusText}`);
            const data = await response.json();
            if (!data.status)
                throw new Error(data.message);
                
            return data.message;
        } catch(e) {
            throw e;
        }
    }

    async postNewQuest(newQuest) {
        try {
            const response = await this.makeRequest(prefix, {
                method: "PUT",
                body: newQuest
            });
            if (!response.ok)
                throw new Error(`${response.status} : ${response.statusText}`);
            const data = await response.json();
            if (!data.status)
                throw new Error(data.message);
            
            return data.message;
        } catch (e) {
            throw e;
        }
    }

    async deleteQuest(id) {
        try {
            const response = await this.makeRequest(`${prefix}/${id}`, { method: "DELETE" });
            if (!response.ok)
                throw new Error(`${response.status} : ${response.statusText}`);
            const data = await response.json();
            if (!data.status)
                throw new Error(data.message);
            return data.message;
        } catch (e) {
            throw e;
        }
    }

    async leaveQuest(id) {
        try {
            const response = await this.makeRequest(`${prefix}/${id}/leave`, { method: "POST"});
            if (!response.ok)
                throw new Error(`${response.status} : ${response.statusText}`);
            const data = await response.json();
            if (!data.status)
                throw new Error(data.message);
            return data.message;
        } catch(e) {
            throw e;
        }
    }

    async fetchQuestComments(questId) {
        try {
            const response = await this.makeRequest(`${prefix}/${questId}/comments`, { method: "GET" });
            if (!response.ok)
                throw new Error(`${response.status} : ${response.statusText}`);
            const data = await response.json();
            if (!data.status)
                throw new Error(data.message);
            return data.result;
        } catch (e) {
            throw e;
        }
    }
}

const questApi = new QuestApi();
export default questApi;