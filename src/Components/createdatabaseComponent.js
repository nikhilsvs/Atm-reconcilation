import React,{Component} from 'react';
import {Card,CardBody,Form,FormGroup,Input,Label,CardHeader,Button,Modal,ModalBody,ModalHeader} from 'reactstrap';
import {baseUrl} from '../baseUrl';
class Database extends Component{
    constructor(props){
        super(props);
        this.state={
            isModalOpen : false,
            dbSelected:null
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.onDbChange = this.onDbChange.bind(this);
        this.onRenameSubmit = this.onRenameSubmit.bind(this);
        this.onDeleteDb = this.onDeleteDb.bind(this);
    }
    toggleModal(){
        this.setState({
            isModalOpen:!this.state.isModalOpen
        });
    }
    onRenameSubmit(event){
        alert("OnRename Submit Triggered !!");
        var obj = {
            newname:this.newname.value
        };
        fetch(baseUrl + `databases/${this.state.dbSelected}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Origin':'http://localhost:3000'
            },
            body:JSON.stringify(obj)
        })
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Failed to Rename " + response.status + response.statusText);
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>{
            return response.json();
        })
        .then((res)=>{
            alert("Successfully Renamed !!!");
            this.props.fetchDatabases();
        })
        .catch((err)=>{
            alert(err.message);
        })

        event.preventDefault();
    }
    onDeleteDb(event){
        alert("OnDeleteDb Triggered !!");
        fetch(baseUrl + `databases/${this.state.dbSelected}`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json',
                'Origin':'http://localhost:3000'
            }
        })
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Failed to DELETE " + response.status + response.statusText);
                err.response = response;
                throw err;
            }
            },(error)=>{
                throw error;
            })
            .then((response)=>{
                return response.json();
            })
            .then((res)=>{
                alert("Successfully DELETED !!!");
                this.props.fetchDatabases();
            })
            .catch((err)=>{
                alert(err.message);
            })

            event.preventDefault();
    }
    onDbChange(event){
        this.setState({
            dbSelected:event.target.value
        });
        alert("DB SELECTED : " + event.target.value);
    }
    onSubmit(event){
        alert("Database : " + this.db.value);
        var obj = {};
        obj.database = this.db.value;
        fetch(baseUrl + 'databases',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Origin':'http://localhost:3000'
            },
            body:JSON.stringify(obj)
        })
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Error in Adding data " + response.status + response.statusText);
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((result)=>{
            alert("Database has been successfully created");
            this.props.fetchDatabases();
        })
        .catch((err)=>{
            alert("Sorry there was a error in adding record" + 
                "\n Error : " +  err.message);
        })
        event.preventDefault();
    }
    render(){

        return(
            <div className="container text-center align-self-center db">
                <div className="row line">
                    <div className="col-md-8 offset-md-2 mt-20">
                    <Card>
                        <CardHeader>
                            <strong>
                            New Database
                            </strong>
                        </CardHeader>
                        <CardBody>
                            <Form  onSubmit={this.onSubmit}>
                                <FormGroup row>
                                    <Label htmlFor="db">
                                        <strong>Database Name</strong>
                                    </Label>
                                    <Input type="text" name="db" id="db" placeholder="Enter Database Name"
                                        innerRef={(input)=>this.db=input}/>
                                        
                                </FormGroup>
                                <FormGroup row>
                                    <Button type="submit" className="btn-block bg-dark">
                                        Create Database
                                    </Button>
                                </FormGroup>
                            </Form>
                        </CardBody>
                    </Card>
                    </div>
                    
                </div>
                <div className="row modify-content">
                    <div className="col-md-6 text-center align-self-center leftSide">
                        <div className="inner" onClick={this.toggleModal}>
                            <h3>Modify Database</h3>
                        </div>
                    </div>
                    <div className="col-md-6 text-center align-self-center leftSide">
                        <div className="inner">
                            <h3>Modify Table</h3>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                            <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                            <ModalHeader toggle={this.toggleModal}>
                                <FormGroup row>
                                    <div className="col-md-12">
                                        <Label htmlFor = "modifyDB">
                                            <strong>Select Database</strong>
                                        </Label>
                                        <Input type="select" name="modifyDB" id="modifyDB" innerRef={(input)=>this.modifyDB=input}
                                        onChange={this.onDbChange}>
                                            {
                                                this.props.databases.map((x)=>{
                                                    return(
                                                        <option>
                                                            {Object.values(x)[0]}
                                                        </option>
                                                    )
                                                })
                                            }
                                        </Input>
                                    </div>
                                </FormGroup>
                            </ModalHeader>
                            <ModalBody>
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <Form onSubmit={this.onRenameSubmit}>
                                                <FormGroup row>
                                                    <Label htmlFor="newname">
                                                        <strong>Rename</strong>
                                                    </Label>
                                                    <Input type="text" name="newname" id="newname" placeholder="Enter New Name"
                                                    innerRef={(input)=>this.newname=input}/>
                                                </FormGroup>
                                                <FormGroup row>
                                                    <Button type="submit" className="btn-block bg-dark">
                                                        Submit
                                                    </Button>
                                                </FormGroup>
                                            </Form>
                                        </div>
                                        <div className="col-md-2 text-center align-self-center">
                                        <strong>Or</strong>
                                        </div>
                                        <div className="col-md-5 text-center align-self-center">
                                        <Button className="btn-block bg-dark" onClick={this.onDeleteDb}>
                                            DROP DATABASE
                                        </Button>
                                    </div>
                                    </div>
                                    
                                </div>
                            </ModalBody>
                        </Modal>
                    </div>
                </div>
               
            </div>
        )
    }
}

export default Database;