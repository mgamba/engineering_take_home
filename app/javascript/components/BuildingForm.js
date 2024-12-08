import React from 'react'
import { useState } from 'react'

const BuildingForm = ({
  onSubmit,
  buildingMetadata,
  initialValue
}) => {
  const [newBuilding, setNewBuilding] = useState({ ...initialValue })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(newBuilding)
  }

  const handleInputChange = (e) => {
    setNewBuilding({ ...newBuilding, [e.target.name]: e.target.value })
  }

  const renderInputField = (fieldMeta) => {
    switch (fieldMeta.type) {
      case 'Number':
        return (
          <label key={fieldMeta.name} htmlFor={fieldMeta.name}>{fieldMeta.name}
            <input
              id={fieldMeta.name}
              type="number"
              value={initialValue[fieldMeta.name]}
              name={fieldMeta.name}
              onChange={handleInputChange}
              placeholder="enter a value"
              defaultValue=""
            />
          </label>
        )
        break;
      case 'Enum':
        return (
          <label key={fieldMeta.name} htmlFor={fieldMeta.name}>
            {fieldMeta.name}
            <select 
              id={fieldMeta.name}
              value={initialValue[fieldMeta.name]}
              name={fieldMeta.name}
              onChange={handleInputChange}
              placeholder="select a value"
              defaultValue=""
            >
              {
                fieldMeta.options.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))
              }
            </select>
          </label>
        )
        break;
      case 'Freeform':
      default:
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
