import {useState, useEffect} from "react";
import {Button, Container, Form, Table, FormControl, Modal} from "react-bootstrap";
// import {useNavigate} from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import {getEmployeeList, getEditUser, EditUser, DeleteUser, SearchUser} from "../services/api";
import {css} from "@emotion/react";
import UserEdit from "../mycomponents/UserEdit";

const btnoverride = css`
  display: inline-block;
  margin-right: 6px;
`;

const initialUserEditValue = {
  id: "",
  firstName: "",
  lastName: "",
  role: "",
};

const ManageEmployee = () => {
  // const navigate = useNavigate();
  const [isNewEmployeeLoadingList, setIsNewEmployeeLoadingList] = useState(true);
  const [employeeList, setEmployeeList] = useState([]);
  const [saveEditUserLoading, setSaveEditUserLoading] = useState(false);
  const [editUser, setEditUser] = useState(initialUserEditValue);
  const [show, setShow] = useState(false);
  const [SearchField, setSearchField] = useState(false);

  useEffect(() => {
    getAllEmployeeList().then(() => {
      setIsNewEmployeeLoadingList(false);
    });

    window.scrollTo({top: 0, left: 0});
  }, []);

  const getAllEmployeeList = async () => {
    const response = await getEmployeeList();
    // const revData = response.data.reverse();
    setEmployeeList(response.data);
    // console.log(response.status);
  };

  const handleClose = () => setShow(false);

  const handleShow = async (id) => {
    const response = await getEditUser(id);

    setEditUser(response.data);
    // console.log(response.data);
    setShow(true);
  };

  const onUserEditChange = (e) => {
    e.preventDefault();

    setEditUser({...editUser, [e.target.name]: e.target.value});
  };

  const handleUserEditSubmit = (e) => {
    e.preventDefault();
    setSaveEditUserLoading(true);
    EditUser(editUser).then(() => {
      getAllEmployeeList().then(() => {
        handleClose();
        setSaveEditUserLoading(false);
      });
    });
  };

  const deleteUser = async (id, i) => {
    var answer = window.confirm("Are you sure? All the data for selected user will also be deleted");
    if (answer) {
      await DeleteUser(id).then(() => {
        getAllEmployeeList();
      });
    }
  };

  const onSearchChange = async (e) => {
    const searchValue = e.target.value;
    searchValue.length > 0 ? setSearchField(true) : setSearchField(false);
    const SearchRole = e.target.name;
    const {data} = await SearchUser(searchValue, SearchRole);
    setEmployeeList(data);
  };

  const RestoreSearchResults = async () => {
    let SearchField = document.getElementById("SearchField");
    let SearchFieldName = document.getElementById("SearchField").name;
    SearchField.value = "";
    setSearchField(false);
    const {data} = await SearchUser("", SearchFieldName);
    setEmployeeList(data);
  };

  return (
    <>
      <h4 style={{marginTop: "25px", marginBottom: "25px", marginLeft: "25px", color: "white"}}>
        Employee Management Section
      </h4>

      <Container fluid style={{marginBottom: "170px", paddingLeft: "65px", paddingRight: "65px", flex: "1 0 auto"}}>
        <div className="my-2">
          <Form inline style={{display: "inline-flex"}}>
            <FormControl
              onChange={(e) => onSearchChange(e)}
              id="SearchField"
              name="employee"
              type="text"
              placeholder="Search"
              style={{
                width: "400px",
                borderRadius: "20px",
                backgroundColor: "#343a40",
                borderStyle: "hidden",
                color: "white",
              }}
              className="mr-sm-2"
              autoComplete="off"
            />
            {SearchField && (
              <span
                id="clearSearch"
                style={{color: "grey", cursor: "pointer", marginLeft: "-36px"}}
                onClick={() => RestoreSearchResults()}
              >
                <b>X</b>
              </span>
            )}
          </Form>
          {/* <Button className="float-right" variant="outline-light">
            Create new employee profile
          </Button>{" "} */}
        </div>
        <Table bordered hover variant="dark">
          <thead>
            <tr>
              <th style={{width: "12%"}}>#</th>
              <th style={{width: "38%"}}>Employee Name</th>
              <th style={{width: "20%"}}>Role</th>
              <th style={{width: "32%"}}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isNewEmployeeLoadingList ? (
              <tr>
                <td colSpan="3" style={{textAlign: "center"}}>
                  <ClipLoader
                    loading={isNewEmployeeLoadingList}
                    speedMultiplier={2}
                    color={"white"}
                    css={btnoverride}
                    size={25}
                  />
                </td>
              </tr>
            ) : (
              <>
                {employeeList.map((EList, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      {EList.firstName} {EList.lastName}
                    </td>
                    <td>{EList.role}</td>
                    <td>
                      <Button
                        className="float-right mx-2"
                        variant="outline-danger"
                        onClick={() => deleteUser(EList._id, i)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                      <Button className="float-right mx-2" variant="primary" onClick={() => handleShow(EList._id)}>
                        <i className="far fa-edit"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </Table>

        <UserEdit
          show={show}
          handleClose={handleClose}
          btnoverride={btnoverride}
          handleUserEditSubmit={handleUserEditSubmit}
          onUserEditChange={onUserEditChange}
          editUser={editUser}
          saveEditUserLoading={saveEditUserLoading}
        />
      </Container>
    </>
  );
};

export default ManageEmployee;
