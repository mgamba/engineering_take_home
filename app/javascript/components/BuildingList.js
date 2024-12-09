import React from 'react';
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getBuildings, addBuilding, updateBuilding, deleteBuilding, getBuildingMetadata } from "../api/buildingsApi"
import { useState, useEffect } from "react"
import BuildingForm from "./BuildingForm"
import { useSearchParams } from 'react-router-dom'
import BuildingCard from "./BuildingCard"

const BuildingList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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

  const buildingPage = () => {
    const page = searchParams.get('page');
    return page || 1
  }

  const {
    isLoading,
    isError,
    error,
    data: buildings
  } = useQuery(['buildings', buildingPage()], getBuildings)
  const handleNextPageClick = () => {
    setSearchParams({ page: Number(buildingPage()) + 1 })
  }
  const handlePrevPageClick = () => {
    setSearchParams({ page: buildingPage() - 1 || 1 })
  }

  const queryClient = useQueryClient()

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

  let content
  if (isLoading) {
    content = <p>Loading...</p>
  } else if (isError) {
    content = <p>{error.message}</p>
  } else {
    content = buildings.buildings.map((building) => {
      return (
        <BuildingCard key={building.id} building={building} />
      )
    });
  }

  return (
    <main>
      <h2>Building List</h2>
      <button onClick={handlePrevPageClick}>Prev Page</button>
      <button onClick={handleNextPageClick}>Next Page</button>
      {content}
    </main>
  );
};

export default BuildingList;
