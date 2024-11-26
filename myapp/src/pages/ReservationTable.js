import axios from 'axios'; // Import axios
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./ReservationTable.css";

// Helper function to generate a unique ID (for example, using the current timestamp and index)
const generateId = () => {
  return `id-${new Date().getTime()}-${Math.floor(Math.random() * 1000)}`;
};

const ReservationTable = ({ onEdit, onDelete }) => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();

  // Fetch data when the component mounts
  useEffect(() => {
    const getAllReservations = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/reservations/all');
        
        // Add autogenerated id to each reservation
        const reservationsWithId = response.data.map((reservation) => ({
          ...reservation,
          id: generateId(), // Generate a unique id for each reservation
        }));

        setReservations(reservationsWithId); // Set the reservations with new ids
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    getAllReservations();
  }, []); // Empty dependency array ensures this runs once on mount

  // Handle delete with confirmation
  const handleDelete = (index) => {
    const reservationToDelete = reservations[index];
    const confirmDelete = window.confirm(`Are you sure you want to delete the reservation for ${reservationToDelete.customerName}?`);

    if (confirmDelete) {
      // Remove the reservation from the state
      const updatedReservations = reservations.filter((_, i) => i !== index);
      setReservations(updatedReservations);

      // Simulate API call to delete reservation
      axios.delete(`http://localhost:8080/api/reservations/${reservationToDelete.id}`)
        .then(() => {
          console.log(`Reservation ${reservationToDelete.id} deleted successfully.`);
        })
        .catch((error) => {
          console.error('Error deleting reservation:', error);
        });
    }
  };

  return (
    <div className="reservation-table">
      <h2>Reservation List</h2>
      <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Contact Number</th>
            <th>Table Number</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>Number of Guests</th>
            <th>Status</th>
            <th>Assigned Employee</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) => (
            <tr>
              <td>{reservation.customerName}</td>
              <td>{reservation.contactNumber}</td>
              <td>{reservation.tableNumber}</td>
              <td>{reservation.reservationDate}</td>
              <td>{reservation.reservationTime}</td>
              <td>{reservation.numberOfGuests}</td>
              <td>{reservation.status}</td>
              <td>{reservation.assignedEmployee}</td>
              <td>
                <button onClick={() => onEdit(reservation)}>Update</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
                <button
                  onClick={() => navigate('/table-details', { state: { tableNumber: reservation.tableNumber } })}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationTable;
