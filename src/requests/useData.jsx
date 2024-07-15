import axios from 'axios'

export const getdata = () => {
    const response = axios.get('http://localhost:3000')
    return response.data
}