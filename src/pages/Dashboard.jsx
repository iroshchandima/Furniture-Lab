import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, getUserOrders, updateOrderStatus } = useAppContext();
  const navigate = useNavigate();

  // Redirect if not logged in
  if (!user) {
    navigate("/login");
    return null;
  }

  const orders = getUserOrders();

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Welcome back, {user.name}
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Here are your orders
            </p>
          </div>
          <div className="border-t border-gray-200">
            {orders.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No orders yet. Start shopping to place your first order!
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <li key={order.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm text-gray-500">
                            Order #{order.id}
                          </p>
                          <p className="text-sm text-gray-500">
                            Date: {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-4"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity} × $
                                {item.price.toFixed(2)}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              ${(item.quantity * item.price).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center border-t pt-4">
                        <p className="text-lg font-medium text-gray-900">
                          Total: ${order.total.toFixed(2)}
                        </p>
                        {order.status === "Pending" && (
                          <div className="space-x-2">
                            <button
                              onClick={() =>
                                handleUpdateStatus(order.id, "Cancelled")
                              }
                              className="px-3 py-1 text-sm text-red-600 border border-red-600 rounded-md hover:bg-red-50"
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
