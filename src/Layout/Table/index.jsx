import _ from "lodash";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { TableWrapper, BlockHeader } from "./TableStyle";

const Table = ({ tableHeader = [], tableData = [] }) => {
  if (!tableData.length) return <>No Data</>;

  return (
    <TableWrapper>
      <table className="fl-table">
        <thead>
          <tr>
            {tableHeader?.map((key, idx) => {
              return idx < tableHeader?.length - 2 ? (
                <BlockHeader colSpan={idx >= tableHeader?.length - 4 ? 2 : 1}>
                  <div>
                    {key.toString().includes("hours")
                      ? key?.split("_")[0] === "project"
                        ? "Aggregated Hours"
                        : "Cost"
                      : ""}
                  </div>
                </BlockHeader>
              ) : (
                <></>
              );
            })}
          </tr>
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
                  item?.worker?.toString().trim().toLowerCase() === "total"
                    ? "total"
                    : ""
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
