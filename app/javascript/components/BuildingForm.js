import React from 'react'
import { useState } from 'react'
import { getSessions, currentClientId } from "../api/sessionsApi"
import { useQuery } from "react-query";

const format = (object, metadata) => {
  metadata.map((fieldMeta) => {
    if (fieldMeta.type === "Number") {
      object[fieldMeta.name] = Number(object[fieldMeta.name])
    }
  })
  return(object)
};

const BuildingForm = ({
  onSubmit,
  buildingMetadata,
  initialValue
}) => {
  const { data: sessions } = useQuery(['sessions'], getSessions)
  const [building, setBuilding] = useState({ ...initialValue })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(format(building, buildingMetadata.metadata))
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
              value={Number(building[fieldMeta.name]||0)}
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

  const formButton = ((clientId ) => {
    if (!clientId) return null;

    if (!building.id) {
      return <button>Create</button>;
    }

    if (clientId === building.client_id) {
      return <button>Update</button>;
    }

    return null;
  })(currentClientId(sessions || []));

  return (
    <div>
      {(buildingMetadata.metadata && sessions)
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
              {formButton}
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
