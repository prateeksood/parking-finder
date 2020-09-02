import React, { useContext } from 'react'
import AlertBox from '../AlertBox'
import { userContext } from '../../contexts/userContext';

export default ()=>{
  const { user, setUser,alertMsg,setAlertMsg,userLoaded } = useContext(userContext);
    return(
        <div>
            {alertMsg&&<AlertBox heading={alertMsg.heading} lead={alertMsg.lead}/>}
        </div>
    )
}