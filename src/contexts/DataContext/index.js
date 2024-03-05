import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);
  // ajout de la const last et setLast

  const getData = useCallback(async () => {
    try {
      const eventData = await api.loadData();
      setData(eventData);
      // recuperation des données de l'api dans une const eventData
      if (eventData.events) {
        const lastEvent = eventData.events[eventData.events.length - 1];
        setLast(lastEvent);
      }

      // ajout de la const lastEvent qui recupere le dernier evenement de la liste
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
        // ajout de last dans les valeurs
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
