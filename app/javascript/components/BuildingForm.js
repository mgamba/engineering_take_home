import React from 'react'
import { useState } from 'react'

const BuildingForm = ({
  onSubmit,
  buildingMetadata,
  initialValue
}) => {
  const [building, setBuilding] = useState({ ...initialValue })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(building)
  }

  const handleInputChange = (e) => {
    setBuilding({ ...building, [e.target.name]: e.target.value })
  }

  const renderInputField = (fieldMeta, building) => {
    switch (fieldMeta.type) {
      case 'Number':
        return (
          <label key={fieldMeta.name} htmlFor={fieldMeta.name}>{fieldMeta.name}
            <input
              id={fieldMeta.name}
              type={"number"}
              value={Number(building[fieldMeta.name])}
              name={fieldMeta.name}
              onChange={handleInputChange}
              placeholder={"enter a value"}
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
              value={building[fieldMeta.name] || ""}
              name={fieldMeta.name}
              onChange={handleInputChange}
              placeholder={"select a value"}
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
              type={"text"}
              value={building[fieldMeta.name] || ""}
              name={fieldMeta.name}
              onChange={handleInputChange}
              placeholder={"enter a value"}
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
                <legend>Building</legend>
                {
                  buildingMetadata.metadata.map((fieldMeta) => {
                    return renderInputField(fieldMeta, building)
                  })
                }
              </fieldset>
              <button>Update</button>
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
