import React, { useContext, useState } from 'react'
import Card from "../../shared/components/UIElements/Card"
import Button from "../../shared/components/FormElements/Button"
import "./PlaceItem.css"
import Modal from '../../shared/components/UIElements/Modal'
import { AuthContext } from '../../shared/context/auth-context'
import { useEffect } from 'react'

export const PlaceItem = (props) => {
  const auth = useContext(AuthContext);
  const [showMap, setshowMap] = useState(false)
  const [showConfirm, setshowConfirm] = useState(false)
  const openMap = ()=> setshowMap(true)
  const closeMap = ()=> setshowMap(false)
  const showDeleteWarningHandler = () => {
    setshowConfirm(true);
  }
  const cancelDeleteHandler = () => setshowConfirm(false)
  const confirmDeleteHandler = ()=> {
    console.log("Delteing...")
    setshowConfirm(false)
  }
  
  return (
    <React.Fragment>
      {/* {console.log(props.creatorID,auth.userID)} */}
    <Modal show={showMap} onCancel={closeMap} header={props.address} contentClass="place-item__modal-content" footerClass="place-item__modal-actions" 
    footer={ <Button onClick={closeMap}> CLOSE </Button> 
  } >
    <div className="map-container" style={{padding: "5px"}}>
      {/* <h2>THE MAP!</h2> */}
      <iframe title="map" width="100%" height="100%"

          src={'https://maps.google.com/maps?q=' + props.coordinates.lat.toString() + ',' + props.coordinates.lng.toString() + '&t=&z=15&ie=UTF8&iwloc=&output=embed'}></iframe><script type='text/javascript' src='https://embedmaps.com/google-maps-authorization/script.js?id=5a33be79e53caf0a07dfec499abf84b7b481f165'></script> 
    </div>
    </Modal> 
    <Modal show={showConfirm}
    onCancel={cancelDeleteHandler}
    header="Are you sure?" footerClass="place-item__modal-actions" footer={
      <React.Fragment>
        <Button inverse onClick={cancelDeleteHandler}> Cancel </Button>
        <Button danger onClick={confirmDeleteHandler}> Delete</Button>
      </React.Fragment>
    }>
      <p>Do you want to delete this?</p>
    </Modal>
    <li className="place-item">
        <Card className="place-item__content">
        <div className="place-item__image">
            <img src={props.image} alt={props.title} />
            { console.log(props.image) }
        </div>
        <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3> {props.address} </h3>
            <p> {props.description} </p>
        </div>
        <div className="place-item__actions">
            <Button inverse onClick={openMap}>VIEW ON MAP</Button>
            {auth.isLoggedIn && <Button to={`/places/${props.id}`}>EDIT</Button>}
            {auth.isLoggedIn && <Button danger onClick={showDeleteWarningHandler}>DELETE</Button>}
            
        </div>
        </Card>
    </li>
    </React.Fragment>
  )
}
