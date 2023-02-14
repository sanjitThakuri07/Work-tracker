import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow: auto;

  table {
    /* width: 100%; */
    width: 1400px;
    border-collapse: collapse;

    tr {
      th,
      td {
        padding: 12px 8px;
      }

      /* &:last-child {
        td {
          border-top: 4px solid #bdbdbd;
        }
      } */
    }

    .parent {
      &:not(:first-child) {
        td {
          border-top: 2px solid #bdbdbd;
        }
      }

      &:last-child {
        td {
          border: 4px solid #bdbdbd;
        }
      }
    }

    .parent:last-child {
      td {
        border: 4px solid #bdbdbd;
      }
    }

    thead {
      tr {
        th {
          background-color: #f7f8f6;
          text-align: left;
        }
      }
    }
  }
`;
