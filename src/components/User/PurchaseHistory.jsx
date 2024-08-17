import React, { useEffect, useState } from 'react';
import userServices from '../../services/userService';
import { ResponsiveAppBarHomepage } from '../AppBar/ResponsiveAppBarHomepage';
import { usePurchase } from '../../utils/purchaseContext';

export const PurchaseHistory = () => {
  const purchase = usePurchase();
  const [purchaseProducts, setPurchaseProducts] = useState([]);

  useEffect(() => {
    userServices.getAllPurchaseProducts()
      .then(res => setPurchaseProducts(res.data))
      .catch(err => window.alert(err.response.data.error));
  }, []);

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: 'white' }}> {/* Background explicitly set to white */}
      <ResponsiveAppBarHomepage purchaseProductLength={purchase.purchase.length} />

      <div className="max-w-7xl mx-auto mt-12">
        <h1 className="text-4xl font-bold text-center mb-8" style={{ color: 'black' }}>Purchase History</h1> {/* Text explicitly set to black */}

        <div className="overflow-x-auto shadow-md rounded-lg bg-white"> {/* Ensure table background is white */}
          <table className="min-w-full">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Purchase Date</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Quantity</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Price per piece</th>
                <th className="text-right py-3 px-4 font-semibold text-sm">Total Price</th>
              </tr>
            </thead>
            <tbody style={{ color: 'black' }}> {/* Set text color to black for all rows */}
              {purchaseProducts.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-100">
                  <td className="py-3 px-4 text-left" style={{ color: 'black' }}> {/* Text explicitly set to black */}
                    <div className="font-bold">{item.name}</div>
                  </td>
                  <td className="py-3 px-4 text-right" style={{ color: 'black' }}>{item.purchaseDate}</td> {/* Text explicitly set to black */}
                  <td className="py-3 px-4 text-right" style={{ color: 'black' }}>{item.quantity}</td> {/* Text explicitly set to black */}
                  <td className="py-3 px-4 text-right" style={{ color: 'black' }}>Rs {item.price}</td> {/* Text explicitly set to black */}
                  <td className="py-3 px-4 text-right" style={{ color: 'black' }}>Rs {item.totalPrice}</td> {/* Text explicitly set to black */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
