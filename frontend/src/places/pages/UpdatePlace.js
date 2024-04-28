import React,{ useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../../shared/context/auth-context'
import { Auth } from '../../shared/context/auth-context';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/components/utils/Validators';
import { useForm } from '../../shared/hooks/form-hook';
import './NewPlace.css';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';


// const DUMMY_PLACES = [
//   {
//     id: 'p1',
//     title: 'Empire State Building',
//     description: 'One of the most famous sky scrapers in the world!',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
//     address: '20 W 34th St, New York, NY 10001',
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584
//     },
//     creator: 'u1'
//   },
//   {
//     id: 'p2',
//     title: 'Empire State Building',
//     description: 'One of the most famous sky scrapers in the world!',
//     imageUrl:
//       'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg',
//     address: '20 W 34th St, New York, NY 10001',
//     location: {
//       lat: 40.7484405,
//       lng: -73.9878584
//     },
//     creator: 'u2'
//   }
// ];

export const UpdatePlace = () => {
  const auth = useContext(AuthContext)
  const [isLoading, setisLoading] = useState(true);
  const placeId = useParams().placeId;
  const [error, seterror] = useState(null)

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      }
    },
    false
  );
  const [loadedPlace, setloadedPlace] = useState(null)
  useEffect(() => {
    
    return async() => {
      try{
        setisLoading(true)
        const res = await fetch('http://localhost:5000/api/places/'+placeId)
  
        const responseData = await res.json()
  
        if(!res.ok)
        {
          throw new Error(responseData.message)
        }
        
        setloadedPlace(responseData.findplace) //because we have set findplace as key in backend while sending request
        setFormData(
          {
            title: {
              value: responseData.loadedPlace.title,
              isValid: true
            },
            description: {
              value: responseData.loadedPlace.description,
              isValid: true
            }
          },
          true
        );
        setisLoading(false)
     }
     catch(err)
     {
        setisLoading(false)
        seterror(err.message || 'Couldnot get Places of the user!!!')
     }
    }
  }, [setFormData, placeId])
  const history = useHistory() //this gives an history object
  const placeUpdateSubmitHandler = async(event) => {
    event.preventDefault();

    try{
      setisLoading(true)
      seterror(null)
      const res=await fetch('http://localhost:5000/api/places/'+placeId, { 
          method : 'PATCH',
          headers : {
              'Content-type': 'application/json'
          },
          body :JSON.stringify({
              title : formState.inputs.title.value,
              description : formState.inputs.description.value
          })
      })
      const responseData=await res.json()
      if(!res.ok)
      {
          throw Error(responseData.message)
      }
      setisLoading(false)
      history.push('/' + auth.userId + '/places')//to redirect to the this page
  }
  catch(err)
  {
      setisLoading(false)
      seterror(err.message || 'Something went wrong. Please try later')
  }

    console.log(formState.inputs);
  };

  if (isLoading) {
    return (
      <LoadingSpinner asOverlay/>
    );
  }
  if (!loadedPlace) {
    return (
      <div className="center">
        <Card><h2>Could not find place!</h2></Card>
        
      </div>
    );
  }


  return (
    <>
    {error && <ErrorModal onClear={()=>{seterror(null)}} />}
    {loadedPlace &&
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={loadedPlace.title}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (min. 5 characters)."
        onInput={inputHandler}
        initialValue={loadedPlace.description}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        UPDATE PLACE
      </Button>
    </form>
    }
    </>
  );
}