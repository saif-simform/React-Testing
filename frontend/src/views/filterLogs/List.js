import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Table,
  Row,
  Col,
  Container,
  Button,
  Input,
  Badge,
} from "reactstrap";
import Loader from "../../components/Loader";
import {
  NoRecordsFound,
  TableLoadingText,
} from "../../components/TableLoadingText";
import { LogService } from "../../services/api.service";
import { toast } from "react-toastify";
import "flatpickr/dist/themes/dark.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";

const FilterLogs = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [type, setType] = useState("M");
  const [logData, setLogData] = useState([]);
  const [rangeData, setRangeData] = useState([]);

  const getList = async () => {
    setShowLoader(true);
    try {
      const { data } = await LogService.getFilterList(type, startDate, endDate);
      setLogData(data.logData || []);
      setRangeData(data.rangeData || []);
    } catch (error) {
      setLogData([]);
      setRangeData([]);
      toast.error(error.message);
    } finally {
      setShowLoader(false);
    }
  };

  let rangeItems;
  if (rangeData.length > 0) {
    rangeItems = rangeData.map((element, index) => {
      return (
        <tr key={index}>
          <td>{element.date}</td>
          <td>{element.duration}</td>
        </tr>
      );
    });
  } else {
    rangeItems = <NoRecordsFound colSpan={8} />;
  }

  let logItems;
  if (logData.length > 0) {
    logItems = logData.map((element, index) => {
      return (
        <tr key={index}>
          <td>{element.task.taskName}</td>
          <td>{moment(element.date).format("MM/DD/YYYY")}</td>
          <td>{moment(element.startTime).format("HH:mm:ss")}</td>
          <td>{moment(element.endTime).format("HH:mm:ss")}</td>
          <td>{element.comment}</td>
          <td>{element.duration}</td>
          <td>
            {element.status == "pending" ? (

              <Badge color="secondary">{element.status}</Badge>

            ) : element.status == "approved" ? (
              <Badge color="success">{element.status}</Badge>
            ) : (
              <Badge color="danger">{element.status}</Badge>
            )}
          </td>
        </tr>
      );
    });
  } else {
    logItems = <NoRecordsFound colSpan={8} />;
  }
  return (
    <>
      <Container fluid>
        <Row className="mb-3 pt-4">
          <Col className="d-flex">
            <div className="date-picker-call me-3">
              <Flatpickr
                data-enable-date
                options={{
                  dateFormat: "d-m-y",
                }}
                placeholder="Select start date"
                value={startDate}
                onChange={([date]) => {
                  setStartDate(date);
                }}
                className="form-control"
              />
            </div>
            <div className="date-picker-call">
              <Flatpickr
                data-enable-date
                options={{
                  dateFormat: "d-m-y",
                }}
                placeholder="Select end date"
                value={endDate}
                onChange={([date]) => {
                  setEndDate(date);
                }}
                className="form-control"
              />
            </div>
          </Col>
          <Col className="d-flex justify-content-end">
            <div className="date-picker-call me-3">
              <Input
                data-testid='exampleSelect'
                type="select"
                name="select"
                id="exampleSelect"
                className="form-control"
                onChange={(event) => {
                  setType(event.target.value);
                }}
              >
                <option>Select Month/Week</option>
                <option>Month</option>
                <option>Week</option>
              </Input>
            </div>
            <div className="date-picker-call">
              <Button
                color="primary"
                onClick={() => getList()}
              >
                Apply Filter
              </Button>
            </div>
          </Col>
        </Row>
        <Card className="list_wrapper justify-content-center">
          {showLoader && <Loader />}
          <CardHeader className="table-title">
            <CardTitle>Logs List</CardTitle>
          </CardHeader>
          <CardBody>
            <Table className="table-fill w-100 mb-5">
              <thead>
                <tr className="table-active">
                  <th className="cursor-pointer">
                    {type == "Month"
                      ? "Monthly Time-Range"
                      : "Weekly Time-Range"}
                  </th>
                  <th className="cursor-pointer">Total Duration</th>
                </tr>
              </thead>
              <tbody>
                {showLoader ? <TableLoadingText colSpan={8} /> : rangeItems}
              </tbody>
            </Table>
            <Table className="table-fill w-100">
              <thead>
                <tr className="table-active">
                  <th className="cursor-pointer">Task</th>
                  <th className="cursor-pointer">Date</th>
                  <th className="cursor-pointer">Start Time</th>
                  <th className="cursor-pointer">End Time</th>
                  <th className="cursor-pointer">Comment</th>
                  <th className="cursor-pointer">Duration</th>
                  <th className="cursor-pointer">Status</th>
                </tr>
              </thead>
              <tbody>
                {showLoader ? <TableLoadingText colSpan={8} /> : logItems}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default FilterLogs;
