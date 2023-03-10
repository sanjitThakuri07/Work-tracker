import React, { useState } from "react";
import { Select } from "../../components/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "../../components/Dropdown/dropdown.module.css";
import { FiFilter } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";
import { BiImport } from "react-icons/bi";

import {
  Header,
  ImportCSVContainer,
  FilterContainer,
  Date,
  FilterOptions,
} from "./FilterHeaderStyles";

const Index = ({
  handleCsvOnSubmit,
  projects = {},
  date = {},
  reportFrequency,
}) => {
  const [csvSelected, setCsvSelected] = useState(false);

  function selectOption({ option, value, onChange }) {
    if (value.includes(option)) {
      onChange(value.filter((o) => o !== option));
    } else {
      onChange([...value, option]);
    }
  }

  return (
    <Header>
      <h1>Workers Time Tracker</h1>
      <ImportCSVContainer fileSelected={csvSelected}>
        <label htmlFor="csvFileInput">
          <BiImport />
          <span>{csvSelected ? "Imported CSV" : "Import CSV"}</span>
        </label>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={(e) => {
            handleCsvOnSubmit(e) && setCsvSelected(true);
          }}
        />
      </ImportCSVContainer>
      <FilterContainer>
        <Date>
          <DatePicker
            selected={date.startDate}
            className={`${styles.container} default__height`}
            selectsStart
            startDate={date.startDate}
            // endDate={endDate}
            onChange={(val) => date.setStartDate(val)}
            placeholderText="Start Date"
          />
          <CiCalendarDate />
        </Date>
        <Date>
          <DatePicker
            selected={date.endDate}
            onChange={(val) => date.setEndDate(val)}
            className={`${styles.container} default__height`}
            selectsStart
            startDate={date.startDate}
            minDate={date.startDate}
            placeholderText="End Date"
          />
          <CiCalendarDate />
        </Date>
        <Select
          options={reportFrequency.options}
          value={reportFrequency.value}
          onChange={(o) => reportFrequency.setValue2(o)}
          placeholder={"Frequency"}
        />
        <Select
          multiple
          options={projects.options || []}
          value={projects?.projectValue}
          onChange={(o) => projects.setProjects(o)}
          placeholder={"Projects"}
          icon={
            <div className="custom__icon">
              <FiFilter />
            </div>
          }
        />
      </FilterContainer>
      <FilterOptions>
        {projects?.projectValue.map((v) => (
          <button
            key={v.value}
            onClick={(e) => {
              selectOption({
                option: v,
                value: projects?.projectValue,
                onChange: (o) => projects.setProjects(o),
              });
            }}
            className={styles["option-badge"]}
          >
            {v.label}
            <span className={styles["remove-btn"]}>&times;</span>
          </button>
        ))}
        {!!projects?.projectValue.length && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              projects.setProjects([]);
            }}
            className={`${styles["option-badge"]} ${styles["clear__all"]}`}
          >
            Clear Filters
            <span>&times;</span>
          </button>
        )}
      </FilterOptions>
    </Header>
  );
};

export default Index;
