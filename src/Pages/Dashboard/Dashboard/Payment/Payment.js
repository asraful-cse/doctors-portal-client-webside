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
		fetch(
			`https://doctors-portal-server-695n.onrender.com/appointments/${appointmentId}`
		)
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
			{appointment?.price && (
				<Elements stripe={stripePromise}>
					<CheckoutForm key={appointment?._id} appointment={appointment} />
				</Elements>
			)}
		</div>
	);
};

export default Payment;
/*
1. Install stripe and stripe-react
2. Set publishable key my stripe account key copy paste
3. Elements 
4. Checkout form
5. Create payment method
6. Server create payment intent api 
7. Load client secret 
8. ConfirmCard payment 
9. Handle user error
*/
