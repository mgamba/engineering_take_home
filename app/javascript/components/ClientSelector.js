import React from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from "react-query";
import { getSessions, createSession, deleteSession } from "../api/sessionsApi"

const ClientSelector = () => {
  const {
    isLoading,
    isError,
    error,
    data: sessions
  } = useQuery(['sessions'], getSessions)

  const queryClient = useQueryClient()
  const createSessionMutation = useMutation(createSession, {
    onSuccess: (response) => {
      queryClient.invalidateQueries("sessions")
    }
  })
  const deleteSessionMutation = useMutation(deleteSession, {
    onSuccess: () => {
      //invalidate cache and trigger refetch
      queryClient.invalidateQueries("sessions")
    }
  })
  const handleSelectChange = (e) => {
    createSessionMutation.mutate({ clientId: e.target.value })
    onSuccess: () => {
      //invalidate cache and trigger refetch
      queryClient.invalidateQueries("sessions")
    }
  }

  return (
    <div className="client-selector">
      {(sessions === undefined)
      ? <>
          loading session...
        </>
      : <>
          <div>
            Signed in as
          </div>
          <div>
            <select 
              value={(sessions.find((s) => s.signed_in) || {}).id || ''}
              name="session"
              onChange={handleSelectChange}
            >
              <option value="">(not signed in)</option>
              {
                sessions.map((session) => (
                  <option key={session.id} value={session.id}>{session.name}</option>
                ))
              }
            </select>
          </div>
        </>
      }
    </div>
  );
}

export default ClientSelector

