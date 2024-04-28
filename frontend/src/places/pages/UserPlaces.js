import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../../shared/context/auth-context'

import { PlaceList } from '../components/PlaceList'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'

export const UserPlaces = () => {
 
  const auth = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(false)
  const [loadedPlace, setloadedPlace] = useState([])
  const [error, seterror] = useState(null)
  const userId=useParams().userId
  useEffect(() => {
    
    return async() => {
      try{
        setisLoading(true)
        const res = await fetch('http://localhost:5000/api/places/user/'+userId)
  
        const responseData = await res.json()
  
        if(!res.ok)
        {
          throw new Error(responseData.message)
        }
        
        setloadedPlace(responseData.places) //because we have set places as key in backend while sending request
  
        setisLoading(false)
     }
     catch(err)
     {
        setisLoading(false)
        seterror(err.message || 'Couldnot get Places of the user!!!')
     }
    }
  }, [userId])
  const placeDeletedHandler = (deletedPlace) => {
    setloadedPlace(prevPlaces => prevPlaces.filter(place => place.id!==deletedPlace.id))
  }
  const errorHandler = ()=>{
    seterror(null)
  }
  return (
    <>
    {error && <ErrorModal onClear={errorHandler}/>}
    {isLoading && <LoadingSpinner asOverlay/>}
    <PlaceList items={loadedPlace} onDeletePlace={placeDeletedHandler} />
    </>
  )
}
