import React, { useEffect, useImperativeHandle, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import commonStyles from "../../common-styles/common.module.css";
import { Select } from "../../components/select";

const Fields = React.forwardRef((props, ref) => {
  const {
    apptTypes = [],
    disabledDays = [],
    handleApptTypeSelection,
    handleDateSelection,
    handleNotesChange,
    handleOperatorySelection,
    handleProviderSelection,
    handleSlotSelection,
    operatories = [],
    patientType,
    providers = [],
    slots = [],
    selectedDate,
  } = props;

  const locationRef = useRef(null);
  const providerRef = useRef(null);
  const apptTypeRef = useRef(null);

  const resetFields = () => {
    locationRef.current.reset();
    providerRef.current.reset();
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      resetFields();
    },
  }));

  useEffect(() => {
    resetFields();
  }, [patientType]);

  return (
    <>
      {/* provider */}
      <div className={commonStyles.form_field}>
        <Select
          label="Provider"
          options={providers}
          onChange={(ev) => {
            locationRef.current.reset();
            handleProviderSelection(ev);
          }}
          id="provider"
          placeholder="Select a provider"
          ref={providerRef}
        />
      </div>

      <div className={commonStyles.form_field}>
        <Select
          label="Appointment Type"
          options={apptTypes}
          onChange={handleApptTypeSelection}
          id="appt-type"
          placeholder="Select an appointment type"
          ref={apptTypeRef}
        />
      </div>

      {/* operatories */}
      <div className={commonStyles.form_field}>
        <Select
          label="Operatory"
          options={operatories}
          onChange={handleOperatorySelection}
          id="operatory"
          placeholder="Choose an Operatory"
          ref={locationRef}
        />
      </div>

      {/* date */}
      <div className={commonStyles.form_field}>
        <label className={commonStyles.label} htmlFor="provider">
          Choose a date
        </label>
        <DayPicker
          onDayClick={handleDateSelection}
          mode="single"
          disabled={[
            {
              dayOfWeek: disabledDays,
            },
            {
              before: new Date(),
            },
          ]}
          selected={selectedDate}
        />
      </div>

      <div className={commonStyles.form_field}>
        <Select
          label="Slot"
          options={slots}
          onChange={handleSlotSelection}
          id="slot"
          placeholder="Select a slot"
        />
      </div>

      <div className={commonStyles.form_field}>
        <label className={commonStyles.label} htmlFor="notes">
          Note
        </label>
        <textarea
          className={commonStyles.textarea}
          id="notes"
          onChange={handleNotesChange}
        />
      </div>
    </>
  );
});

Fields.displayName = "Booking form fields";

export { Fields };
