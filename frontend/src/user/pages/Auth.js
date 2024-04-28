import React,{useContext, useState} from 'react'
import "./Auth.css"
import Card from '../../shared/components/UIElements/Card'
import "../../shared/components/UIElements/Card.css"
import { VALIDATOR_EMAIL,VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/components/utils/Validators'
import Input from '../../shared/components/FormElements/Input'
import { useForm } from '../../shared/hooks/form-hook'
import Button from '../../shared/components/FormElements/Button'
import { AuthContext } from '../../shared/context/auth-context'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import ImageUpload from '../../shared/components/FormElements/ImageUpload'


export const Auth = () => {
    const auth = useContext(AuthContext);
    const [login, setlogin] = useState(true)
    const [isLoading, setisLoading] = useState(false)
    const [error, seterror] = useState(false)
    const [formState,inputHandler,setFormData]=useForm({
        email:{
            value:'',
            isValid : false
        },
        password:{
            value:'',
            isValid:false
        }
    },false)
    // const authSubmitHandler = (e) =>{
    //     e.preventDefault()
    //     console.log(formState.inputs)
    //     auth.logging();
    // }

    // now connecting to backend
    const authSubmitHandler = async (e) =>{
        e.preventDefault()
        if(login)
        {
            try{
                setisLoading(true)
                seterror(null)
                const res=await fetch('http://localhost:5000/api/users/login', { 
                    method : 'POST',
                    headers : {
                        'Content-type': 'application/json'
                    },
                    body :JSON.stringify({
                        email : formState.inputs.email.value,
                        password : formState.inputs.password.value
                    })
                })
                const responseData=await res.json()
                if(!res.ok)
                {
                    throw Error(responseData.message)
                }
                // console.log(responseData.user.id)
                setisLoading(false)
                // console.log("responseData => "+responseData.user._id)
                auth.logging(responseData.user.id);
            }
            catch(err)
            {
                setisLoading(false)
                seterror(err.message || 'Something went wrong. Please try later')
            }
        }
        else{
            try
            {
                setisLoading(true)
                seterror(null)
            //     const res = await fetch('http://localhost:5000/api/users/signup', { 
            //     method : 'POST',
            //     headers : {
            //         'Content-type': 'application/json'
            //     },
            //     body :JSON.stringify({
            //         name : formState.inputs.name.value,
            //         email : formState.inputs.email.value,
            //         password : formState.inputs.password.value
            //     })
            // })

            const formData = new FormData() //using to to upload pictues
            formData.append('name',formState.inputs.name.value)
            formData.append('email',formState.inputs.email.value)
            formData.append('password',formState.inputs.password.value)
            formData.append('image',formState.inputs.image.value) //we have used 'image' in fileUpload.single('image') in users-route.js
            const res = await fetch('http://localhost:5000/api/users/signup', { 
                method : 'POST',
                body : formData
            })

            const responsedata = await res.json()
            if(!res.ok)
            {
                throw new Error(responsedata.message)
            }
            console.log(responsedata)
            setisLoading(false)
            auth.logging(responsedata.user.id);
            }
            catch(err)
            {
                console.log(err)
                setisLoading(false)
                seterror(err.message || 'Something went wrong. Please try later')
            }
        }
    }
    const errorHandler=()=>{
        seterror(null)
    }
    const switchModeHandler = ()=>{
        if(!login)
        {
            setFormData({
                ...formState.inputs,
                name:undefined,
                image:undefined
            },formState.inputs.email.isValid && formState.inputs.password.isValid)
        }
        else{
            setFormData({
                ...formState.inputs,
                name:{
                    value:'',
                    isValid:false
                },
                image:{
                    value:null,
                    isValid:false
                }
            },false)
        }
        setlogin(prev => !prev)
    }
  return (
    <>
    <ErrorModal error={error} onClear={errorHandler}/>
    <Card className="authentication">
    {isLoading && <LoadingSpinner asOverlay /> }
    {/* {error && <h5 style={{color : "red"}}>{error} </h5>} */}
        <h2>Login Required!!!</h2>
        <hr />
        <form action="" onSubmit={authSubmitHandler}>
            {!login && <Input
                element="input"
                id="name"
                type="text"
                label="Name"
                validators={[VALIDATOR_REQUIRE]}
                errorText="Please enter a name"
                onInput={inputHandler}
            />}

            {!login && <ImageUpload center onInput={inputHandler} id="image" errorText="Please provide an image" /> }

            <Input element="input" id="email" type="email" label="E-Mail" 
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter valid email."
            onInput={inputHandler}
            />
            <Input element="input" id="password" type="password" label="Password" 
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText="Please enter valid password(atleast 8 characters)."
            onInput={inputHandler}
            />
            <Button type="submit" disabled={!formState.isValid}>{login?"LOGIN":"SIGNUP"}</Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
            {login?"SWITCH TO SIGNUP":"SWITCH TO LOGIN"}
        </Button>
    </Card>
    </>
  )
}
