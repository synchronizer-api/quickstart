import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { apiGET } from "../../api-helpers";
import styles from "../../common-styles/list.module.css";
import { HomeContext } from "../../helpers/protected-route";
import { ListItem } from "./working-hours-list-item";

const API = process.env.REACT_APP_API;

const WorkingHoursList = ({ workingHours = [], onDelete }) => {
  const queriedOperatories = useRef({});
  const { onError } = useContext(HomeContext);

  const [operatoriesDetails, setOperatoriesDetails] = useState({});

  const onDeleteClick = (id) => {
    window.confirm("Are you sure you want to delete these working hours?") &&
      onDelete(id);
  };

  const getOperatoryDetails = useCallback(async (id) => {
    apiGET({
      url: `${API}/operatories/${id}`,
      onSuccess: ({ name }) => {
        setOperatoriesDetails((prev) => ({
          ...prev,
          [id]: { name },
        }));
      },
      onError,
    });
  }, []);

  useEffect(() => {
    if (workingHours.length) {
      workingHours.forEach((workingHour) => {
        workingHour.details.forEach((detail) => {
          const { operatory_id } = detail;

          if (!(operatory_id in queriedOperatories.current)) {
            queriedOperatories.current[operatory_id] = null;
            getOperatoryDetails(operatory_id);
          }
        });
      });
    }
  }, [workingHours.length]);

  return (
    <>
      {workingHours.length > 0 && (
        <ul className={styles.list}>
          {/* headers */}
          <li className={styles.list_headers}>
            <div className={styles.list_header}>Name</div>
            <div className={styles.list_header}>Working Hours</div>
            <div></div>
          </li>

          {/* working hours */}
          {workingHours.map((workingHour) => (
            <ListItem
              {...workingHour}
              onDeleteClick={onDeleteClick}
              key={workingHour.id}
              operatoryDetails={operatoriesDetails}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export { WorkingHoursList };
