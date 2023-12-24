import React, { useEffect, useState } from "react";
import { Check, X } from "react-feather";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Table,
  Button,
  Badge,
  Container,
  Tooltip,
} from "reactstrap";
import Loader from "../../components/Loader";
import {
  NoRecordsFound,
  TableLoadingText,
} from "../../components/TableLoadingText";
import { LogService } from "../../services/api.service";
import { toast } from "react-toastify";
import moment from "moment";

const List = () => {
  const [showLoader, setShowLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [tooltipApproved, setTooltipApproved] = useState(false);
  const [tooltipDecline, setTooltipDecline] = useState(false);
  const toggleApproved = () => setTooltipApproved(!tooltipApproved);
  const toggleDecline = () => setTooltipDecline(!tooltipDecline);

  useEffect(() => {
    getByID();
  }, []);

  const getByID = async () => {
    setShowLoader(true);
    try {
      const { data } = await LogService.getList();

      setDataList(data || []);
    } catch (error) {
      setDataList([]);
      toast.error(error.message);
    } finally {
      setShowLoader(false);
    }
  };

  const onChangeRequest = async (id, reqSlug) => {
    setShowLoader(true);
    try {
      await LogService.editStatus(id, reqSlug);
      if (reqSlug === "approved") {
        toast.success("Approved successfully");
      } else {
        toast.error("Request decline");
      }
      setDataList(
        dataList.map((obj) => {
          if (id === obj.id) {
            obj.status = reqSlug;
          }
          return obj;
        })
      );
    } catch (error) {
      setDataList([]);
      toast.error(error.message);
    } finally {
      setShowLoader(false);
    }
  };

  let listItems;
  if (dataList.length > 0) {
    listItems = dataList.map((element, index) => {
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
          {element.status == "pending" ? (
            <td className="text-left" width={200}>
              {" "}
              <Button id="TooltipApproved" color="primary" className="me-3">
                <Check
                  data-testid='check'
                  className="cursor-pointer"
                  size={20}
                  onClick={() => onChangeRequest(element.id, "approved")}
                />
              </Button>
              <Tooltip
                placement="top"
                isOpen={tooltipApproved}
                target="TooltipApproved"
                toggle={toggleApproved}
              >
                Approve
              </Tooltip>
              <Button id="TooltipEdit" color="primary">
                <X
                  data-testid='cancel'
                  className="cursor-pointer"
                  size={20}
                  onClick={() => onChangeRequest(element.id, "decline")}
                />
              </Button>
              <Tooltip
                placement="top"
                isOpen={tooltipDecline}
                target="TooltipEdit"
                toggle={toggleDecline}
              >
                Reject
              </Tooltip>
            </td>
          ) : (
            <td className="text-left" width={200}>
              {" "}
              <Button
                id="TooltipApproved"
                color="primary"
                className="me-3"
                disabled={true}
              >
                <Check className="cursor-pointer" size={20} />
              </Button>
              <Tooltip
                placement="top"
                isOpen={tooltipApproved}
                target="TooltipApproved"
                toggle={toggleApproved}
              >
                Approve
              </Tooltip>
              <Button id="TooltipEdit" color="primary" disabled={true}>
                <X className="cursor-pointer" size={20} />
              </Button>
              <Tooltip
                placement="top"
                isOpen={tooltipDecline}
                target="TooltipEdit"
                toggle={toggleDecline}
              >
                Reject
              </Tooltip>
            </td>
          )}
        </tr>
      );
    });
  } else {
    listItems = <NoRecordsFound colSpan={8} />;
  }
  return (
    <>
      <Container fluid>
        <Card className="list_wrapper mt-4">
          {showLoader && <Loader />}
          <CardHeader>
            <CardTitle>Logs List</CardTitle>{" "}
          </CardHeader>

          <CardBody>
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
                  <th className="cursor-pointer">Action</th>
                </tr>
              </thead>
              <tbody>
                {showLoader ? <TableLoadingText colSpan={8} /> : listItems}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default List;
