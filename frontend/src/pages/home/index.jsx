import classNames from "classnames";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AddAppointmentType } from "../add-appointment-type";
import { AddWorkingHours } from "../add-working-hours";
import { AppointmentTypes } from "../appointment-types";
import { Appointments } from "../appointments";
import { BookingContainer } from "../book-appointment";
import { WorkingHours } from "../working-hours";
import styles from "./styles.module.css";

const tabs = [
  { name: "appointments", label: "Appointments" },
  { name: "addAppointmentType", label: "Add Appointment Type" },
  { name: "appointmentTypes", label: "Appointment Types" },
  { name: "booking", label: "Book Appointment" },
  { name: "workingHours", label: "Provider Working Hours" },
  { name: "addWorkingHours", label: "Add Working Hours" },
];

const Home = () => {
  const [activeTab, setActiveTab] = useState("appointments");

  const handleTabSelection = (id) => setActiveTab(id);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h2 className={styles.title}>NexHealth Appointment Booking</h2>
        <Link to="/logout" style={{ marginLeft: "auto", marginRight: "1rem" }}>
          Logout
        </Link>
      </header>
      <section className={styles.body}>
        <ul className={styles.tabs}>
          {tabs.map(({ name, label }) => (
            <li
              className={classNames(
                styles.tab,
                activeTab === name ? styles.active : ""
              )}
              onClick={() => handleTabSelection(name)}
              key={name}
            >
              {label}
            </li>
          ))}
        </ul>
        <div className={styles.tabs_body}>
          {activeTab === "appointments" && <Appointments />}
          {activeTab === "booking" && <BookingContainer />}
          {activeTab === "addWorkingHours" && <AddWorkingHours />}
          {activeTab === "workingHours" && <WorkingHours />}
          {activeTab === "addAppointmentType" && <AddAppointmentType />}
          {activeTab === "appointmentTypes" && <AppointmentTypes />}
        </div>
      </section>
    </div>
  );
};

export { Home };
