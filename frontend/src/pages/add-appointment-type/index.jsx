import classNames from "classnames";
import { useMemo, useState } from "react";
import { apiPOST } from "../../api-helpers";
import commonStyles from "../../common-styles/common.module.css";
import styles from "./styles.module.css";

const AddAppointmentType = () => {
  const [name, setName] = useState("");
  const [minutes, setMinutes] = useState("");

  const handleNameChange = (e) => setName(e.target.value);
  const handleMinutesChange = (e) => setMinutes(e.target.value);

  const canSubmit = useMemo(() => name && minutes, [name, minutes]);

  const submitData = async (data) => {
    try {
      await apiPOST({
        url: `${process.env.REACT_APP_API}/appointment-types`,
        data,
        onSuccess() {
          setName("");
          setMinutes("");
          alert("Appointment type added successfully!");
        },
        onError(error) {
          alert(`Appointment type creation failed!\n${error}`);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateType = (ev) => {
    ev.preventDefault();
    if (canSubmit) {
      const payload = {
        appointment_type: {
          name,
          minutes: +minutes,
          parent_type: "Institution",
          bookable_online: true,
        },
      };
      submitData(payload);
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={commonStyles.form}>
        <div className={commonStyles.form_field}>
          <label htmlFor="type-name">Name</label>
          <input
            type="text"
            className={commonStyles.input}
            aria-label="name"
            id="type-name"
            onChange={handleNameChange}
            value={name}
          />
        </div>
        <div className={commonStyles.form_field}>
          <label htmlFor="description">Minutes</label>
          <input
            type="number"
            className={commonStyles.input}
            aria-label="minutes"
            onChange={handleMinutesChange}
            value={minutes}
          />
        </div>
        <div className={commonStyles.controls}>
          <button
            className={classNames(
              commonStyles.button,
              !canSubmit ? commonStyles.disabled : ""
            )}
            onClick={handleCreateType}
          >
            Add Appointment Type
          </button>
        </div>
      </form>
    </div>
  );
};

export { AddAppointmentType };
