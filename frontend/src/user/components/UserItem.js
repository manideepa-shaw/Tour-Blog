import React from 'react'
import "./user.css"
import { Link } from 'react-router-dom'
import Card from '../../shared/components/UIElements/Card'
import Avatar from '../../shared/components/UIElements/Avatar'

export const UserItem = (props) => {
  return (
    <li>
        <div className="user-item">
            <Card className="users-item__content">
            <Link to={`/${props.id}/places`}>
                <div className="user-item__image">
                    <Avatar image={props.image} alt={props.name} />
                    {/* <img src={props.image} alt={props.name} /> */}
                </div>
                <div className="user-item__info">
                    <h2>{props.name}</h2>
                    <h3>{props.places}{(props.places)===1?" place":" places"}</h3>
                </div>
                </Link>
            </Card>
        </div>
    </li>
  )
}
