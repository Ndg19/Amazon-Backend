const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Sucess!" });
});

// Stripe payment route
app.post("/payment/create", async (req, res) => {
  const total = req.query.total;

  if (total > 0) {
    try {
      // Stripe requires integer amount in cents
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total),
        currency: "usd",
      });

      res.status(201).json({
        clientsecret: paymentIntent.client_secret,
      });
    } catch (err) {
      console.error("Stripe error:", err);
      res.status(500).json({ message: "Stripe payment error" });
    }
  } else {
    res.status(403).json({ message: "Total must be greater than 0" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
