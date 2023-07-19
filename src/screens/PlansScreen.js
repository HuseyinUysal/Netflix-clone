import React, { useEffect, useState } from "react";
import "./PlansScreen.css";
import db from "../firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { loadStripe } from "@stripe/stripe-js";

function PlansScreen() {
  const [products, setProducts] = useState([]);
  const user = useSelector(selectUser);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    db.collection("customers")
      .doc(user.uid)
      .collection("subscriptions")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach(async (subscription) => {
          setSubscription({
            role: subscription.data().role,
            current_period_end: subscription.data().current_period_end.seconds,
          });
        });
      });
  }, [user.uid]);

  useEffect(() => {
    db.collection("products")
      .where("active", "==", true)
      .get()
      .then((querySnapshot) => {
        const products = {};
        querySnapshot.forEach(async (productdDoc) => {
          products[productdDoc.id] = productdDoc.data();
          const priceSnap = await productdDoc.ref.collection("prices").get();
          priceSnap.docs.forEach((price) => {
            products[productdDoc.id].prices = {
              priceId: price.id,
              priceData: price.data(),
            };
          });
        });
        setProducts(products);
      });
  }, []);

  const loadCheckout = async (priceId) => {
    const docRef = await db
      .collection("customers")
      .doc(user.uid)
      .collection("checkout_sessions")
      .add({
        price: priceId,
        success_url: window.location.origin,
        cancel_url: window.location.origin,
      });

    docRef.onSnapshot(async (snap) => {
      const { error, sessionId } = snap.data();

      if (error) {
        //Show an error to your customer and
        //inspect your Cloud Function logs is the Firebase console.
        alert(`An error occured: ${error.message}`);
      }
      if (sessionId) {
        //We have a session, let's redirect to Checkout
        //Init Stripe
        const stripe = await loadStripe(
          "pk_test_51NVCkOFMYCjFi3RLYV0lCMZbMbsoBqisVZ16GmZUaZRouWnGTMnMxjSljRSbeVwvC2TiyyQw8xDwKqDhzUxy1NWO00OMxlGzbM"
        );
        stripe.redirectToCheckout({ sessionId });
      }
    });
  };
  return (
    <div className="plansScreen">
      <br/>
      {subscription && (
        <p>
          Renewal date: {" "}
          {new Date(subscription?.current_period_end * 1000).toLocaleDateString()}
        </p>
      )}
      {Object.entries(products).map(([productId, productData]) => {
        const isCurrentPackage = productData.name
          ?.toLowerCase()
          .includes(subscription?.role);
        return (
          <div
            key={productId}
            className={`${
              isCurrentPackage && "planScreen__plan--disabled"
            } plansScreen__plan`}
          >
            <div className="plansScreen__info">
              <h5>{productData.name}</h5>
              <h6>{productData.description}</h6>
            </div>
            <button
              onClick={() =>
                !isCurrentPackage && loadCheckout(productData.prices.priceId)
              }
            >
              {isCurrentPackage ? "Current Package" : "Subscribe"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default PlansScreen;
