import { useState, useEffect } from "react";
import Table from "./Layout/Table";
import Header from "./Layout/FilterHeader";
import { formatDate } from "./utils";
import moment from "moment";

const options = [
  { label: "Weekly", value: 7 },
  { label: "Bi-Weekly", value: 14 },
  { label: "Monthly", value: 30 },
  { label: "Bi-Monthly", value: 60 },
];
function App() {
  const [projectCollection, setProjectCollection] = useState([]);

  const [filterProject, setFilterProjects] = useState([]);
  const [filterDuration, setFilterDuration] = useState(options[0]);
  const [filterStartDate, setFilterStartDate] = useState(
    new Date("01/01/2019")
  );
  const [filterEndDate, setFilterEndDate] = useState(new Date("10/01/2019"));

  const [csvData, setCSVData] = useState();
  const [tableData, setTableData] = useState([]);
  const [tableHeader, setTableHeader] = useState([]);
  const [filterTableData, setFilterTableData] = useState([]);
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
      return true;
    }
  };

  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");

    const data = csvRows.map((i) => {
      const values = i.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      const obj = csvHeader.reduce((object, header, index) => {
        object[header.replace("\r", "")] = values[index].replace("\r", "");
        return object;
      }, {});
      return obj;
    });

    setCSVData(data);
  };

  useEffect(() => {
    let filteredCSVData = csvData;

    if (!filteredCSVData?.length) return;

    let workers = new Set();
    let projects = new Set();
    let durations = [];

    if (filterStartDate && filterEndDate) {
      filteredCSVData = filteredCSVData.filter(
        (i) =>
          moment(i.start_time).isBetween(
            moment(filterStartDate),
            moment(filterEndDate)
          ) &&
          moment(i.end_time).isBetween(
            moment(filterStartDate),
            moment(filterEndDate)
          )
      );
    }

    const time = filteredCSVData.reduce((p, c) => {
      workers.add(c.workers);
      projects.add(c.project);
      durations.push(c.duration);

      return [
        [...(p[0] || []), c.start_time].filter((i) => i).sort(),
        [...(p[1] || []), c.end_time].filter((i) => i).sort(),
      ];
    }, []);

    durations = durations.sort((a, b) => a.split(":")[0] - b.split(":")[0]);

    workers = Array.from(workers).filter((i) => i);
    projects = Array.from(projects).filter((i) => i);

    const start_date = time?.[0]?.[0];
    const end_date = time?.[1]?.[time?.[1]?.length - 1];

    const diff = filterDuration.value;

    const totalDays = moment(end_date).diff(moment(start_date), "days");

    const remainder = Math.ceil(totalDays / diff);

    let divisons = [moment(start_date).format("YYYY-MM-DD")];

    for (let i = 0; i < remainder; i++) {
      const last = divisons[divisons.length - 1];
      divisons.push(moment(last).add(diff, "days").format("YYYY-MM-DD"));
    }

    divisons = divisons
      .map((date, index) => [date, divisons[index + 1]].filter((i) => i))
      .filter((i) => i.length === 2);

    const divisonsInWords = divisons.map((date, index) => [
      moment(date[0]).format("MMM. D"),
      moment(date[1]).format("MMM. D"),
    ]);

    const headers = [
      "workers",
      "hourly_rate",
      "project",
      ...divisonsInWords.map((i) => `${i[0]}-${i[1]}`),
      "project_hours",
      "total_hours",
      "project_cost",
      "total_cost",
    ];

    let transformedData = [];
    let transformedProjectData = [];

    let total_hours = {};
    let total_project_hours = {};

    projects.map((project) => {
      total_project_hours[`${project}`] = {};
    });

    workers.map((worker) => {
      const workerData = filteredCSVData.filter((i) => i.workers === worker);
      const hourly_rate = 1000;

      total_hours[`${worker}`] = 0;

      const transformedProjectData = [];

      projects
        .filter((i) => {
          if (!filterProject.length) return i;

          return filterProject.map((i) => i.value).includes(i);
        })
        .map((project) => {
          const projectData = workerData.filter((i) => i.project === project);

          const time = {};

          const totalSecondsArray = divisons.map((divison) => {
            const totalSeconds = projectData
              .filter(
                (i) =>
                  moment(i.start_time).isBetween(
                    moment(divison[0]),
                    moment(divison[1])
                  ) &&
                  moment(i.end_time).isBetween(
                    moment(divison[0]),
                    moment(divison[1])
                  )
              )
              .reduce((p, c) => p + Number(c.duration_seconds), 0);

            time[`${divison[0]}-${divison[1]}`] = totalSeconds;

            total_project_hours[`${project}`][`${divison[0]}-${divison[1]}`] =
              (total_project_hours[`${project}`][
                `${divison[0]}-${divison[1]}`
              ] || 0) + totalSeconds;

            return totalSeconds;
          });

          const project_hours = totalSecondsArray.reduce((p, c) => p + c, 0);
          const project_cost = Number((project_hours / 60 / 60) * hourly_rate);

          total_project_hours[`${project}`]["project_hours"] =
            (total_project_hours[`${project}`]["project_hours"] || 0) +
            project_hours;
          total_project_hours[`${project}`]["project_cost"] =
            (total_project_hours[`${project}`]["project_cost"] || 0) +
            project_cost;

          total_hours[`${worker}`] = total_hours[`${worker}`] + project_hours;

          Number((project_hours / 60 / 60) * hourly_rate) &&
            transformedProjectData.push({
              worker: transformedProjectData.find((i) => i.worker === worker)
                ? ""
                : worker,
              hourly_rate: transformedProjectData.find(
                (i) => i.worker === worker
              )
                ? ""
                : hourly_rate,
              project: project,
              ...time,
              project_hours: project_hours,
              total_hours: "",
              project_cost: project_cost.toFixed(2),
              total_cost: "",
            });
        });

      if (transformedProjectData.length) {
        transformedProjectData[0]["total_hours"] = total_hours[`${worker}`];
        transformedProjectData[0]["total_cost"] = Number(
          (total_hours[`${worker}`] / 60 / 60) * hourly_rate
        ).toFixed(2);
      }

      transformedData = [...transformedData, ...transformedProjectData];
    });

    Object.entries(total_project_hours).map((entry, index) => {
      const { project_cost, project_hours, ...date } = entry[1];
      transformedProjectData.push({
        worker: index ? "" : "Total",
        hourly_rate: "",
        project: entry[0],
        ...date,
        project_hours: Number(project_hours / 60 / 60).toFixed(2),
        total_hours: Number(
          Object.values(date).reduce((p, c) => p + c, 0)
        ).toFixed(2),
        project_cost: Number(project_cost).toFixed(2),
        total_cost: !index
          ? Number(
              Object.values(total_project_hours).reduce(
                (p, c) => p + c.project_cost,
                0
              )
            ).toFixed(2)
          : "",
      });
    });

    transformedData = [...transformedData, ...transformedProjectData].map(
      (i) => ({
        ...i,
        project_hours: Number(i.project_hours / 60 / 60).toFixed(2),
      })
    );

    setProjectCollection(projects.map((i) => ({ label: i, value: i })));
    setTableData(transformedData);
    setFilterTableData(transformedData);
    setTableHeader(headers);
  }, [csvData, filterProject, filterDuration, filterStartDate, filterEndDate]);

  useEffect(() => {
    // form a search query according to projects,start_time,end_time

    setSearchQuery(() => {
      return {
        projects: filterProject,
        startDate: filterStartDate,
        endDate: filterEndDate,
      };
    });
  }, [filterProject, filterStartDate, filterEndDate]);

  useEffect(() => {
    if (!Object.keys(searchQuery).length) return;
    const { projects, startDate, endDate } = searchQuery;

    let tempData = [];

    let filterOptions = projects?.map((project) => project?.value) || [];
    if (filterOptions.length === 0 && !startDate && !endDate) {
      return setFilterTableData(tableData);
    }

    tempData = [...tableData];

    if (filterOptions?.length) {
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

      tempData = tempData.reduce((acc, curr) => {
        let objName = `${curr?.workers
          ?.toString()
          .replace(" ", "")}-${curr?.project?.toString().replace(" ", "")}`;

        return {
          ...acc,
          [objName]: {
            ...acc[objName],
            name: curr?.workers,
            project: curr?.project,
            duration: validateDate(curr, startDate, endDate)
              ? (Number(acc[objName]?.duration) || 0) +
                Number(curr?.duration_seconds)
              : 0,
            repeat: Number(acc[objName]?.repeat) + 1 || 1,
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          },
        };
      }, {});
    }

    tempData = Object.values(tempData);

    setFilterTableData(tempData);
  }, [searchQuery, filterDuration]);

  return (
    <>
      <Header
        handleCsvOnSubmit={handleCsvOnSubmit}
        projects={{
          options: projectCollection,
          projectValue: filterProject,
          setProjects: setFilterProjects,
        }}
        reportFrequency={{
          options: options,
          value: filterDuration,
          setValue2: setFilterDuration,
        }}
        date={{
          startDate: filterStartDate,
          setStartDate: setFilterStartDate,
          endDate: filterEndDate,
          setEndDate: setFilterEndDate,
        }}
      />
      <Table
        tableHeader={tableHeader}
        tableData={tableData}
        frequency={filterDuration}
      />
    </>
  );
}

export default App;
