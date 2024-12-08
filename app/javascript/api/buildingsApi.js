import axios from "axios"

const buildingsApi = axios.create({
  baseURL: "http://0.0.0.0:3002/"
})

export const getBuildings = async ({ queryKey }) => {
  const [queryType, page] = queryKey;
  const response = await buildingsApi.get(`/buildings?page=${page}`);
  return response.data
}

export const addBuilding = async (building) => {
  return await buildingsApi.post("/buildings", {building: building});
}

export const updateBuilding = async (building) => {
  return await buildingsApi.patch(`/buildings/${building.id}`, building);
}

export const deleteBuilding = async ({ id }) => {
  return await buildingsApi.delete(`/buildings/${id}`, id);
}

export const getBuildingMetadata = async() => {
  const response = await buildingsApi.get("/buildings/metadata");
  return response.data
}

export default buildingsApi;
