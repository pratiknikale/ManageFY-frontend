import {useState} from "react";
import ClipLoader from "react-spinners/ClipLoader";
import {Button, Col, Form, InputGroup, FormControl} from "react-bootstrap";
import {insertNewTask} from "../../services/api";
import {useSelector, useDispatch} from "react-redux";
import {addNewCreatedTask} from "../../features/todoTasks/tasksSlice";
import {addNewAssignedTask} from "../../features/assignedTasks/assignedTaskSlice";
import {css} from "@emotion/react";
import {useEffect} from "react";

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
`;

const NewTaskForm = ({initialCreateValue}) => {
  const dispatch = useDispatch();

  // useSelectors start
  const allOrgUsers = useSelector((state) => state.user.allOrgUsers);
  // useSelectors end

  // useState start
  const [employeeList, setEmployeeList] = useState([]); // manager list for assigned by field
  const [managerList, setManagerList] = useState([]); // manager list for assigned by field
  const [task, setTask] = useState(initialCreateValue); // create task form values
  const [createTaskLoading, setCreateTaskLoading] = useState(false);
  // useState end

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

  const onValueChange = (e) => {
    e.preventDefault();

    if (["status", "stask"].includes(e.target.name)) {
      let subTask = [...task.subTask];
      subTask[e.target.id][e.target.name] = e.target.value;
      setTask({...task, subTask});
    } else {
      setTask({...task, [e.target.name]: e.target.value});
    }
  };

  const delSubTask = (e, i) => {
    e.preventDefault();
    task.subTask.splice(i, 1);
    setTask({subTask: task.subTask});
  };

  const addSubTask = (event) => {
    event.preventDefault();
    setTask({...task, subTask: [...task.subTask, {status: "pending", stask: ""}]});
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (task.taskName === "" || task.discription === "") {
      alert("Enter valid Task and Task Name");
    } else if (task.assignto === "") {
      alert("Select valid user to assign task to");
    } else {
      setCreateTaskLoading(true);
      insertNewTask(task, window.location.pathname).then((newTask) => {
        window.location.pathname === "/mytasks"
          ? dispatch(addNewCreatedTask(newTask.data))
          : dispatch(addNewAssignedTask(newTask.data));
        setTask({...task, taskName: "", discription: "", subTask: []});
        setCreateTaskLoading(false);
        document.getElementById("discription").value = "";
        document.getElementById("taskName").value = "";
        window.location.pathname === "/mytasks"
          ? (document.getElementById("assignedBy").value = "")
          : (document.getElementById("assignto").value = "");
        window.scrollTo({top: 0, left: 0});
      });
    }
  };

  return (
    <Form onSubmit={(e) => handleCreateSubmit(e)} onChange={(e) => onValueChange(e)}>
      <Form.Row>
        <Form.Group as={Col} md="12">
          <Form.Control
            className="taskFormInputs"
            id="taskName"
            name="taskName"
            required
            type="text"
            placeholder="Task Name"
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group as={Col} md="12">
          <Form.Control
            className="taskFormInputs"
            id="discription"
            name="discription"
            required
            type="text"
            placeholder="Discription"
            as="textarea"
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group as={Col} md="12">
          <Form.Label style={{color: "grey"}}>Add sub tasks:</Form.Label>
          {/* <p style={{width: "100%"}}>Add sub tasks:</p> */}

          {task.subTask.map((subtask, i) => {
            return (
              <InputGroup className="my-2" as={Col} md="12" key={i}>
                <FormControl
                  id={`${i}`}
                  className="taskFormInputs"
                  name="stask"
                  type="text"
                  placeholder="Task Name"
                  aria-label="Recipient's username"
                  aria-describedby="basic-addon2"
                  autoComplete="off"
                  required
                />
                <Button
                  onClick={(e) => delSubTask(e, i)}
                  variant="outline-secondary"
                  id="button-addon2"
                  style={{borderRadius: "0 20px 20px 0"}}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </InputGroup>
            );
          })}
          <br />
          <Button variant="dark" style={{borderRadius: "20px"}} onClick={addSubTask}>
            <i className="far fa-plus-square mr-2"></i>Add
          </Button>
        </Form.Group>
        <br />
        <Form.Group as={Col} md="12">
          <Form.Label style={{color: "grey"}}>
            {window.location.pathname === "/mytasks" ? "Assigned By" : "Assign to"}:
          </Form.Label>
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
                <option disabled>Select Assignee</option>
                <option value="private">Private</option>
                {managerList.map((mlist, i) => (
                  <option value={mlist._id} key={mlist._id}>
                    {mlist.firstName} {mlist.lastName}
                  </option>
                ))}
              </>
            ) : (
              <>
                <option selected disabled>
                  Select
                </option>
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
      {createTaskLoading ? (
        <Button
          style={{
            marginBottom: "15px",
            float: "right",
            display: "flex",
            alignItems: "center",
            borderRadius: "20px",
            color: "green",
          }}
          variant="dark"
          type="submit"
          disabled
        >
          <ClipLoader loading={createTaskLoading} speedMultiplier={2} color={"white"} css={btnoverride} size={17} />
          Creating...
        </Button>
      ) : (
        <Button
          style={{
            marginBottom: "15px",
            float: "right",
            borderRadius: "20px",
            color: "white",
            borderStyle: "hidden",
          }}
          variant="secondary"
          type="submit"
        >
          Create
        </Button>
      )}
    </Form>
  );
};

export default NewTaskForm;
