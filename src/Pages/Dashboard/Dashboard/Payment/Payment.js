import React, {useState, useEffect} from 'react';
import {useParams } from 'react-router';

const Payment = () => {
    const {appointmentId} = useParams();
    const [appointment, setAppointment] = useState({});
    useEffect (()=>{
fetch(`http://localhost:5000/appointments/${appointmentId}`)
.then(res => res.json())
.then(data => setAppointment(data));

    },[appointmentId])
    return (
        <div>
                <h3>payments comming soon
                    
                </h3>
                <p>id : {appointmentId}</p>
                <h3>Pay : $ {appointment.price}</h3>
        </div>
    );
};

export default Payment;