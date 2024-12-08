import React from 'react';
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getBuildings, addBuilding, updateBuilding, deleteBuilding, getBuildingMetadata } from "../api/buildingsApi"
import { useState, useEffect } from "react"
import BuildingForm from "./BuildingForm"
import { useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'

const BuildingList = () => {
  const navigate = useNavigate()
  console.log("here");
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
    console.log("buildingPage() = ", page); 
    return page || 1
  }

  const {
    isLoading,
    isError,
    error,
    data: buildings
  } = useQuery(['buildings', buildingPage()], getBuildings)
  const handleNextPageClick = () => {
    console.log('handleNextPageClick -> setSearchParams');
    setSearchParams({ page: Number(buildingPage()) + 1 })
  }
  const handlePrevPageClick = () => {
    console.log('handlePrevPageClick -> setSearchParams');
    setSearchParams({ page: buildingPage() - 1 || 1 })
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
              <button onClick={() => navigate(`/building-detail/${building.id}`)}>Open</button>
              <button onClick={() => deleteBuildingMutation.mutate({ id: building.id })}>Delete</button>
            </div>
          </div>
        </article>
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
