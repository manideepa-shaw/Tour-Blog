import React, { useEffect, useRef,useState } from 'react'

import "./ImageUpload.css"
import Button from './Button'

const ImageUpload = (props) => {
    const filePickerRef = useRef();
    const [file, setfile] = useState(null)
    const [previewUrl, setpreviewUrl] = useState()
    const [isValid, setisValid] = useState(false)

    useEffect(() => {
        if(!file)
        {
            return;
        }
        const fileReader = new FileReader()
        //whenever the file will be uploaded this anonymous function will be called
        fileReader.onload=()=>{
            setpreviewUrl(fileReader.result)
        }
        fileReader.readAsDataURL(file)
    }, [file])
    
    const pickImageHandler = () => {
        // console.log(filePickerRef)
        filePickerRef.current.click()
    }

    const pickedHandler = (e) => {
        let pickedFile;
        let fileIsValid=isValid;
        if(e.target.files && e.target.files.length!=0)
        {
            pickedFile = e.target.files[0]
            setfile(pickedFile)
            setisValid(true)
            fileIsValid=true
        }
        else
        {
            setisValid(false)
            fileIsValid=false
        }
        props.onInput(props.id, pickedFile, fileIsValid)
    }

  return (
    <div className='form-control'>
        <input type="file" 
        name="image" 
        id={props.id}
        ref={filePickerRef}
        style={{display:'none'}}
        onChange={pickedHandler}
        accept='.jpg,.jpeg,.png'
        />
        <div className={`image-upload ${props.center && 'center'}`}>
            <div className="image-upload__preview">
                {previewUrl && <img src={previewUrl} alt="Preview" />}
                {!previewUrl && <p>Please select an image.</p> }
            </div>
            <Button type="button" onClick={pickImageHandler} >PICK IMAGE</Button>
        </div>
        {!isValid && <p> {props.errorText} </p> }
    </div>
  )
}

export default ImageUpload