const Stripe = require("stripe");

const stripe = new Stripe(process.env.Stripe_Private_Api_Key);
const client_domain = process.env.CLIENT_DOMAIN;

const createCheckoutSession = async (req, res, next) => {
    try {
        const { items } = req.body;  

        const lineItems = items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: Math.round(item.price * 100), 
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${client_domain}/payment/success`, // URL to redirect after payment success
            cancel_url: `${client_domain}/payment/cancel`,   // URL to redirect if payment is canceled
        });

        

        res.json({ success: true, sessionId: session.id });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message || "Internal server error" });
    }
};


const getSessionStatus = async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        res.send({
            status: session?.status,
            customer_email: session?.customer_details?.email,
            session
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message || "Internal server error" });
    }
};

module.exports = {
    createCheckoutSession,
    getSessionStatus
};