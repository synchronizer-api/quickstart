import { useContext, useEffect, useState } from "react";
import { apiGET } from "../../api-helpers";
import { Loader } from "../../components/loader";
import { HomeContext } from "../../helpers/protected-route";
import styles from "./styles.module.css";
import { WorkingHoursList } from "./working-hours-list";

const API = process.env.REACT_APP_API;

function parseData(data) {
  const parsedResult = {};

  data.forEach((item) => {
    const providerId = item.provider_id;

    if (parsedResult[providerId]) {
      const curObject = parsedResult[providerId];
      parsedResult[providerId] = {
        ...curObject,
        details: curObject.details.concat({
          ...item,
          timings: {
            beginTime: item.begin_time,
            endTime: item.end_time,
          },
        }),
      };
    } else {
      parsedResult[providerId] = {
        ...item,
        details: [
          {
            ...item,
            timings: {
              beginTime: item.begin_time,
              endTime: item.end_time,
            },
          },
        ],
      };
    }
  });

  return Object.keys(parsedResult).map((key) => parsedResult[key]);
}

const WorkingHours = () => {
  const [workingHours, setWorkingHours] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [refetch, setRefetch] = useState(0);
  const { onError } = useContext(HomeContext);

  useEffect(() => {
    const fetchWorkingHours = async () => {
      try {
        setIsLoadingData(true);

        apiGET({
          url: `${API}/working-hours`,
          onSuccess: (data) => {
            setIsLoadingData(false);
            setWorkingHours(parseData(data));
          },
          onError,
        });
      } catch (error) {
        setIsLoadingData(false);
        onError(error);
      }
    };

    fetchWorkingHours();
  }, [refetch]);

  const handleDelete = (id) => {
    try {
      const deleteWorkingHours = async (id) => {
        const request = await fetch(`${API}/working-hours/delete/${id}`, {
          credentials: "include",
          method: "DELETE",
        });

        const result = await request.json();

        if (result.code) {
          setRefetch(new Date().getMilliseconds());
        }
      };

      deleteWorkingHours(id);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <div className={styles.working_hours}>
      <div className={styles.list_wrapper}>
        {isLoadingData ? (
          <div className={styles.loader_wrapper}>
            <Loader />
          </div>
        ) : workingHours.length ? (
          <WorkingHoursList
            workingHours={workingHours}
            onDelete={handleDelete}
          />
        ) : (
          <span className={styles.no_data}>No working hours found</span>
        )}
      </div>
    </div>
  );
};

export { WorkingHours };
