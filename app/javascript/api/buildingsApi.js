import axios from "axios"

const buildingsApi = axios.create({
  baseURL: "http://0.0.0.0:3002/"
})

export const getBuildings = async ({ queryKey }) => {
  const [queryType, page] = queryKey;
  const response = await buildingsApi.get(`/buildings.json?page=${page}`);
  return response.data
}

export const getBuilding = async ({ queryKey }) => {
  const [queryType, buildingId] = queryKey;
  const response = await buildingsApi.get(`/buildings/${buildingId}.json`);
  return response.data
}

export const addBuilding = async (building) => {
  return await buildingsApi.post("/buildings.json", building);
}

export const updateBuilding = async (building) => {
  const { id, ...updateAttrs } = building;
  return await buildingsApi.patch(`/buildings/${building.id}.json`, updateAttrs);
}

export const deleteBuilding = async ({ id }) => {
  return await buildingsApi.delete(`/buildings/${id}.json`, id);
}

export const getBuildingMetadata = async() => {
  const response = await buildingsApi.get("/buildings/metadata.json");
  return response.data
}

export default buildingsApi;
