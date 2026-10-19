import dayjs from "dayjs";
import { useContext, useEffect, useState } from "react";
import { apiGET } from "../../api-helpers";
import { Loader } from "../../components/loader";
import { HomeContext } from "../../helpers/protected-route";
import { patchData } from "../../utils";
import { AppointmentsList } from "./appointments-list";
import styles from "./styles.module.css";

const API = process.env.REACT_APP_API;

const Appointments = () => {
  const [dateFilter, setDateFilter] = useState({
    startDate: dayjs(),
    endDate: dayjs().add(24, "hours"),
  });
  const [appointments, setAppointments] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { onError } = useContext(HomeContext);

  const fetchAppointments = async (startDate, endDate) => {
    try {
      setIsLoadingData(true);
      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      apiGET({
        url: `${API}/appointments?${params.toString()}`,
        onSuccess: (data) => {
          setAppointments(data.filter((appointment) => !appointment.cancelled));
          setIsLoadingData(false);
        },
        onError,
      });
    } catch (error) {
      setIsLoadingData(false);
      onError(error);
    }
  };

  useEffect(() => {
    const { startDate, endDate } = dateFilter;
    // a half-typed datetime-local value parses to an invalid date
    if (startDate.isValid() && endDate.isValid()) {
      fetchAppointments(startDate, endDate);
    }
  }, [dateFilter.startDate, dateFilter.endDate]);

  const handleStartDateChange = (e) => {
    setDateFilter((prev) => ({
      ...prev,
      startDate: dayjs(e.target.value),
    }));
  };

  const handleEndDateChange = (e) => {
    setDateFilter((prev) => ({
      ...prev,
      endDate: dayjs(e.target.value),
    }));
  };

  const handleCancelAppointment = async (id) => {
    try {
      const request = await patchData(
        `${API}/appointments/cancel-appointment/${id}`,
        {
          appt: {
            cancelled: true,
          },
        }
      );

      const result = await request.json();

      if (result.code) {
        window.alert("Appointment cancelled successfully");
        fetchAppointments(dateFilter.startDate, dateFilter.endDate);
      } else {
        window.alert(`Failed to cancel appointment\n${result.error}`);
      }
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className={styles.appointments}>
      <div className={styles.filter_wrapper}>
        <div className={styles.filter_fields}>
          <div className={styles.filter_field}>
            <label>From:</label>
            <input
              type="datetime-local"
              aria-label="start-date"
              value={dateFilter.startDate.format("YYYY-MM-DDTHH:mm")}
              onChange={handleStartDateChange}
            />
          </div>
          <div className={styles.filter_field}>
            <label>To:</label>
            <input
              type="datetime-local"
              aria-label="end-date"
              value={dateFilter.endDate.format("YYYY-MM-DDTHH:mm")}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
      </div>

      <div className={styles.appointments_list_wrapper}>
        {isLoadingData ? (
          <div className={styles.loader_wrapper}>
            <Loader />
          </div>
        ) : (
          <AppointmentsList
            appointments={appointments}
            onCancel={handleCancelAppointment}
          />
        )}
      </div>
    </div>
  );
};

export { Appointments };
