import React, { useState } from "react";
import { Select } from "../../components/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Index = ({
  handleCsvOnSubmit,
  projects = {},
  date = {},
  reportFrequency,
}) => {
  return (
    <header>
      <div>
        <Select
          multiple
          options={projects.options || []}
          value={projects?.projectValue}
          onChange={(o) => projects.setProjects(o)}
        />
        <DatePicker
          selected={date.startDate}
          onChange={(val) => date.setStartDate(val)}
        />
        <DatePicker
          selected={date.endDate}
          onChange={(val) => date.setEndDate(val)}
        />

        <Select
          options={reportFrequency.options}
          value={reportFrequency.value}
          onChange={(o) => reportFrequency.setValue2(o)}
        />

        <div className="header_content">
          <form>
            <label htmlFor="csvFileInput">Import Csv</label>
            <input
              type={"file"}
              id={"csvFileInput"}
              accept={".csv"}
              onChange={handleCsvOnSubmit}
            />
          </form>
        </div>
      </div>
    </header>
  );
};

export default Index;
