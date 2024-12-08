import React from 'react';
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getBuildings, addBuilding, updateBuilding, deleteBuilding, getBuildingMetadata } from "../api/buildingsApi"
import { useState, useEffect } from "react"
import BuildingForm from "./BuildingForm"

const BuildingList = () => {
  const [buildingMetadata, setBuildingMetadata] = useState({})

  useEffect(() => {
    let ignore = false;

    async function startFetching() {
      const data = await getBuildingMetadata();
      if (!ignore) {
        setBuildingMetadata(data);
      }
    }
    startFetching();

    return () => {
      ignore = true;
    };
  }, []);

  const [buildingPage, setBuildingPage] = useState(1)
  const {
    isLoading,
    isError,
    error,
    data: buildings
  } = useQuery(['buildings', buildingPage], getBuildings)
  const handleNextPageClick = () => {
    setBuildingPage(buildingPage + 1)
  }
  const handlePrevPageClick = () => {
    setBuildingPage(buildingPage - 1 || 1)
  }

  const queryClient = useQueryClient()
  const addBuildingMutation = useMutation(addBuilding, {
    onSuccess: () => {
      //invalidate cache and trigger refetch
      queryClient.invalidateQueries("buildings")
    }
  })

  const updateBuildingMutation = useMutation(updateBuilding, {
    onSuccess: () => {
      //invalidate cache and trigger refetch
      queryClient.invalidateQueries("buildings")
    }
  })

  const deleteBuildingMutation = useMutation(deleteBuilding, {
    onSuccess: () => {
      //invalidate cache and trigger refetch
      queryClient.invalidateQueries("buildings")
    }
  })

  const handleNewBuildingSubmit = (newBuilding) => {
    console.log("handleNewBuildingSubmit");
    addBuildingMutation.mutate({ ...newBuilding })
  }

  let content
  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isError) {
    content = <p>{error.message}</p>
  } else {
    content = buildings.buildings.map((building) => {
      return (
        <article key={building.id}>
          <div className="building">
            <div>
              <strong>building {building.id} </strong>
              <div>
                latitude: {building.latitude}
              </div>
              <div>
                longitude : {building.longitude}
              </div>
            </div>
          </div>
          <button onClick={() => deleteBuildingMutation.mutate({ id: building.id })}>
            Delete building
          </button>
        </article>
      )
    });
  }

  return (
    <main>
      <h2>Building Form</h2>
      <BuildingForm
        onSubmit={handleNewBuildingSubmit}
        buildingMetadata={buildingMetadata}
        initialValue={{}}
      />
      <h2>Building List</h2>
      <button onClick={handlePrevPageClick}>Prev Page</button>
      <button onClick={handleNextPageClick}>Next Page</button>
      {content}
    </main>
  );
};

export default BuildingList;
