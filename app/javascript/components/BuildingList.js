import React from 'react';
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getBuildings, addBuilding, updateBuilding, deleteBuilding } from "../api/buildingsApi"
import { useState } from "react"

const BuildingList = () => {
  const [newBuilding, setNewBuilding] = useState('')
  const queryClient = useQueryClient()

  const {
    isLoading,
    isError,
    error,
    data: buildings
  } = useQuery('buildings', getBuildings)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    addBuildingMutation.mutate({ title: newBuilding, completed: false })
    setNewBuilding('')
  }

  const newBuildingSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-building">Building form</label>
      <div className="new-building">
        <input
          type="text"
          id="building[client_id]"
          value=""
          onChange={(e) => setNewBuilding(e.target.value)}
          placeholder="Enter client id"
        />
      </div>
      <button className="submit">
        submit
      </button>
    </form>
  )

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
            <label htmlFor="{building.id}">building {building.id} client id:</label>
            <strong> {building.client_id} </strong>
          </div>
          <button className="trash" onClick={() => deleteBuildingMutation.mutate({ id: building.id })}>
            Delete building
          </button>
        </article>
      )
    });
  }

  return (
    <main>
      <h1>Buildings</h1>
      {newBuildingSection}
      {content}
    </main>
  );
};

export default BuildingList;
