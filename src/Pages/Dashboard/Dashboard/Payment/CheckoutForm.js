import { CircularProgress } from "@mui/material";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import useAuth from "../../../../hooks/useAuth";

const CheckoutForm = ({ appointment }) => {
	const { price, patientName, _id } = appointment;

	const stripe = useStripe();
	const elements = useElements();
	const { user } = useAuth();

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [clientSecret, setClientSecret] = useState("");
	const [processing, setProcessing] = useState(false);

	useEffect(() => {
		fetch("https://doctors-portal-server-695n.onrender.com/create-payment-intent", {
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
			body: JSON.stringify({ price }),
		})
			.then((res) => res.json())
			.then((data) => setClientSecret(data.clientSecret));
	}, [price]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!stripe || !elements) {
			return;
		}
		const card = elements.getElement(CardElement);
		if (card === null) {
			return;
		}
		// Use your card Element with other Stripe.js APIs
		setProcessing(true);
		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: "card",
			card,
		});

		if (error) {
			setError(error.message);
			setSuccess("");
		} else {
			setError("");
			console.log("[PaymentMethod]", paymentMethod);
		}
		// payment intent last step for payment ------------
		const { paymentIntent, error: intentError } =
			await stripe.confirmCardPayment(clientSecret, {
				payment_method: {
					card: card,
					billing_details: {
						name: patientName,
						email: user.email,
					},
				},
			});
		if (intentError) {
			setError(intentError?.message);
			setSuccess("");
		} else {
			setError("");
			setSuccess("Your Payment processed successfully.");
			console.log(paymentIntent);
			setProcessing(false);
			//  save to database-----------------
			// payment collection for console.log------
			const payment = {
				amount: paymentIntent.amount,
				created: paymentIntent.created,
				last4: paymentMethod.card.last4,
				transaction: paymentIntent.client_secret.slice("_secret"[0]),
			};
			const url = `https://doctors-portal-server-695n.onrender.com/appointments/${_id}`;
			fetch(url, {
				method: "PUT",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify(payment),
			})
				.then((res) => res.json())
				.then((data) => console.log(data));
		}
	};
	return (
		<div>
			<h3>check out form</h3>
			<form onSubmit={handleSubmit}>
				<CardElement
					options={{
						style: {
							base: {
								fontSize: "16px",
								color: "#424770",
								"::placeholder": {
									color: "#aab7c4",
								},
							},
							invalid: {
								color: "#9e2146",
							},
						},
					}}
				/>
				{processing ? (
					<CircularProgress></CircularProgress>
				) : (
					<button type="submit" disabled={!stripe || success}>
						Pay $ {price}
					</button>
				)}
			</form>
			{/* <h4>Email: {appointment?.email}</h4> */}
			{error && <p style={{ color: "red" }}>{error}</p>}
			{success && <p style={{ color: "green" }}>{success}</p>}
		</div>
	);
};

export default CheckoutForm;
