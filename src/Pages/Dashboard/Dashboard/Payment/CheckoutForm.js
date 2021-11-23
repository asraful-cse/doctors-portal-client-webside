import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";

const CheckoutForm = ({ appointment }) => {
	const { price } = appointment;
	const [error, setError] = useState("");
	const stripe = useStripe();
	const elements = useElements();
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
		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: "card",
			card,
		});

		if (error) {
			setError(error.message);
		} else {
			setError("");

			console.log("[PaymentMethod]", paymentMethod);
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
				<button type="submit" disabled={!stripe}>
					Pay $ {price}
				</button>
			</form>
			<h4>Email: {appointment?.email}</h4>
			{error && <p style={{ color: "red" }}>{error}</p>}
		</div>
	);
};

export default CheckoutForm;
