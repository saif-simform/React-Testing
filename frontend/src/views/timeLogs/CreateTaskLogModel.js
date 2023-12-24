import React, { useEffect, useState } from "react";
import {
  Form,
  FormGroup,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Col,
  Row,
} from "reactstrap";
import { Formik } from "formik";
import * as Yup from "yup";

import "flatpickr/dist/themes/dark.css";
import Flatpickr from "react-flatpickr";

import { LogService } from "../../services/api.service";
import { toast } from "react-toastify";
import moment from "moment";


const CreateTaskLogModal = ({
  onSave,
  onCancel,
  taskElelement,
  logsID = null,
}) => {
  const [formModal, setFormModal] = useState(false);

  const [logsFormValues, setLogsFormValues] = useState({
    date: "",
    startTime: 0,
    endTime: 0,
    comment: "",
  });
  const taskID = taskElelement.id;
  const taskName = taskElelement.taskName || taskElelement.task.taskName;
  useEffect(() => {
    if (logsID) {
      setLogsFormValues({
        ...taskElelement,
        startTime: new Date(taskElelement.startTime),
        endTime: new Date(taskElelement.endTime),
      });
    }
  }, [taskID]);

  const onSubmit = async (data) => {
    if (logsID) {
      try {
        data.date = moment(data.date).format("MM/DD/YYYY");
        data.startTime = data.startTime.toISOString();
        data.endTime = data.endTime.toISOString();
        data.task = data.task.id;
        data.status == "decline" ? (data.status = "pending") : data.status;
        delete data.id;
        delete data.duration;

        await LogService.edit(logsID, data);

        toast.info("Logs Edit Successfully");
        onSave();
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      try {
        data.status = "pending";
        data.startTime = data.startTime.toISOString();
        data.endTime = data.endTime.toISOString();
        data.task = taskID;
        await LogService.create(data);

        toast.info("Logs Created Successfully");
        onSave();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <>
      <Modal
        isOpen={true}
        toggle={() => setFormModal(!formModal)}
        className="modal-dialog-centered"
      >
        <ModalHeader toggle={() => onCancel()}>
          {" "}
          {logsID ? "Edit Logs" : "Add Logs"}
        </ModalHeader>
        <ModalBody>
          <Formik
            initialValues={logsFormValues}
            enableReinitialize={true}
            onSubmit={async (values) => {
              onSubmit(values);
            }}
            validationSchema={Yup.object().shape({
              date: Yup.date().required("Date required"),
              comment: Yup.string(),
            })}
          >
            {(props) => {
              const {
                values,
                errors,
                touched,
                handleSubmit,
                setFieldValue,
                handleChange,
                handleBlur,
              } = props;
              return (
                <>
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Label>Task Name</Label>
                      <Input
                        type="text"
                        name="taskName"
                        placeholder="Task name"
                        value={taskName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={"form-control"}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Comments</Label>
                      <Input
                        type="text"
                        name="comment"
                        placeholder="Comments"
                        value={values.comment}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={"form-control"}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Date</Label>
                      <Flatpickr
                        data-enable-date
                        options={{
                          dateFormat: "d-m-y",
                        }}
                        placeholder="Select end date"
                        value={values.date}
                        onChange={([date]) => {
                          setFieldValue(
                            "date",
                            date
                            // moment(date[0]).format("MM/DD/YYYY")
                          );
                        }}
                        className={`form-control ${
                          touched.date && errors.date ? "is-invalid" : ""
                        }`}
                      />
                      {touched.date && errors.date && (
                        <div className="invalid-feedback">{errors.date}</div>
                      )}
                    </FormGroup>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>Start Time</Label>
                          <Flatpickr
                            data-enable-time
                            options={{
                              noCalendar: true,
                              enableTime: true,
                              dateFormat: "h:i K",
                            }}
                            value={new Date(values.startTime)}
                            onChange={([startTime]) => {
                              setFieldValue("startTime", startTime);
                            }}
                            className={`form-control ${
                              touched.startTime && errors.startTime
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {touched.startTime && errors.startTime && (
                            <div className="invalid-feedback">
                              {errors.startTime}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Label>End Time</Label>
                          <Flatpickr
                            data-enable-time
                            options={{
                              noCalendar: true,
                              enableTime: true,
                              dateFormat: "h:i K",
                            }}
                            value={new Date(values.endTime)}
                            onChange={([endTime]) => {
                              setFieldValue(
                                "endTime",
                                endTime
                                // moment(endTime[0]).format("HH:mm:ss")
                              );
                            }}
                            className={`form-control ${
                              touched.endTime && errors.endTime
                                ? "is-invalid"
                                : ""
                            }`}
                          />
                          {touched.endTime && errors.endTime && (
                            <div className="invalid-feedback">
                              {errors.endTime}
                            </div>
                          )}
                        </FormGroup>
                      </Col>
                    </Row>

                    <ModalFooter>
                      <Button type="submit" color="primary">
                        {logsID ? "Save Changes" : "Add Logs"}
                      </Button>
                      <Button
                        color="secondary"
                        type="button"
                        onClick={() => onCancel()}
                      >
                        Cancel
                      </Button>
                    </ModalFooter>
                  </Form>
                </>
              );
            }}
          </Formik>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CreateTaskLogModal;
