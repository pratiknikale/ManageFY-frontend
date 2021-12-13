import { useEffect, useState } from 'react';
import { getList, deleteItem, insertItem, getEdit, editItem, updateStatus } from '../services/api';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import moment from 'moment';
import { css } from "@emotion/react";
import ClockLoader from "react-spinners/ClockLoader";
// import { Scrollbar } from "react-scrollbars-custom";

const initialCreateValue = {
    taskName: '',
    discription: '',
    subTask: [],
}

const initialEditValue = {
    task_name: '',
    task: '',
    sub_tasks: [{}],
}

const override = css`
  display: block;
  margin: 110px auto;
  
`;

const Todo = () => {
    
    const [lists, setList] = useState([]);
    const [editID, setEditID] = useState("");
    
    // const [validated, setValidated] = useState(false);
    const [task, setTask] = useState(initialCreateValue);
    const [Etask, setETask] = useState(initialEditValue);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = async (id) => {
        
        const response = await getEdit(id);
        setEditID(response.data._id);
        
        setETask(response.data);
        // console.log(Etask);
        setShow(true);
    }

    useEffect(() => {
        getAllList().then(() => {
            setLoading(false);
        });
    }, [])
    
    const getAllList = async () => {
        const response = await getList();
        // console.log(response.data);
        const revData = response.data.reverse();
        setList(revData);
    }

    const deleteitem = async (id) => {
        await deleteItem(id).then(
            async (result) => {
                getAllList();
            } 
        );
    }

    const onValueChange =  (e) =>{
        e.preventDefault();
        
        if(["status", "stask"].includes(e.target.name)){
            let subTask = [ ...task.subTask];
            subTask[e.target.id][e.target.name] = e.target.value; 
            setTask({ ...task, subTask });
        }else{
            setTask({ ...task, [e.target.name]: e.target.value });
            
        }
        
        // console.log(task);
    };

    const handleCreateSubmit =  (e) => {
        e.preventDefault();
        if(task.taskName === '' || task.discription === ''){
            alert("Enter valid Task and Task Name");
        }else{
            insertItem(task).then(
                () => {
                    getAllList().then(()=>{
                        setTask({ ...task, taskName: '', discription: '', });
                        setTask({ ...task, subTask :[]});
                        document.getElementById("discription").value="";
                        document.getElementById("taskName").value="";
                    });
                }
            );
        }
        // console.log(task);
        
        
        // getAllList();
    };


    const onEditChange =  (e) =>{
        e.preventDefault();

        if(["stask"].includes(e.target.name)){
            let sub_tasks = [ ...Etask.sub_tasks];
            sub_tasks[e.target.id][e.target.name] = e.target.value; 
            setETask({ ...Etask, sub_tasks });
        }else{
            setETask({ ...Etask, [e.target.name]: e.target.value });
            
        }

        // console.log(Etask);
    };

    const handleEditSubmit =  (e) => {
        e.preventDefault(); 
        editItem(editID, Etask).then(
            () => {
                getAllList().then( () => {
                    handleClose();
                    setETask({ ...Etask, taskName: '', discription: '', });
                    // console.log(Etask);
                } );
            }
        );
        
        // document.getElementById("discription").value="";
        // document.getElementById("taskName").value="";
    };


    const addSubTask = event => {
        event.preventDefault(); 
        setTask({ ...task, subTask :[...task.subTask, { status: "pending", stask: ""}]});
        // console.log(task);

    }

    const delSubTask = (e, i) => {
        e.preventDefault(); 
        task.subTask.splice(i, 1);
        setTask({subTask: task.subTask});
    }

    const addNewEditFormSubTask = event => {
        event.preventDefault(); 
        setETask({ ...Etask, sub_tasks :[...Etask.sub_tasks, { status: "pending", stask: ""}]});
        // console.log(Etask);

    }

    const delEditFormSubTask = (e, i) => {
        e.preventDefault(); 
        Etask.sub_tasks.splice(i, 1);
        setETask({sub_tasks: Etask.sub_tasks});
    }

    const toggleStatus = async (e, id, sTsk) => {     //REVISIT .......can be better
        
        if(sTsk[e.target.id].status === "pending"){
            
            let StatusNew = "done";
            let STaskNew = sTsk[e.target.id].stask;
            
            updateStatus(id, StatusNew, STaskNew ).then(() => {
                getAllList();
            });

        }else if(sTsk[e.target.id].status === "done"){

            let StatusNew = "pending";
            let STaskNew = sTsk[e.target.id].stask;
            
            updateStatus(id, StatusNew, STaskNew ).then(() => {
                getAllList();
            });

        }
        
    }
    return(
        
        // <Scrollbar style={{ width: "100%", height: "100%" }}>
        <Container fluid style={{marginBottom: "100px", height: "100%", maxWidth: "94%"}}>
            <h3 style={{textAlign: "center", marginTop: "40px", color: "white"}}>TASKS</h3>
            <hr style={{backgroundColor: "white", marginBottom: "40px", width: "70%"}}/>
            {
            loading ? <ClockLoader loading={loading} speedMultiplier={5} color={"white"} css={override} size={130} />
            
            :
            
            <Row>
             
                {
                    lists.map((list, i) =>(
                        
                        <Col key={i} xs={12} sm={12} md={12} lg={6} style={{marginBottom: "30px"}}>
                            <Card key={i} style={{borderStyle: "solid", borderWidth: "2px", borderRadius: "20px"}}>
                            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                            <Card.Body key={i}>
                                <Card.Title style={{backgroundColor: "#80808017", padding: "0.6rem"}}><h5 style={{display: "inline"}}>{list.task_name}</h5><span style={{float: "right"}}><strong style={{marginRight: "10px"}}>Created at:</strong>{moment(list.updated_at).fromNow()}</span></Card.Title>
                                <Card.Text as={Col}>
                                    <p><b>Discription:</b></p>
                                    <p>{list.task}</p>
                                
                                    <p><b>Status:</b></p>
                                <Table striped bordered hover>
                                <thead>
                                    <tr>
                                    
                                    <th>Sub Task</th>
                                    <th>Status</th>
                                    <th colSpan="2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.sub_tasks && 
                                    list.sub_tasks.length > [0] ?
                                    (
                                        list.sub_tasks.map((subTask, i) =>(
                                        
                                        <tr key={i}>
                                    
                                        <td>{subTask.stask}</td>
                                        <td className={`text-${subTask.status === "done" ? "success" : "warning"}`}>{subTask.status === "done" ? <i class="far fa-check-circle mr-2"></i> : <i class="fas fa-exclamation-circle mr-2"></i> }{subTask.status}</td>
                                        <td>
                                            <Button id={`${i}`} name="status" style={{float: "right"}} onClick={(e) => toggleStatus(e, list._id, list.sub_tasks)} variant={`${subTask.status === "done" ? "success" : "warning"}`} >Mark as {subTask.status === "done" ? "pending" : "done"}</Button>
                                        </td>
                                        </tr>
                                        
                                        ))
                                    )
                                    :
                                    <>
                                    <tr>
                                    
                                    <td colSpan="3" style={{textAlign: "center"}}>No Subtask Available</td>
                                    
                                    </tr>
                                    </>
                                    }
                                    
                                   
                                </tbody>
                                </Table>
                                </Card.Text>

                                <Button style={{marginRight: "0.8rem", float: "right"}} variant="danger" onClick={() => deleteitem(list._id)}>
                                    <i className="fas fa-trash"></i>
                                </Button>
                                <Button style={{marginRight: "0.8rem", float: "right"}} variant="primary" onClick={() => handleShow(list._id)}>
                                    <i className="far fa-edit"></i>
                                </Button>
                            </Card.Body>
                            </Card>
                        </Col>
                        
                        ))
                }

                        <Col xs={12} sm={12} md={12} lg={6} style={{marginBottom: "30px"}}>
                        <Accordion >
                        <Card style={{borderStyle: "solid", borderWidth: "2px", borderRadius: "20px"}}>
                            <Accordion.Toggle as={Card.Header} eventKey="0" style={{backgroundColor: "#28a745", color: "white"}}>
                            <h5 style={{display: "inline"}}>Add New Task</h5><span style={{float: "right"}}></span>
                            </Accordion.Toggle>
                            <Accordion.Collapse eventKey="0">
                            <Card.Body>
                            
                                <Form onSubmit={(e) => handleCreateSubmit(e)} onChange={(e) => onValueChange(e)}>
                                    <Form.Row>
                                        <Form.Group as={Col} md="12" >
                                                    
                                            <Form.Control id="taskName" name="taskName" required type="text" placeholder="Task Name"/>
                                            
                                        </Form.Group>
                                        <Form.Group as={Col} md="12" >
                                                        
                                            <Form.Control id="discription" name="discription" required type="text" placeholder="Discription" as="textarea" />
                                            
                                        </Form.Group>
                                        <p style={{width: "100%"}}>Add sub tasks:</p>

                                        {task.subTask.map((subtask, i) => {
                                        return(
                                            
                                            <InputGroup className="my-2" as={Col} md="12" key={i}>
                                                <FormControl
                                                id={`${i}`} 
                                                name="stask" 
                                                type="text"
                                                placeholder="Task Name"
                                                aria-label="Recipient's username"
                                                aria-describedby="basic-addon2"
                                                />
                                                <Button onClick={(e) => delSubTask(e, i)} variant="outline-secondary" id="button-addon2">
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </InputGroup>





                                            // <Form.Group as={Col} md="12" key={i} >
                                                    
                                            // <Form.Control id={`${i}`} name="stask" type="text" placeholder="Task Name"/>
                                            
                                            // </Form.Group>
                                            
                                        )})}
                                        <br/>
                                        <Button variant="light" onClick={addSubTask}><i className="far fa-plus-square mr-2"></i>Add</Button>
                                    </Form.Row>
                                            
                                    <Button style={{marginBottom: "15px", float: "right"}} variant="success"  type="submit">Create</Button>
                                </Form>
                                
                            </Card.Body>
                            </Accordion.Collapse>
                        </Card>
                        
                        </Accordion>
                        </Col>
                </Row>

            }
            
            
            <Modal size="lg" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form onSubmit={(e) => handleEditSubmit(e)} onChange={(e) => onEditChange(e)}>
                    <Form.Row>
                        <Form.Group as={Col} md="12">
                            <Form.Label>Task Name</Form.Label>                       
                            <Form.Control name="task_name" defaultValue={Etask.task_name} required type="text" placeholder="Task Name"/>
                            
                        </Form.Group>
                        <Form.Group as={Col} md="12">
                            <Form.Label>Discription</Form.Label>                          
                            <Form.Control name="task" defaultValue={Etask.task} required type="text" placeholder="Discription" as="textarea" />
                            
                        </Form.Group>
                        <Form.Group as={Col} md="12">
                        {/* <p style={{width: "100%"}}>Sub tasks:</p> */}
                        <Form.Label>Sub tasks:</Form.Label>        

                            {Etask.sub_tasks.map((subtask, i) => {
                            return(
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
                                                />
                                                <Button onClick={(e) => delEditFormSubTask(e, i)} variant="outline-secondary" id="button-addon2">
                                                    <i className="fas fa-trash"></i>
                                                </Button>
                                            </InputGroup>
                                




                                // <Form.Group as={Col} md="12" key={i} >
                                                    
                                // <Form.Control id={`${i}`} defaultValue={subtask.stask} name="stask" type="text" required placeholder="Task Name"/>

                                // </Form.Group>
                                
                                      
                            )})}
                            <Button variant="light" onClick={addNewEditFormSubTask}><i className="far fa-plus-square mr-2"></i>Add new</Button>
                            </Form.Group>
                    </Form.Row>
                                                
                    <Button style={{float: "right", marginLeft: "0.8rem"}} variant="success"  type="submit"><i className="fas fa-save mr-2"></i>Save Changes</Button>
                    <Button style={{float: "right", marginLeft: "0.8rem"}} variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                    </Form>
                    
                </Modal.Body>
                
            </Modal>
            </Container>
            
        // </Scrollbar>
            
        
    )
}


export default Todo;