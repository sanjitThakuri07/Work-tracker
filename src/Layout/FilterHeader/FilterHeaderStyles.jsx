import styled from "styled-components";

export const Header = styled.header`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;

  @media (max-width: 768px) {
    h1 {
      font-size: 1.5rem;
      white-space: nowrap;
    }
  }
`;

export const ImportCSVContainer = styled.form`
  text-align: end;

  @media (max-width: 430px) {
    grid-row: 2;
    grid-column: 1/-1;
    label {
      display: block;
      width: 100%;
      text-align: center;
      margin-bottom: 16px;
    }
  }

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

export const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  grid-column: 1/-1;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 15px;
  }

  & > * {
    width: 80%;
    margin-right: 15px;

    @media (max-width: 768px) {
      width: 95%;
    }
  }
`;

export const Date = styled.div`
  .react-datepicker-wrapper {
    height: 100%;
  }
  .react-datepicker__input-container {
    height: 100%;
  }
`;

export const FilterOptions = styled.div`
  display: flex;
  gap: 0.3125rem;
  margin: 0.9375rem 0;

  grid-column: 1/-1;
`;
