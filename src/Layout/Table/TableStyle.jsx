import styled from "styled-components";

export const TableWrapper = styled.div`
  overflow: auto;

  table {
    width: 1400px;
    border-collapse: collapse;
    /* width: 100%; */
    @media (min-width: 1500px) {
      width: 100%;
    }

    tr {
      th {
        white-space: nowrap;
      }
      th,
      td {
        padding: 12px 10px;
      }
    }

    .total {
      td {
        border-top: 2px solid #bdbdbd;
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

export const BlockHeader = styled.th`
  padding: 12px 0 !important;
  div {
    padding: 12px 8px;
  }
  &:nth-last-child(2),
  &:last-child {
    div {
      max-width: 90%;
      text-align: center;
      background: #fbd09d;
      border-radius: 5px;
    }
  }

  &:last-child {
    div {
      background: #aaedb8;
    }
  }
`;
