import React from 'react'
import { UserList } from '../components/UserList'
import { useState,useEffect } from 'react'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'

const Users = () => {
  const [isLoading, setisLoading] = useState(false)
  const [error, seterror] = useState(null)
  const [loadedUsers, setloadedUsers] = useState()
  const user = useEffect(() => {
   const sendRequest = async() =>{
    try{
      setisLoading(true)
      const res = await fetch('http://localhost:5000/api/users')

      const responseData = await res.json()

      if(!res.ok)
      {
        throw new Error(responseData.message)
      }
      
      setloadedUsers(responseData.users) //because we have set users as key in backend while sending request

      setisLoading(false)
   }
   catch(err)
   {
      setisLoading(false)
      seterror(err.message || 'Couldnot get Users')
   }
    }
   sendRequest()
  }, [])
  
  const errorHandler = () =>{
    seterror(null)

  }
  
  return (
    <>
    <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && <LoadingSpinner asOverlay/>}
      {!isLoading && loadedUsers && <UserList user={ loadedUsers } />}
    </>
  )
}

export default Users