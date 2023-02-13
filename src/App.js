import { useState, useEffect } from "react";
import Table from "./Layout/Table";
import Header from "./Layout/FilterHeader";

const options = [
  { label: "Weekly", value: "Weekly" },
  { label: "Bi-Weekly", value: "Bi-Weekly" },
  { label: "Monthly", value: "Monthly" },
  { label: "Bi-Monthly", value: "Bi-Monthly" },
];
function App() {
  const [projectCollection, setProjectCollection] = useState([]);
  const [projects, setProjects] = useState([]);
  const [value2, setValue2] = useState([]);
  const [file, setFile] = useState();
  const [tableData, setTableData] = useState([]);
  const [filterTableData, setFilterTableData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [searchQuery, setSearchQuery] = useState({});

  const fileReader = new FileReader();

  const handleCsvOnSubmit = (e) => {
    // setFile(e.target.files[0]);
    if (e.target.files[0]) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(e.target.files[0]);
    }
  };

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const data = csvRows.map((i) => {
      const values = i.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const obj = csvHeader.reduce((object, header, index) => {
        object[header] = values[index];
        return object;
      }, {});
      return obj;
    });

    const findProjectOptions = data
      .map((data) => ({
        label: data?.project,
        value: data?.project,
      }))
      .filter(
        (obj, index, self) =>
          index ===
          self.findIndex((t) => JSON.stringify(t) === JSON.stringify(obj))
      );

    setProjectCollection(findProjectOptions);
    setTableData(data);
    setFilterTableData(data);
  };

  const tableHeader = Object.keys(Object.assign({}, ...tableData));

  useEffect(() => {
    // form a search query according to projects,start_time,end_time

    setSearchQuery(() => {
      return { projects, startDate, endDate };
    });
  }, [projects, startDate, endDate]);

  console.log({ searchQuery });

  useEffect(() => {
    if (!Object.keys(searchQuery).length) return;
    console.log(searchQuery);
    const { projects, startDate, endDate } = searchQuery;

    let tempData = [];

    let filterOptions = projects?.map((project) => project?.value) || [];
    if (filterOptions.length === 0 && !startDate && !endDate) {
      return setFilterTableData(tableData);
    }

    tempData = tableData;

    if (filterOptions) {
      let filterOptions = projects.map((project) => project?.value);
      tempData = tableData.filter((data) =>
        filterOptions.includes(data?.project)
      );
    }

    if (startDate) {
      tempData = tempData.filter(function (item) {
        var itemTime = new Date(item.start_time);
        return itemTime >= new Date(startDate);
      });
    }

    if (endDate) {
      tempData = tempData.filter(function (item) {
        var itemTime = new Date(item.start_time);
        return itemTime <= new Date(endDate);
      });
    }
    function validateDate(item, startDate, endDate) {
      var itemTime = new Date(item.start_time);
      return itemTime >= new Date(startDate) && itemTime <= new Date(endDate);
    }

    if (startDate && endDate) {
      tempData = tempData.filter(function (item) {
        var itemTime = new Date(item.start_time);
        return itemTime >= new Date(startDate) && itemTime <= new Date(endDate);
      });

      let tempFilterData = tempData.reduce((acc, curr) => {
        // curr.name === acc=> name && curr.project === acc.project
        if (curr?.name === acc?.name && curr.project === acc.project) {
          return {
            ...acc,
            [`${curr?.name}-${curr?.project}`]: {
              name: curr?.name,
              project: curr?.project,
            },
          };
        }
        return { ...acc };
      }, {});
    }

    setFilterTableData(tempData);
  }, [searchQuery]);

  return (
    <>
      <Header
        handleCsvOnSubmit={handleCsvOnSubmit}
        projects={{
          options: projectCollection,
          projectValue: projects,
          setProjects: setProjects,
        }}
        reportFrequency={{
          options: options,
          value: value2,
          setValue2: setValue2,
        }}
        date={{
          startDate,
          setStartDate,
          endDate,
          setEndDate,
        }}
      />
      <Table
        tableHeader={tableHeader}
        tableData={filterTableData}
        frequency={value2}
      />
    </>
  );
}

export default App;
