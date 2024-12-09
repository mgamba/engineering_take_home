import React from 'react'
import Map from "./Map"
import { useNavigate } from 'react-router-dom'

const BuildingCard = ({building}) => {
  const navigate = useNavigate()

  return (
    <article key={building.id}>
      <div className="building building-preview">
        <div className="left">
          <strong>building {building.id} </strong>
          <div>
            owner: {building.client_name}
          </div>
          <button onClick={() => navigate(`/buildings/${building.id}`)}>Open</button>
        </div>
        <div className="right">
          <Map latitude={building.latitude} longitude={building.longitude} />
        </div>
      </div>
    </article>
  )
}

export default BuildingCard;
