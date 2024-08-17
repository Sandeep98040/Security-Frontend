import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { Button } from "@mui/material";
import KhaltiCheckout from "khalti-checkout-web";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import keys from "../../services/khaltiSecrets";
import productServices from "../../services/productService";
import { usePurchase } from "../../utils/purchaseContext";
import { ResponsiveAppBarHomepage } from "../AppBar/ResponsiveAppBarHomepage";

export const PurchaseCart = () => {
  const purchase = usePurchase();
  const navigate = useNavigate();
  const [purchaseProduct, setPurchaseProduct] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    setPurchaseProduct({
      items: purchase.purchase,
      payment: "pending",
    });

    setTotalPrice(
      purchase.purchase.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      )
    );
  }, [purchase.purchase]);

  const handleKhaltiPayment = (e) => {
    e.preventDefault();

    let config = {
      publicKey: keys.publicTestKey,
      productIdentity: "1234567890",
      productName: "pawzzz",
      productUrl: "https://localhost:3005/",

      eventHandler: {
        onSuccess(payload) {
          console.log(payload);
          setPurchaseProduct({
            ...purchaseProduct,
            payment: "success",
          });
          handlePayAndPurchase();
        },
        onError(error) {
          console.log(error);
          window.alert("Payment failed!");
        },
        onClose() {
          console.log("widget is closing");
        },
      },
      paymentPreference: [
        "KHALTI",
        "EBANKING",
        "MOBILE_BANKING",
        "CONNECT_IPS",
        "SCT",
      ],
    };

    let checkout = new KhaltiCheckout(config);
    checkout.show({ amount: 200 * 100 });
  };

  const handlePayAndPurchase = () => {
    productServices
      .purchaseProduct(purchaseProduct)
      .then((res) => {
        window.alert("Purchase successfully!");
        purchase.setPurchase([]);
        setPurchaseProduct({});
        setTotalPrice(0);
        navigate("/home");
      })
      .catch((err) => window.alert(err.response.data.error));
  };

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', padding: '24px' }}> {/* Explicitly set background to white */}
      <ResponsiveAppBarHomepage purchaseProductLength={purchase.purchase.length} />
      <h1 style={{ color: 'black' }} className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h1> {/* Text set to black */}

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full">
          <thead style={{ color: 'black' }} className="bg-gray-100"> {/* Text set to black */}
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-right">Quantity</th>
              <th className="p-4 text-right">Price per Unit</th>
              <th className="p-4 text-right">Total Price</th>
            </tr>
          </thead>
          <tbody style={{ color: 'black' }}> {/* Text set to black */}
            {purchaseProduct.items?.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="p-4 flex items-center">
                  <img
                    src={`https://localhost:3005/product/${item.picture}`}
                    alt="Product"
                    className="w-14 h-14 rounded-md object-cover mr-4"
                  />
                  <div style={{ color: 'black' }} className="font-medium">{item.name}</div> {/* Text set to black */}
                </td>
                <td className="p-4 text-right">{item.quantity}</td>
                <td className="p-4 text-right">Rs {item.price}</td>
                <td style={{ color: 'black' }} className="p-4 text-right font-semibold">Rs {item.price * item.quantity}</td> {/* Text set to black */}
              </tr>
            ))}
          </tbody>
          <tfoot style={{ color: 'black' }} className="bg-gray-50"> {/* Text set to black */}
            <tr>
              <td colSpan={2}></td>
              <td className="p-4 text-right text-lg font-bold">Total</td>
              <td style={{ color: 'black' }} className="p-4 text-right text-xl font-bold">Rs {totalPrice}</td> {/* Text set to black */}
            </tr>
          </tfoot>
        </table>
      </div>

      {purchase.purchase.length > 0 ? (
        <>
          <div style={{ color: 'black' }} className="mt-6 text-center"> {/* Text set to black */}
            Note: Rs {totalPrice}/- is equivalent to Rs 200 due to Khalti test-mode payment limitation.
          </div>
          <Button
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition"
            onClick={handleKhaltiPayment}
            variant="contained"
            startIcon={<ShoppingCartCheckoutIcon />}
          >
            Pay and Purchase Now
          </Button>
        </>
      ) : (
        <div style={{ color: 'black' }} className="mt-12 text-center text-lg"> {/* Text set to black */}
          Your cart is currently empty.
        </div>
      )}
    </div>
  );
};

export default PurchaseCart;
