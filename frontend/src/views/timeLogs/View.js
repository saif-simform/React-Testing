import React, { useEffect, useState } from "react";
import { ArrowLeft, Edit } from "react-feather";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Table,
  Button,
  Tooltip,
  Container,
  Badge,
} from "reactstrap";
import Loader from "../../components/Loader";
import {
  NoRecordsFound,
  TableLoadingText,
} from "../../components/TableLoadingText";
import { LogService } from "../../services/api.service";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../NavBar";
import moment from "moment";
import CreateTaskLogModal from "./CreateTaskLogModel";

const Logs = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showLoader, setShowLoader] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [totalDuration, setTotalDuration] = useState(0);
  const [taskElelement, setTaskElelement] = useState({});
  const [formModal, setFormModal] = useState(false);
  const [logsID, setLogsID] = useState(null);
  const [tooltipEditOpen, setTooltipEditOpen] = useState(false);
  const toggleEdit = () => setTooltipEditOpen(!tooltipEditOpen);
  const [toolTipBackButton, setTooltipBackButton] = useState(false);
  const toggleBack = () => setTooltipBackButton(!toolTipBackButton);

  useEffect(() => {
    if (id) {
      getByID();
    }
  }, [logsID]);

  const getByID = async () => {
    setShowLoader(true);
    try {
      const { data } = await LogService.getListByID(id);
      const duration =
        data.length > 0 &&
        data?.map((item) => item.duration)?.reduce((prev, next) => prev + next);
      setTotalDuration(duration);
      setDataList(data || []);
      setTaskName(data[0]?.task.taskName);
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
          <td className="text-center">
            {" "}
            {element.status == "pending" || element.status == "decline" ? (
              <>
                {" "}
                <Button id="TooltipView" color="primary" className="me-3">
                  <Edit
                    className="cursor-pointer"
                    size={20}
                    onClick={() => {
                      setTaskElelement(element);
                      setLogsID(element.id);
                      setFormModal(true);
                    }}
                  />
                </Button>
                <Tooltip
                  placement="top"
                  isOpen={tooltipEditOpen}
                  target="TooltipView"
                  toggle={toggleEdit}
                >
                  Edit
                </Tooltip>
              </>
            ) : (
              <>
                {" "}
                <Button
                  id="TooltipView"
                  color="primary"
                  className="me-3"
                  disabled={true}
                >
                  <Edit
                    className="cursor-pointer"
                    size={20}
                    onClick={() => {
                      setTaskElelement(element);
                      setLogsID(element.id);
                      setFormModal(true);
                    }}
                  />
                </Button>
                <Tooltip
                  placement="top"
                  isOpen={tooltipEditOpen}
                  target="TooltipView"
                  toggle={toggleEdit}
                >
                  Edit
                </Tooltip>
              </>
            )}
          </td>
        </tr>
      );
    });
  } else {
    listItems = <NoRecordsFound colSpan={8} />;
  }
  return (
    <>
      <NavBar />
      <Container fluid>
        <Card className="list_wrapper mt-4">
          {showLoader && <Loader />}
          <CardHeader className="table-title d-flex align-items-center">
            <div className="float-right me-2">
              <Button
                //   outline
                id="BackButton"
                color="primary"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft size={16} className="fonticon-wrap" />
              </Button>
              <Tooltip
                placement="top"
                isOpen={toolTipBackButton}
                target="BackButton"
                toggle={toggleBack}
              >
                Back
              </Tooltip>
            </div>
            <CardTitle className="me-4">Task: {taskName}</CardTitle>{" "}
            <CardTitle>Total Duration: {totalDuration}</CardTitle>{" "}
          </CardHeader>
          <CardBody>
            <Table className="table-fill w-100">
              <thead>
                <tr className="table-active">
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
            {formModal && (
              <CreateTaskLogModal
                taskElelement={taskElelement}
                logsID={logsID}
                onSave={() => {
                  setFormModal(false);
                  setTaskElelement(null);
                  setLogsID(null);
                }}
                onCancel={() => {
                  setFormModal(false);
                  setTaskElelement(null);
                  setLogsID(null);
                }}
              />
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  );
};

export default Logs;
