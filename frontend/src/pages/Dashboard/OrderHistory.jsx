import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../../redux/orderSlice";
import "../../styles/OrderHistory.css";

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders = [], loading, error } = useSelector((state) => state.orders);

  const [filterStatus, setFilterStatus] = useState("all");

  // ✅ Fetch user orders when component mounts
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  console.log("📦 Orders from Redux:", orders);
  console.log("🔍 Filter Status:", filterStatus);

  // ✅ Normalize order status to avoid case mismatches
  const filteredOrders = orders.filter((order) => {
    const orderStatus = order.status ? order.status.toLowerCase() : "pending"; // Default to "pending"
    const selectedStatus = filterStatus.toLowerCase();
    
    return selectedStatus === "all" || orderStatus === selectedStatus;
  });

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="order-history-container">
      <h2>📦 My Orders</h2>

      {/* ✅ Filter Dropdown */}
      <div className="filter-container">
        <label htmlFor="order-filter">Filter by Status:</label>
        <select
          id="order-filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-dropdown"
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* ✅ Orders List */}
      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="order-list">
          {filteredOrders.map((order) => (
            <li key={order._id} className="order-item">
              <div className="order-header">
                <p>
                  🆔 Order ID: <strong>{order._id}</strong>
                </p>
                <p>📅 Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>
                  💰 Total:{" "}
                  <strong>${order.totalAmount?.toFixed(2) || "0.00"}</strong>
                </p>
                <p>
                  ✅ Payment:{" "}
                  <span className={order.isPaid ? "paid" : "not-paid"}>
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </p>
                <p>
                  🚚 Status:{" "}
                  <span className={`status-${order.status?.toLowerCase() || "pending"}`}>
                    {order.status || "Pending"}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
