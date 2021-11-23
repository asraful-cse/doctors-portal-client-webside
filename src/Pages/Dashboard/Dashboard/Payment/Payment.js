import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
	"pk_test_51JxbSgBLv06oa1O267mPVkqhFSv7eDXJNanZvH2yGLTSSvyswXcuXXC3Zrzfzy9OuKQX6FoABzYzqAj8Lpo7Mm7X001d20TYpR"
);
const Payment = () => {
	const { appointmentId } = useParams();
	const [appointment, setAppointment] = useState({});
	useEffect(() => {
		fetch(`http://localhost:5000/appointments/${appointmentId}`)
			.then((res) => res.json())
			.then((data) => setAppointment(data));
	}, [appointmentId]);

	return (
		<div>
			<h2>
				Please pay for : {appointment?.patientName} <br /> for :{" "}
				{appointment?.serviceName}
			</h2>
			<h3>Pay : $ {appointment?.price}</h3>
			<Elements stripe={stripePromise}>
				<CheckoutForm key={appointment?._id} appointment={appointment} />
			</Elements>
		</div>
	);
};

export default Payment;
/*
1.install stripe and stripe-react
2. set publishable key my stripe account key copy paste
3. elements 
4. Checkout form
5. Create payment method
*/
