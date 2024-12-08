import React from 'react';
import { useState, useEffect } from "react"
import { updateBuilding, deleteBuilding, getBuildingMetadata, getBuilding } from "../api/buildingsApi";
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from "react-query";
import Map from "./Map"

const Building = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  console.log("useParams:", useParams());
  const {id: buildingId} = useParams();
  console.log("BUILDING ID:", buildingId);

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
  } = useQuery(['building', buildingId], getBuilding)

  const queryClient = useQueryClient()
  const updateBuildingMutation = useMutation(updateBuilding, {
    onSuccess: () => {
      //invalidate cache and trigger refetch
      queryClient.invalidateQueries("building")
    }
  })
  const deleteBuildingMutation = useMutation(deleteBuilding, {
    onSuccess: () => {
      //invalidate cache and trigger refetch
      queryClient.invalidateQueries("building")
    }
  })

  console.log(building);
  return (
    <div>
      {(building === undefined)
        ? <>
            loading...
          </>
        : <article>
            <div className="building building-preview">
              <div className="left">
                <strong>building {building.id} </strong>
                <div>
                  latitude: {building.latitude}
                </div>
                <div>
                  longitude : {building.longitude}
                </div>
                <button onClick={() => deleteBuildingMutation.mutate({ id: building.id })}>Delete</button>
              </div>
              <div className="right">
                <Map latitude={building.latitude} longitude={building.longitude} />
              </div>
            </div>
          </article>
      }
    </div>
  )
}

export default Building
