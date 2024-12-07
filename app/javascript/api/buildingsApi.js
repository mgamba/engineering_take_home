import axios from "axios"

const buildingsApi = axios.create({
  baseURL: "http://0.0.0.0:3002/"
})

export const getBuildings = async () => {
  const response = await buildingsApi.get("/buildings");
  return response.data
}

export const addBuilding = async (building) => {
  return await buildingsApi.post("/buildings", building);
}

export const updateBuilding = async (building) => {
  return await buildingsApi.patch(`/buildings/${building.id}`, building);
}

export const deleteBuilding = async ({ id }) => {
  return await buildingsApi.delete(`/buildings/${id}`, id);
}

export default buildingsApi;
