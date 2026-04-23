import axios, { AxiosInstance } from 'axios'

class ApiService {
  private instance: AxiosInstance

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  setAuthToken(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  clearAuthToken() {
    delete this.instance.defaults.headers.common['Authorization']
  }

  get(url: string, config = {}) {
    return this.instance.get(url, config)
  }

  post(url: string, data = {}, config = {}) {
    return this.instance.post(url, data, config)
  }

  put(url: string, data = {}, config = {}) {
    return this.instance.put(url, data, config)
  }

  delete(url: string, config = {}) {
    return this.instance.delete(url, config)
  }

  getAxiosInstance() {
    return this.instance
  }
}

export const apiService = new ApiService()
