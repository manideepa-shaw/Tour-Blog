import React,{ useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/components/utils/Validators.js';
import './NewPlace.css';
import { useForm } from '../../shared/hooks/form-hook.js';
import { AuthContext } from '../../shared/context/auth-context'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner.js';
import ErrorModal from '../../shared/components/UIElements/ErrorModal.js';

const NewPlace = () => {
  const auth = useContext(AuthContext);
  const [isLoading, setisLoading] = useState(false)
  const [error, seterror] = useState(null)
  const [formState,inputHandler]= useForm({
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
  )
  const history = useHistory() //this gives an history object
  const placeSubmitHandler = async(event)=>{
    event.preventDefault(); //to not allow it to reload to another page i.e., SPA 

    try{
      setisLoading(true)
      seterror(null)
      const res=await fetch('http://localhost:5000/api/places', { 
          method : 'POST',
          headers : {
              'Content-type': 'application/json'
          },
          body :JSON.stringify({
            title: formState.inputs.title.value,
            description : formState.inputs.description.value, 
            address: formState.inputs.address.value, 
            creator: auth.userId
          })
      })
      const responseData=await res.json()
      if(!res.ok)
      {
          throw Error(responseData.message)
      }
      // console.log(responseData.user.id)
      setisLoading(false)
      history.push('/')//to redirect to the home page
    }
    catch(err)
    {
      setisLoading(false)
      seterror(err.message || "Couldn't create place")
    } 

    console.log(formState.inputs); //send this to the backend
  }

  const errorHandler=()=>{
    seterror(null)
  }
  return (
    <>
    <ErrorModal error={error} onClear={errorHandler}/>
    {isLoading && <LoadingSpinner asOverlay />}
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
    </>
  );
};

export default NewPlace;
