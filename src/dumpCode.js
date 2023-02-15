//   const [searchQuery, setSearchQuery] = useState({});
// useEffect(() => {
//   // form a search query according to projects,start_time,end_time

//   setSearchQuery(() => {
//     return {
//       projects: filterProject,
//       startDate: filterStartDate,
//       endDate: filterEndDate,
//     };
//   });
// }, [filterProject, filterStartDate, filterEndDate]);

// useEffect(() => {
//   if (!Object.keys(searchQuery).length) return;
//   const { projects, startDate, endDate } = searchQuery;

//   let tempData = [];

//   let filterOptions = projects?.map((project) => project?.value) || [];
//   if (filterOptions.length === 0 && !startDate && !endDate) {
//     return setFilterTableData(tableData);
//   }

//   tempData = [...tableData];

//   if (filterOptions?.length) {
//     let filterOptions = projects.map((project) => project?.value);
//     tempData = tableData.filter((data) =>
//       filterOptions.includes(data?.project)
//     );
//   }

//   if (startDate) {
//     tempData = tempData.filter(function (item) {
//       var itemTime = new Date(item.start_time);
//       return itemTime >= new Date(startDate);
//     });
//   }

//   if (endDate) {
//     tempData = tempData.filter(function (item) {
//       var itemTime = new Date(item.start_time);
//       return itemTime <= new Date(endDate);
//     });
//   }

//   function validateDate(item, startDate, endDate) {
//     var itemTime = new Date(item.start_time);
//     return itemTime >= new Date(startDate) && itemTime <= new Date(endDate);
//   }

//   if (startDate && endDate) {
//     tempData = tempData.filter(function (item) {
//       var itemTime = new Date(item.start_time);
//       return itemTime >= new Date(startDate) && itemTime <= new Date(endDate);
//     });

//     tempData = tempData.reduce((acc, curr) => {
//       let objName = `${curr?.workers
//         ?.toString()
//         .replace(" ", "")}-${curr?.project?.toString().replace(" ", "")}`;

//       return {
//         ...acc,
//         [objName]: {
//           ...acc[objName],
//           name: curr?.workers,
//           project: curr?.project,
//           duration: validateDate(curr, startDate, endDate)
//             ? (Number(acc[objName]?.duration) || 0) +
//               Number(curr?.duration_seconds)
//             : 0,
//           repeat: Number(acc[objName]?.repeat) + 1 || 1,
//           startDate: formatDate(startDate),
//           endDate: formatDate(endDate),
//         },
//       };
//     }, {});
//   }

//   tempData = Object.values(tempData);

//   setFilterTableData(tempData);
// }, [searchQuery, filterDuration]);
