import type { AxiosInstance } from 'axios'
import axios from 'axios'

const instance: AxiosInstance = axios.create({
  timeout: 60000,
})

export default instance
