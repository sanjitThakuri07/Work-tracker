import _ from "lodash";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { TableWrapper } from "./TableStyle";

const Table = ({ tableHeader = [], tableData = [] }) => {
  if (!tableData.length) return <>No Data</>;

  console.log({ tableData });

  return (
    <TableWrapper>
      <table className="fl-table">
        <thead>
          <tr key={"header"}>
            {tableHeader?.map((key) => (
              <th>{_.startCase(_.toLower(key))}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {tableData.map((item, index) => {
            return (
              <tr
                key={index}
                className={`${
                  !item?.worker && !item?.hourly_rate ? "indicator" : "parent"
                }`}
              >
                {Object.values(item).map((val) => {
                  return <td>{val}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </TableWrapper>
  );
};

export default Table;
