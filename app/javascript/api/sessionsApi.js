import axios from "axios"

const sessionsApi = axios.create({
  baseURL: "http://0.0.0.0:3002/"
})

export const getSessions = async ({}) => {
  const response = await sessionsApi.get(`/sessions`);
  return response.data
}

export const getCurrentSession = async ({}) => {
  const response = await sessionsApi.get(`/session`);
  return response.data
}

export const createSession = async ({ clientId }) => {
  return await sessionsApi.post("/sessions", { client_id: clientId });
}

export const deleteSession = async ({}) => {
  return await sessionsApi.post(`/sessions/delete`);
}

export const currentClientId = (sessions) => {
  return (sessions.find((s) => s.signed_in) || {}).id
}

export default sessionsApi;
