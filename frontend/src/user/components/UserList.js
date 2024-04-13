import React from 'react'
import { UserItem } from './UserItem'
import Card from '../../shared/components/UIElements/Card'
import './user.css'

export const UserList = (props) => {
    if(props.user.length===0)
    {
        return (
            <div className="center">
            <Card><h2> No Users Found.</h2></Card>
            </div>
          )
    }
    else{
        return(
            <ul className='user-list'>
                { props.user.map( u => 
                <UserItem name={u.name}
                    key={u.key}
                    places={u.places.length}
                    id={u.id}
                    image={u.image}
                /> 
                ) }
            </ul>
        )
    }
}
