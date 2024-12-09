import React from 'react';
import { useState, useEffect } from "react"
import { updateBuilding, deleteBuilding, getBuildingMetadata, getBuilding } from "../api/buildingsApi";
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from "react-query";
import Map from "./Map"
import BuildingForm from "./BuildingForm"
import { getSessions, currentClientId } from "../api/sessionsApi"

const Building = () => {
  const { data: sessions } = useQuery(['sessions'], getSessions)

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {id: buildingId} = useParams();

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
    },
    onError: (error) => {
      const message = error?.response?.data?.message;
      if (message !== undefined) {
        alert(`Error Saving Building: ${message}`);
      }
    },
  })
  const deleteBuildingMutation = useMutation(deleteBuilding, {
    onSuccess: () => {
      //invalidate cache and trigger refetch
      queryClient.invalidateQueries("building")
      navigate(`/buildings`);
    }
  })

  const handleEditBuildingSubmit = (updateBuilding) => {
    updateBuildingMutation.mutate({ ...updateBuilding })
  }

  return (
    <div>
      {(building === undefined)
      ? <>
          loading...
        </>
      : <>
          <article>
            <div className="building building-preview">
              <div className="left">
                <strong>building {building.id} </strong>
                <div>
                  owner: {building.client_name}
                </div>
                {(sessions && currentClientId(sessions) === building.client_id)
                  ? <button className="danger" onClick={() => { if (window.confirm('Are you sure?')) deleteBuildingMutation.mutate({ id: building.id }) } }>Delete</button>
                  : null
                }
              </div>
              <div className="right">
                <Map latitude={building.latitude} longitude={building.longitude} />
              </div>
            </div>
          </article>
          <article>
            <BuildingForm
              onSubmit={handleEditBuildingSubmit}
              buildingMetadata={buildingMetadata}
              initialValue={building}
            />
          </article>
        </>
      }
    </div>
  )
}

export default Building
