import {get_validated_URIs} from "../utils/urlsUtils";

const BASE_URL = 'http://127.0.0.1:8000/api';


export const apiClient = {
    async get<T>(endpoint: string): Promise<T>{
        // Garante que o endpoint comece com / e termine com /
        const finalEndpoint = get_validated_URIs(endpoint);
        const response = await fetch(`${BASE_URL}${finalEndpoint}`);

        if (!response.ok) {
            throw await this.handleError(response);
        }

        return response.json();
    },


    async post<T>(endpoint: string, data: any): Promise<T>{
        // Garante que o endpoint comece com / e termine com /
        const finalEndpoint = get_validated_URIs(endpoint);
        const response = await fetch(`${BASE_URL}${finalEndpoint}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw await this.handleError(response);
        }

        return response.json();
    },


    async handleError(response: Response) {
        const errorData =
            await response.json().catch(() => ({}));
        // O Django REST retorna erros de validação como um objeto de arrays
        return {
            status: response.status,
            message: errorData.detail || "Erro na operação de chamada",
            errors: errorData
        };
    }

} // apiClient