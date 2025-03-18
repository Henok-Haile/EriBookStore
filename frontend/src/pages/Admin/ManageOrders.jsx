import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrder, deleteOrderById } from "../../redux/orderSlice";
import { toast } from "react-toastify";
import "../../styles/admin.css";
import LoadingSpinner from "../../components/LoadingSpinner";

const ManageOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  console.log("📦 Orders in Redux State:", orders);

  // ✅ Handle Order Status Change & Send Emails
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const updatedOrder = await dispatch(updateOrder({ orderId, status: newStatus })).unwrap();

      toast.success(`✅ Order ${orderId} updated to ${newStatus}`);

      // ✅ Send shipping confirmation email
      if (newStatus === "Shipped") {
        toast.info(`📧 Shipping confirmation email will be sent...`);
      }
      
      // ✅ Send delivery confirmation email
      if (newStatus === "Delivered") {
        toast.info(`📩 Delivery confirmation email will be sent...`);
      }

    } catch (error) {
      toast.error(`❌ Failed to update order: ${error}`);
    }
  };

  // ✅ Handle Order Deletion
  const handleDelete = async (orderId) => {
    if (window.confirm("⚠️ Are you sure you want to delete this order?")) {
      try {
        await dispatch(deleteOrderById(orderId)).unwrap();
        toast.success(`✅ Order ${orderId} deleted successfully!`);
      } catch (error) {
        toast.error(`❌ Failed to delete order: ${error}`);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="admin-container">
      <h2>📦 Manage Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.email || "Unknown"}</td>
                <td>${order.totalAmount?.toFixed(2) || "0.00"}</td>
                <td>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
                <td>
                  <button className="btn-delete" onClick={() => handleDelete(order._id)}>
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <a href="/admin" className="admin-back">⬅ Back to Dashboard</a>
    </div>
  );
};

export default ManageOrders;
