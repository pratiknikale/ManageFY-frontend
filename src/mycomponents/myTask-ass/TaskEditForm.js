import {useEffect, useState} from "react";
import {css} from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import {Button, Form, Col, InputGroup, FormControl} from "react-bootstrap";
import {editItem} from "../../services/api";
import {updateEditedTask} from "../../features/todoTasks/tasksSlice";
import {updateEditedAssignTask} from "../../features/assignedTasks/assignedTaskSlice";
import {useSelector, useDispatch} from "react-redux";

// props - editID, Etask, setETask, EtaskEditIndex, handleClose, managerList

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
`;

const TaskEditForm = ({editID, Etask, setETask, EtaskEditIndex, handleClose}) => {
  const dispatch = useDispatch();

  //   useSelectors
  const allOrgUsers = useSelector((state) => state.user.allOrgUsers);
  // useSelectors

  const [saveEditTaskLoading, setSaveEditTaskLoading] = useState(false);
  const [employeeList, setEmployeeList] = useState([]); // manager list for assigned by field
  const [managerList, setManagerList] = useState([]); // manager list for assigned by field

  useEffect(() => {
    window.location.pathname === "/mytasks" && getManagerList();
    window.location.pathname === "/Assigned" && getEmployeeList();

    const resetOrgUserlist = () => {
      setEmployeeList([]);
      setManagerList([]);
    };

    return resetOrgUserlist;
  }, [allOrgUsers]);

  const getEmployeeList = () => {
    const employeeList = allOrgUsers.filter((filUser) => {
      return filUser.role === "employee";
    });
    // console.log(employeeList);
    setEmployeeList(employeeList);
  };

  const getManagerList = () => {
    const managerList = allOrgUsers.filter((filUser) => {
      return filUser.role === "manager";
    });
    // console.log(managerList);
    setManagerList(managerList);
  };

  const onEditChange = (e) => {
    e.preventDefault();

    if (["stask"].includes(e.target.name)) {
      let sub_tasks = [...Etask.sub_tasks];
      sub_tasks[e.target.id][e.target.name] = e.target.value;
      setETask({...Etask, sub_tasks});
    } else {
      setETask({...Etask, [e.target.name]: e.target.value});
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // console.log(Etask);
    setSaveEditTaskLoading(true);
    editItem(editID, Etask, window.location.pathname).then((result) => {
      window.location.pathname === "/mytasks"
        ? dispatch(updateEditedTask({result: result.data, EtaskEditIndex: EtaskEditIndex}))
        : dispatch(updateEditedAssignTask({result: result.data, EtaskEditIndex: EtaskEditIndex}));
      handleClose();
      setSaveEditTaskLoading(false);
      setETask({...Etask, taskName: "", discription: ""});
    });
  };

  const addNewEditFormSubTask = (event) => {
    event.preventDefault();
    setETask({...Etask, sub_tasks: [...Etask.sub_tasks, {status: "pending", stask: ""}]});
  };

  const delEditFormSubTask = (e, i) => {
    e.preventDefault();
    Etask.sub_tasks.splice(i, 1);
    setETask({sub_tasks: Etask.sub_tasks});
  };

  return (
    <Form onSubmit={(e) => handleEditSubmit(e)} onChange={(e) => onEditChange(e)}>
      <Form.Row>
        <Form.Group as={Col} md="12">
          <Form.Label>Task Name</Form.Label>
          <Form.Control
            name="task_name"
            defaultValue={Etask.task_name}
            required
            type="text"
            placeholder="Task Name"
            autoComplete="off"
            className="taskFormInputs"
          />
        </Form.Group>
        <Form.Group as={Col} md="12">
          <Form.Label>Discription</Form.Label>
          <Form.Control
            name="task"
            defaultValue={Etask.task}
            required
            type="text"
            placeholder="Discription"
            as="textarea"
            autoComplete="off"
            className="taskFormInputs"
          />
        </Form.Group>

        <Form.Group as={Col} md="12">
          <Form.Label>Sub tasks:</Form.Label>

          {Etask.sub_tasks.map((subtask, i) => {
            return (
              <InputGroup className="my-2" key={i}>
                <FormControl
                  id={`${i}`}
                  name="stask"
                  type="text"
                  defaultValue={subtask.stask}
                  required
                  placeholder="Task Name"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  autoComplete="off"
                  className="taskFormInputs"
                />
                <Button
                  style={{borderRadius: "0 20px 20px 0"}}
                  onClick={(e) => delEditFormSubTask(e, i)}
                  variant="outline-secondary"
                  id="button-addon2"
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </InputGroup>
            );
          })}
          <br />
          <Button variant="dark" style={{borderRadius: "20px"}} onClick={addNewEditFormSubTask}>
            <i className="far fa-plus-square mr-2"></i>Add new
          </Button>
        </Form.Group>
        <br />
        <Form.Group as={Col} md="12">
          <Form.Label>{window.location.pathname === "/mytasks" ? "Assigned By" : "Assign to"} :</Form.Label>
          <Form.Control
            className="taskFormInputs"
            as="select"
            name={window.location.pathname === "/mytasks" ? "assignedBy" : "assignto"}
            id={window.location.pathname === "/mytasks" ? "assignedBy" : "assignto"}
            placeholder={window.location.pathname === "/mytasks" ? "Assigned by" : "Assign to"}
            required
          >
            {window.location.pathname === "/mytasks" ? (
              <>
                <option></option>
                <option value="private">Private</option>
                {managerList.map((mlist, i) => (
                  <option value={mlist._id} key={mlist._id}>
                    {mlist.firstName} {mlist.lastName}
                  </option>
                ))}
              </>
            ) : (
              <>
                <option></option>
                {employeeList.map((elist, i) => (
                  <option value={elist._id} key={elist._id}>
                    {elist.firstName} {elist.lastName}
                  </option>
                ))}
              </>
            )}
          </Form.Control>
        </Form.Group>
      </Form.Row>
      {saveEditTaskLoading ? (
        <Button
          style={{float: "right", marginLeft: "0.8rem", display: "flex", alignItems: "center", borderRadius: "20px"}}
          disabled
          variant="success"
        >
          <ClipLoader loading={saveEditTaskLoading} speedMultiplier={2} color={"white"} css={btnoverride} size={17} />
          <i className="fas fa-save mr-2"></i>
          Saving...
        </Button>
      ) : (
        <Button style={{float: "right", marginLeft: "0.8rem", borderRadius: "20px"}} variant="success" type="submit">
          <i className="fas fa-save mr-2"></i>
          Save Changes
        </Button>
      )}
      <Button
        style={{float: "right", marginLeft: "0.8rem", borderRadius: "20px"}}
        variant="secondary"
        onClick={handleClose}
      >
        Close
      </Button>
    </Form>
  );
};

export default TaskEditForm;
