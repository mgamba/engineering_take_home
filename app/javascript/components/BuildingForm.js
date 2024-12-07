import React from 'react'
import { useState } from 'react'

const BuildingForm = ({
  onSubmit,
  buildingMetadata,
  initialValue
}) => {
  const [newBuilding, setNewBuilding] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(newBuilding)
    setNewBuilding({})
  }

  const handleInputChange = (e) => {
    setNewBuilding({ ...newBuilding, [e.target.name]: e.target.value })
  }

  // TODO handle text/list
  const renderInputField = (fieldMeta) => {
    switch (fieldMeta.type) {
      case 'Freeform':
        break;
      case 'Number':
        break;
      case 'Enum':
        // also add options
        break;
      default:
        {};
    }
    return (
      <label key={fieldMeta.name} htmlFor={fieldMeta.name}>{fieldMeta.name}
        <input
          id={fieldMeta.name}
          type="text"
          value={initialValue[fieldMeta.name]}
          name={fieldMeta.name}
          onChange={handleInputChange}
          placeholder="enter a value"
          defaultValue=""
        />
      </label>
    )
  }

  return (
    <div>
      {buildingMetadata.metadata 
        ? <div className="building-form">
            <form onSubmit={handleSubmit}>
              <fieldset>
                <legend>New Building</legend>
                {
                  buildingMetadata.metadata.map((fieldMeta) => {
                    return renderInputField(fieldMeta)
                  })
                }
              </fieldset>
              <button>Submit</button>
            </form>
          </div>
        : <>
            loading...
          </>
      }
    </div>
  )
}

export default BuildingForm
