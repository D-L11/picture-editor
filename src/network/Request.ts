import axios, { Axios } from 'axios'

export const get = async (host: string, params?: object) => {
    try {
        const result = await axios.get(host, {
            headers: {
                'Content-Type': 'application/text'
            }
        })
        return result
    } catch (e: unknown) {
        console.error(e)
    }
}

export const post = async (host: string, params?: object) => {
    try {
        const result = await axios.post(host, params)
        return result
    } catch (e: unknown) {
        console.error(e)
    }
}