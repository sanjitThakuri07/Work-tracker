import React, { useState } from "react";
import { Select } from "../../components/Dropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import styles from "../../components/Dropdown/dropdown.module.css";

const Header = styled.header`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
`;

const ImportCSVContainer = styled.form`
  text-align: end;

  input {
    display: none;
  }

  label {
    background: ${({ fileSelected }) =>
      !fileSelected ? "#0276e1" : "rgba(2, 117, 225,.3)"};
    padding: 0.5rem 1rem;
    color: #fff;
    border-radius: 4px;
    cursor: pointer;
    /* pointer-events: ${({ fileSelected }) =>
      !fileSelected ? "auto" : "none"}; */
  }
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  grid-column: 1/-1;

  & > * {
    width: 80%;
    margin-right: 15px;
  }
`;

const Date = styled.div`
  .react-datepicker-wrapper {
    height: 100%;
  }
  .react-datepicker__input-container {
    height: 100%;
  }
`;

const FilterOptions = styled.div`
  display: flex;
  gap: 0.3125rem;
  margin: 0.9375rem 0;

  grid-column: 1/-1;
`;

const Index = ({
  handleCsvOnSubmit,
  projects = {},
  date = {},
  reportFrequency,
}) => {
  const [csvSelected, setCsvSelected] = useState(false);
  console.log({ csvSelected });

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
          {csvSelected ? "Imported CSV" : "Import CSV"}
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
            onChange={(val) => date.setStartDate(val)}
            className={`${styles.container} default__height`}
          />
        </Date>
        <Date>
          <DatePicker
            selected={date.endDate}
            onChange={(val) => date.setEndDate(val)}
            className={`${styles.container} default__height`}
          />
        </Date>
        <Select
          multiple
          options={projects.options || []}
          value={projects?.projectValue}
          onChange={(o) => projects.setProjects(o)}
          placeholder={"Projects"}
        />
        <Select
          options={reportFrequency.options}
          value={reportFrequency.value}
          onChange={(o) => reportFrequency.setValue2(o)}
          placeholder={"Frequency"}
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
