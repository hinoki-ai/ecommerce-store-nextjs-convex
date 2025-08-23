/**
 * API client configuration
 * Centralized API utilities for making HTTP requests
 */

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    // Use relative URLs if no base URL is provided (for same-origin requests)
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || '';
  }

  async get<T = any>(url: string, options?: { params?: Record<string, any> }): Promise<ApiResponse<T>> {
    try {
      const params = new URLSearchParams(options?.params || {});
      const fullUrl = this.baseURL ? `${this.baseURL}${url}${params.toString() ? `?${params.toString()}` : ''}` : `${url}${params.toString() ? `?${params.toString()}` : ''}`;

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      return {
        data,
        status: response.status,
        message: data.message,
      };
    } catch (error) {
      console.error('API GET request failed:', error);
      throw error;
    }
  }

  async post<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const fullUrl = this.baseURL ? `${this.baseURL}${url}` : url;
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      const responseData = await response.json();

      return {
        data: responseData,
        status: response.status,
        message: responseData.message,
      };
    } catch (error) {
      console.error('API POST request failed:', error);
      throw error;
    }
  }

  async put<T = any>(url: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const fullUrl = this.baseURL ? `${this.baseURL}${url}` : url;
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      const responseData = await response.json();

      return {
        data: responseData,
        status: response.status,
        message: responseData.message,
      };
    } catch (error) {
      console.error('API PUT request failed:', error);
      throw error;
    }
  }

  async delete<T = any>(url: string): Promise<ApiResponse<T>> {
    try {
      const fullUrl = this.baseURL ? `${this.baseURL}${url}` : url;
      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const responseData = await response.json();

      return {
        data: responseData,
        status: response.status,
        message: responseData.message,
      };
    } catch (error) {
      console.error('API DELETE request failed:', error);
      throw error;
    }
  }
}

export const api = new ApiClient();