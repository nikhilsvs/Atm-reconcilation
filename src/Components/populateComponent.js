import React,{Component} from 'react';
import {Form,FormGroup,Label,Input,Button,Card,CardBody,CardHeader,Nav,NavItem,NavLink,TabContent,TabPane} from 'reactstrap';
import {baseUrl} from '../baseUrl';
import classnames from 'classnames';


class Populate extends Component{
    constructor(props){
       super(props);

        this.state={
            entitySelected:null,
            formatSelected:null,
            tables:[],
          
            populatetype:null,
            tableDesc:[],
            tableData:{},
            fileName:null,
            activeTab:'1',
            fieldsPos : [],
          
            config_tableData:[]
        }
        this.handleEntity = this.handleEntity.bind(this);
        this.tableInfoSubmit = this.tableInfoSubmit.bind(this);
        this.enterDataFunction = this.enterDataFunction.bind(this);
        this.onManualSubmit = this.onManualSubmit.bind(this);
        this.onDataChange = this.onDataChange.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.onDelimitedSubmit = this.onDelimitedSubmit.bind(this);
        this.rawSubmit = this.rawSubmit.bind(this);
        this.onRawChange = this.onRawChange.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.submitConfiguration = this.submitConfiguration.bind(this);
        this.handleformat = this.handleformat.bind(this);
    }
    toggleTab(tab){
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab });
          }
    }
    onRawChange(event,idx){
        var a = this.state.fieldsPos;
        a[idx][event.target.name] = event.target.value;

        this.setState({
            fieldsPos:a
        });
    }
    rawSubmit(event){
        var fields = [];
        fetch(baseUrl + `databases/configuredtables/tables/${this.state.entitySelected}${this.state.formatSelected}_configured`)
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Error :" +response.status + response.statusText);
                err.response = response;
                throw response;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((result)=>{
           fields = result;
           console.log(fields);
           let tablename  = `${this.state.entitySelected}${this.state.formatSelected}`;
           var obj = {
            db:'atmrecon',
            tname:tablename,
            info:fields,
            filename:this.state.fileName
            };
        
           fetch(baseUrl + 'uploadByRaw',{
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
                    var err = new Error("Error : " + response.status + response.statusText);
                    err.response = response;
                    throw err;
                }
                },(error)=>{
                    throw error;
                })
                .then((result)=>{
                    alert("Data Uploaded");
                })
                .catch((err)=>{
                    alert("Error : " + err.message);
                })
        })
        .catch((err)=>{
            alert(err.message);
        })
        console.log("Outside fields");
        console.log(fields);
     
        
        event.preventDefault();
    }
    onDataChange(event,i){
        var field = event.target.name;
        var a = this.state.tableData;
        a[event.target.name] = event.target.value;
        
       this.setState({
           tableData:a
       });
    }
    onManualSubmit(event){
        var a = this.state.tableData;
        var data = [];
        data[0] = [];
        for(var x in a)
        {
           
            data[0].push(a[x]);
        }

       var obj = {
        values:data
    };
    alert("obj.values : " + obj.values);
        fetch(baseUrl + `databases/${this.state.dbSelected}/tables/${this.state.tableSelected}`,{
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
            alert("Record has been successfully added");
        })
        .catch((err)=>{
            alert("Sorry there was a error in adding record" + 
                "\n Error : " +  err.message);
        })
        event.preventDefault();
    }
    handleUpload(event)
    {
        alert("You have Selected : "+ event.target.files[0].name);
        this.setState({
            fileName:event.target.files[0].name
        })
        var formData = new FormData();
        formData.append('fileName',event.target.files[0]);
        fetch(baseUrl + 'fileupload',{
            method:'POST',
            headers:{
                'Origin':'http://localhost:3000'
            },
            credentials: "same-origin",
            body:formData
        })
        .then((response)=>response.json())
        .then((data)=>{
            alert("Your File has Been Uploaded" + 
                 "\n" + 
                 data)
        })
        .catch((error)=>console.log(error))
        event.preventDefault();
    }
    submitConfiguration(event){
        alert("submitSonfiguration Triggered !!");
        var obj = {
            fields:this.state.fieldsPos,
            db:'configuredTables',
            tname:this.state.tableSelected
        }
        alert(JSON.stringify(obj));
        fetch(baseUrl + 'configureTable',{
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
                var err = new Error("Error in Congiguring table : " + response.status + response.statusText);
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((result)=>{
            alert("Table successfully Congigured");
        })
        .catch((err)=>alert(err.message));
        event.preventDefault();
    }
    onDelimitedSubmit(event)
    {
        alert("On delimited Submit triggered");
        var obj = {
            delimiter:this.delimiter.value,
            file:this.state.fileName,
            db:'recon',
            tname:`${this.state.entitySelected}${this.state.formatSelected}`
        };

        alert(JSON.stringify(obj));
        fetch(baseUrl + 'uploadByDelimited',{
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
                var err = new Error("Error : " + response.status + response.statusText);
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((result)=>{
            alert("Data Uploaded");
        })
        .catch((err)=>{
            alert("Error : " + err.message);
        })
        event.preventDefault();
    }
    enterDataFunction(event){
        
       
        switch(this.state.populatetype){
            case 'Manually':
                
                    const x = this.state.tableDesc.map((temp,i)=>{
                        var type;
                        if(temp.Type=='int')
                        type="Number";
                        else
                        {
                            type="text";
                        }
                        return(
                            <div key = {i} className="col-md-6">
                            <FormGroup>
                                <Label htmlFor={temp.Field}><strong>{temp.Field}</strong></Label>
                                <Input type={type} name={temp.Field} id={temp.Field} placeholder={temp.Field} onChange={(event,i)=>this.onDataChange(event,i)}/>
                            </FormGroup>
                            </div>
                           
                        )
                    })
                    return(
                        <>
                        <Card>
                            <CardHeader>
                                <h2>Enter Data</h2>
                            </CardHeader>
                            <CardBody>
                                <Form onSubmit={this.onManualSubmit}>
                                    <div className="row">
                                        {x}
                                        <Button type="submit" className="btn-block bg-dark m-1">Submit</Button>
                                    </div>
                                    
                                </Form>
                            </CardBody>
                            
                        </Card>
                       
                        </>
                    )
                    break;
            case 'From Raw Data' : 
                    const y = this.state.fieldsPos.map((item,i)=>{

                        return(

                            <Card className="m-1">
                                <CardHeader>
                                    <FormGroup row>
                                        <div className="col-md-4 text-center align-self-center">
                                            <h3>{item.name}</h3>
                                        </div>
                                        <div className="col-md-4">
                                            <Label htmlFor = "start">
                                                <strong>Start Position</strong>
                                            </Label>
                                            <Input type="Number" name="start" id="start"
                                            placeholder="start" value={item.start} onChange={(event)=>this.onRawChange(event,i)}/>
                                        </div>
                                        <div className="col-md-4">
                                            <Label htmlFor = "endpos">
                                                <strong>End Position</strong>
                                            </Label>
                                            <Input type="Number" name="end" id="end" 
                                            placeholder="end" value={item.end} onChange={(event)=>this.onRawChange(event,i)}/>
                                        </div>
                                    </FormGroup>
                                </CardHeader>
                            </Card>
                        )
                    })
                    return(
                    <>
                        <div className="row">
                           <div className="col-md-12">
                           <Nav tabs>
                                <NavItem>
                                    <NavLink className={classnames({ active: this.state.activeTab === '1' })}
                                        onClick={() => {this.toggleTab('1'); }}>
                                            Already Configured
                                        </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className={classnames({ active: this.state.activeTab === '2' })}
                                        onClick={() => {this.toggleTab('2'); }}>
                                            Configure Table
                                        </NavLink>
                                </NavItem>
                           </Nav>
                           <TabContent activeTab={this.state.activeTab}>
                               <TabPane tabId='1'>
                                   <div className="row">
                                       <div className="col-md-12">
                                            <Card className="m-1">
                                                <CardBody>
                                                    <div className="row">
                                                    <div className="col-md-6">
                                                        <h4>Please Upload Required Raw Data File</h4>
                                                    </div>
                                                    <div className="col-md-6">
                                                    <FormGroup row>
                                                        <Label htmlFor = "filename">
                                                            <strong>Select File</strong>
                                                        </Label>
                                                        <Input type="file" name="filename" id="filename" placeholder="file" onChange={this.handleUpload}
                                                        innerRef={(input)=>this.filename = input}/>
                                                        </FormGroup>
                                                    </div>
                                                    </div>
                                                </CardBody>
                                            </Card>

                                       </div>
                                   </div>
                                   <div className="row">
                                       <div className="col-md-12">
                                        <Form onSubmit={this.rawSubmit}>
                                            <FormGroup row>
                                            
                                                <div className="col-md-6 mt-auto">
                                                    <Input type="submit" className="btn btn-outline-dark btn-block">
                                                        Upload Data
                                                    </Input>
                                                </div>
                                            </FormGroup>
                                               
                                        </Form>
                                       </div>   
                                   </div>
                               </TabPane>
                               <TabPane tabId='2'>
                                    <Form onSubmit={this.submitConfiguration}>
                                        {y}
                                        <FormGroup row>
                                            <Button type="submit" className="btn-block bg-dark">
                                                Submit
                                            </Button>
                                        </FormGroup>
                                    </Form>
                               </TabPane>
                           </TabContent>
                           
                           </div>
                           
                        </div>
                  
                    </>
                    );
                    break;
            case 'From Delimitted File':
                return(
                    <div className="container">
                    <div className="row">
                        <div className="col-md-8 offset-md-2">
                            <Card>
                                <CardHeader>
                                    <strong>
                                        Enter Data
                                    </strong>
                                </CardHeader>
                                <CardBody>
                                    <Form onSubmit={this.onDelimitedSubmit}>
                                        <FormGroup row>
                                            <div className="col-md-6">
                                            <Label htmlFor="delimiter"><strong>Delimiter</strong></Label>
                                            <Input type="select" name="delimiter" id="delimiter" innerRef={(input)=>this.delimiter=input}>
                                                <option>,</option>
                                                <option>:</option>
                                                <option>.</option>
                                                <option>|</option>
                                                <option>/\</option>
                                            </Input>
                                            </div>
                                            <div className="col-md-6">
                                                <Label htmlFor="filename" >
                                                    <strong>Choose File</strong>
                                                </Label>
                                                <Input type="file" name="filename" id="filename" onChange={this.handleUpload}
                                                innerRef={(input)=>this.filename = input}/>
                                            </div>
                                            
                                        </FormGroup>
                                        <FormGroup row>
                                            <div className="col-md-6">
                                                <Button type="submit" className="btn-block bg-dark">
                                                    Submit
                                                </Button>
                                            </div>
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
                )
                    
        }
       

    }
    tableInfoSubmit(event){
        this.setState({
            entitySelected:this.entity.value,
            formatSelected:this.format.value,
            populatetype:this.populateType.value
        });
    

        fetch(baseUrl + `databases/configuredTables/tables/${this.entity.value}${this.format.value}_configured`)
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Error in Fetching Tables : " + response.status + response.statusText);
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((response)=>{
                this.setState({
                    config_tableData:response
                });

                alert(JSON.stringify(response));
            })
            
        .catch((err)=>alert("Error : " + err.message))

        event.preventDefault();
    }
    handleEntity(event){
        
        this.setState({
            entitySelected:this.entity.value
        });

    }
    handleformat(event){
        this.setState({
            formatSelected:this.format.value
        });
    }
    render(){

        const x = this.props.entity.map((item)=>{
            return(
                <option>
                    {item.entity}
                </option>
            )
        })
        const y = this.props.format.map((item)=>{
            return(
                <option>
                    {item.format}
                </option>
            )
        })
        return(
            <div className="container">
                <div className="row">
                   <div className="col-md-12">
                       <h2><strong>Import Data</strong></h2>
                   </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Form onSubmit={this.tableInfoSubmit}>
                            <FormGroup row>
                                <div className="col-md-4">
                                    <Label htmlFor="entity"><strong>Select Entity</strong></Label>
                                    <Input type="select" name="entity" id="entity" placeholder="Select entity" 
                                    innerRef={(input)=>this.entity=input} onChange={this.handleEntity}>
                                        {x}
                                    </Input>
                                </div>
                                <div className="col-md-4">
                                    <Label htmlFor="format"><strong>Select format</strong></Label>
                                    <Input type="select" name="format" id="format" placeholder="Select format" 
                                    innerRef={(input)=>this.format=input} onChange={this.handleformat}>
                                        {y}
                                    </Input>
                                </div>
                                
                                <div className="col-md-2">
                                    <Label htmlFor="populateType"><strong>Select Type</strong></Label>
                                    <Input type="select" name="populatetype" id="populateType" placeholder="populateType" innerRef={(input)=>this.populateType=input}>
                                        <option>Manually</option>
                                        <option>From Raw Data</option>
                                        <option>From Delimitted File</option>
                                    </Input>
                                </div>
                                <div className="col-md-2 text-center align-self-center mt-auto mb-1">
                                    <Button type="submit" className="btn-block bg-dark">Proceed</Button>
                                </div>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                       {this.enterDataFunction()}
                    </div>
                </div>
            </div>
        )
    }
}

export default Populate;