import React from 'react';
import { useState, useEffect } from "react"
import { addBuilding, getBuildingMetadata } from "../api/buildingsApi";
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from "react-query";
import BuildingForm from "./BuildingForm"
import { getSessions, currentClientId } from "../api/sessionsApi"

const NewBuilding = () => {
  const { data: sessions } = useQuery(['sessions'], getSessions)
  const navigate = useNavigate();

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

  const {
    isLoading,
    isError,
    error,
    data: building
  } = useQuery(['building'], () => {{}})

  const queryClient = useQueryClient()
  const addBuildingMutation = useMutation(addBuilding, {
    onSuccess: (response) => {
      //invalidate cache and trigger refetch
      queryClient.invalidateQueries("building")
      navigate(`/buildings/${response.data.id}`);
    }
  })
  const handleNewBuildingSubmit = (newBuilding) => {
    addBuildingMutation.mutate({ ...newBuilding })
  }

  return (
    <>
      {(sessions)
        ? ((currentClientId(sessions))
            ? <><h2>Create a New Building</h2>
              <BuildingForm
                onSubmit={handleNewBuildingSubmit}
                buildingMetadata={buildingMetadata}
                initialValue={{}}
              /></>
            : <>
                sign in to create a building
              </>
          )
        : <>
            loading...
          </>
      }
    </>
  );
}

export default NewBuilding
