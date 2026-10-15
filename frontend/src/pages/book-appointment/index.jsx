import { default as dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { apiGET } from "../../api-helpers";
import { OverlayLoader } from "../../components/overlay-loader";
import { HomeContext } from "../../helpers/protected-route";
import { formatDate, postData } from "../../utils";
import { removeDuplicates } from "./../../utils";
import { AppointmentBookingForm } from "./book-appt-form";
import styles from "./styles.module.css";

dayjs.extend(utc);

const API = process.env.REACT_APP_API;

const BookingContainer = () => {
  const [patients, setPatients] = useState([]);
  const [providers, setProviders] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [operatories, setOperatories] = useState([]);

  const [availOperatories, setAvailOperatories] = useState([]);

  const [slots, setSlots] = useState([]);
  const { onError } = useContext(HomeContext);
  const [showOverlayLoader, setShowOverlayLoader] = useState(false);
  const formRef = useRef(null);

  const reset = () => {
    setWorkingHours([]);
    setSlots([]);
    setAvailOperatories([]);
  };

  const onSubmit = async (data) => {
    try {
      const request = await postData(
        `${API}/appointments/book-appointment`,
        data
      );

      const result = await request.json();

      if (result.code) {
        alert("Appointment booked successfully!");
        formRef.current.reset();
      } else {
        alert(`Appointment booking failed!\n${result.error}`);
      }
    } catch (error) {
      onError(error);
    }
  };

  const handlePatientTypeChange = () => reset();

  const handleFetchSlots = ({
    locationId,
    providerId,
    startDate,
    operatoryId,
  }) => {
    setShowOverlayLoader(true);

    const params = new URLSearchParams();
    params.append("locationId", locationId);
    params.append("providerId", providerId);
    params.append("startDate", dayjs(startDate).format("YYYY-MM-DD"));
    params.append("operatoryId", operatoryId);

    apiGET({
      url: `${API}/appointments/slots?${params.toString()}`,
      onSuccess: (data) => {
        setShowOverlayLoader(false);
        setSlots(
          data[0].slots.map((slot) => ({
            ...slot,
            name: formatDate(slot.time),
            id: dayjs(slot.time).utc().format(),
          }))
        );
      },
      onError,
    });
  };

  const onProviderSelected = (providerId) => {
    try {
      reset();
      setShowOverlayLoader(true);

      apiGET({
        url: `${API}/working-hours/provider/${providerId}`,
        onSuccess: (data) => {
          setShowOverlayLoader(false);
          setWorkingHours(data);
        },
        onError,
      });
    } catch (error) {
      setShowOverlayLoader(false);
      onError(error);
    }
  };

  const onTypeSelected = useCallback(
    (typeId) => {
      try {
        setSlots([]);
        const selected = workingHours
          .filter((hours) =>
            hours.appointment_types.some((type) => type.id === +typeId)
          )
          .map((hours) => hours.operatory_id);

        const deDupedOperatories = [...new Set(selected)];

        setAvailOperatories(deDupedOperatories);
      } catch (error) {
        setShowOverlayLoader(false);
        onError(error);
      }
    },
    [operatories.length, workingHours.length]
  );

  const onOperatorySelected = useCallback(() => {
    setSlots([]);
  }, []);

  const filteredOperatories = useMemo(() => {
    return operatories.filter(
      (operatory) => availOperatories.indexOf(operatory.id) > -1
    );
  }, [JSON.stringify(availOperatories), operatories.length]);

  // on load fetch the patients, providers and, operatories
  useEffect(() => {
    const fetchData = (type) => {
      apiGET({
        url: `${API}/${type}`,
        onSuccess: (data) => {
          if (type === "patients") {
            setPatients(data);
          } else if (type === "providers") {
            setProviders(
              data.map((provider) => ({
                ...provider,
                name: provider.first_name + " " + provider.last_name,
              }))
            );
          } else if (type === "operatories") {
            setOperatories(data);
          }
        },
        onError,
      });
    };

    // fetch patients, providers
    fetchData("patients");
    fetchData("providers");
    fetchData("operatories");
  }, []);

  const apptTypes = useMemo(() => {
    const typesFlat = workingHours.flatMap((hours) => hours.appointment_types);

    return removeDuplicates(typesFlat);
  }, [workingHours.length]);

  apptTypes.displayName = "apptTypes";

  return (
    <div className={styles.booking_container}>
      <AppointmentBookingForm
        patients={patients}
        providers={providers}
        operatories={filteredOperatories}
        workingHours={workingHours}
        apptTypes={apptTypes}
        onSubmit={onSubmit}
        onFetchSlots={handleFetchSlots}
        onProviderSelected={onProviderSelected}
        onTypeSelected={onTypeSelected}
        onOperatorySelected={onOperatorySelected}
        slots={slots}
        onPatientTypeChange={handlePatientTypeChange}
        ref={formRef}
      />
      {showOverlayLoader && <OverlayLoader />}
    </div>
  );
};

BookingContainer.displayName = "BookingContainer";

export { BookingContainer };
