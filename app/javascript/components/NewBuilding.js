import React from 'react'
//import { useOutletContext } from 'react-router-dom';
import { NavLink } from 'react-router-dom'

const NewBuilding = ({ }) => {
      //<h2>Building Form</h2>
      //<BuildingForm
      //  onSubmit={handleNewBuildingSubmit}
      //  buildingMetadata={buildingMetadata}
      //  initialValue={{}}
      ///>

  //const { onSubmit, buildingMetadata } = useOutletContext();

  return (
    <div>
      Hello, I'm a form for a new building :)
      <NavLink to={"/buildings"}>Back to the list</NavLink>
    </div>
  )
}

export default NewBuilding
