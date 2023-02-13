import React, { useState } from "react";

const Table = ({ tableData = [], tableHeader = [], frequency }) => {
  return (
    <div className="csv_table_wrapper">
      <table className="fl-table">
        <thead>
          <tr key={"header"}>
            {tableHeader.map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData.length
            ? tableData.map((item, index) => (
                <tr key={index}>
                  {Object.values(item).map((val) => (
                    <td>{val}</td>
                  ))}
                </tr>
              ))
            : "No data"}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
