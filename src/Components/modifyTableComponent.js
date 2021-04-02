import React , {Component} from 'react';
import {Form,FormGroup,Input,Label,TabContent,TabPane,NavItem,NavLink,Nav,Row,Col,Button} from 'reactstrap';
import {baseUrl} from '../baseUrl';
import classnames from 'classnames';

class ModifyTable extends Component{

    constructor(props){
        super(props);

        this.state = {
            dbSelected:null,
            tables:[],
            tableDesc:[],
            tableSelected:null,
            activeTab:'1',
            splitCol:null,
            dtype:null
        }

        this.onDbChange = this.onDbChange.bind(this);
        this.onTableChange = this.onTableChange.bind(this);
        this.toggleTab = this.toggleTab.bind(this);
        this.RenameTable = this.RenameTable.bind(this);
        this.deleteTable = this.deleteTable.bind(this);
        this.splitSubmit = this.splitSubmit.bind(this);
    }
    splitSubmit(event){
        alert("split Submit Triggered !!");
        var datatype = this.state.tableDesc.filter((x)=>x.Field == this.state.splitCol)[0].Type.split('(')[0];
        alert("DType : " + datatype);
        var obj = {
            splitCol:this.state.splitCol,
            db:this.state.dbSelected,
            tname:this.state.tableSelected,
            newCol:this.newCol.value,
            startPos:this.startPos.value,
            endPos:this.endPos.value,
            len:this.len.value,
            dtype:datatype
        }
        alert(JSON.stringify(obj));
        console.log(JSON.stringify(obj));
        fetch(baseUrl + 'splitColumn',{
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
                var err = Error("Error in Splitting : " + response.status + response.statusText);
                err.response = err;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((result)=>{
            alert("Successfully Spliited the column");
        })
        .catch((err)=>{
            alert(err.message);
        })
       
        event.preventDefault();
    }
    deleteTable(event){
        alert("Delete Table Triggered !!");
        fetch(baseUrl + `databases/${this.state.dbSelected}/tables/${this.state.tableSelected}`,{
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
                var err = new Error("Error in Deleting Table : " + response.status + response.statusText);
                err.response = response;
                throw err;
            }
        })
        .then((response)=>response.json())
        .then((response)=>{
              alert("Table Successfully DELETED !!");
            })
        .catch((err)=>alert("Error : " + err.message))
    }
    RenameTable(event){
        alert("Rename Table Triggered !!");
        var obj = {
            newname:this.newname.value
        }
        fetch(baseUrl + `databases/${this.state.dbSelected}/tables/${this.state.tableSelected}`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
                'Origin':'http://localhost:3000'
            },
            body:JSON.stringify(obj)
        })
        alert("Rename Table Successful !!");
    }
    toggleTab(tab){
        if (this.state.activeTab !== tab) {
            this.setState({ activeTab: tab });
          }
    }
    onTableChange(event){
        this.setState({
            tableSelected:event.target.value
        })
        fetch(baseUrl + `databases/${this.state.dbSelected}/tables/${event.target.value}/desc`)
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
                    tableDesc:response
    
                });
            })
        .catch((err)=>alert("Error : " + err.message))
    }
    onDbChange(event){
        this.setState({
            dbSelected:event.target.value
        });

        alert("DB Selected : " + event.target.value);
        fetch(baseUrl + `databases/${event.target.value}/tables`)
        .then((response)=>{
            if(response.ok){
                return response;
            }
    
            else{
                var err = new Error("Databases fetching Failed " + response.status + response.statusText);
                err.response = err;
                return err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((tables)=>{
            this.setState({
                tables:tables
            })
        })
    }
    render()
    {
        return(
           <div className="container">
               <div className="row">
                   <div className="col-md-5">
                       <FormGroup row>
                           <Label htmlFor="db">
                               <strong>
                                   Select Database
                               </strong>
                           </Label>
                           <Input type="select" name="db" id="db" innerRef={(input)=>this.db=input} 
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
                       </FormGroup>
                   </div>
                   <div className="col-md-5 offset-md-2">
                       <FormGroup row>
                           <Label htmlFor="tname">
                               <strong>
                                   Select Table
                               </strong>
                           </Label>
                           <Input type="select" name="tname" id="tname" innerRef={(input)=>this.tname=input} 
                            onChange={this.onTableChange}>
                               {
                                   this.state.tables.map((x)=>{
                                       return(
                                           <option>
                                               {Object.values(x)[0]}
                                           </option>
                                       )
                                   })
                               }
                           </Input>
                       </FormGroup>
                   </div>
               </div>
               <div className="row">
                   <div className="col-md-12">
                       <Nav tabs>
                           <NavItem>
                               <NavLink className={classnames({ active: this.state.activeTab === '1' })}
                                onClick={() => {this.toggleTab('1'); }}>
                                    Rename
                                </NavLink>
                           </NavItem>
                           <NavItem>
                               <NavLink className={classnames({ active: this.state.activeTab === '2' })}
                                onClick={() => {this.toggleTab('2'); }}>
                                    Drop
                                </NavLink>
                           </NavItem>
                           <NavItem>
                               <NavLink className={classnames({ active: this.state.activeTab === '3' })}
                                onClick={() => {this.toggleTab('3'); }}>
                                    Split Column
                                </NavLink>
                           </NavItem>
                           </Nav>
                           <TabContent activeTab={this.state.activeTab}>
                               <TabPane tabId='1'>
                                   <div className="row">
                                       <div className="col-md-12">
                                           <Form onSubmit={this.RenameTable}>
                                                <FormGroup>
                                                    <Label htmlFor="newname">
                                                        <strong>Enter New Name</strong>
                                                    </Label>
                                                    <Input type="text" name="newname" id='newname' placeholder="Enter New Name"
                                                    innerRef={(input)=>this.newname=input}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Button type="submit" className="btn-block bg-dark">
                                                        Rename
                                                    </Button>
                                                </FormGroup>
                                           </Form>
                                       </div>
                                   </div>
                               </TabPane>
                               <TabPane tabId='2'>
                                   <a className="btn btn-outline-danger btn-lg" onClick={this.deleteTable}>
                                       Delete Table
                                   </a>
                               </TabPane>
                               <TabPane tabId='3'>
                                  <div className="row">
                                      <div className="col-md-6 offset-md-3">
                                           <FormGroup>
                                            <Label htmlFor="colname">
                                                        <strong>Select Column to split</strong>
                                                    </Label>
                                                    <Input type="select" name="colname" id="colname" 
                                                    innerRef={(input)=>this.colname= input} onChange={(event)=>this.setState({splitCol:event.target.value})}>
                                                        {
                                                            this.state.tableDesc.map((x)=>{
                                                                return(
                                                                    <option>
                                                                        {x.Field}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </Input>
                                    
                                           </FormGroup>
                                               
                                      </div>
                                  </div>
                                  <div className="row">
                                      <div className="col-md-12">
                                          <Form onSubmit={this.splitSubmit}>
                                                <FormGroup row>
                                                    <div className="col-md-6">
                                                        <Label htmlFor="newCol">
                                                            <strong>New Column Name</strong>
                                                        </Label>
                                                        <Input type="text" name="newCol" id="newCol" placeholder="New Column Name"
                                                        innerRef={(input)=>this.newCol=input}/>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <Label htmlFor="startPos">
                                                                <strong>Starting Position</strong>
                                                            </Label>
                                                            <Input type="Number" name="startPos" id="startPos" placeholder="Starting Position"
                                                            innerRef={(input)=>this.startPos=input}/>
                                                
                                                        </div>
                                                        
                                                        <div className="col-md-2">
                                                        
                                                                <Label htmlFor="endPos">
                                                                    <strong>Ending Position</strong>
                                                                </Label>
                                                                <Input type="Number" name="endPos" id="endPos" placeholder="Ending position"
                                                                innerRef={(input)=>this.endPos=input}/>
                                                        
                                                        </div>
                                                        <div className="col-md-2">
                                                        
                                                        <Label htmlFor="len">
                                                            <strong>Length</strong>
                                                        </Label>
                                                        <Input type="Number" name="len" id="len" placeholder="Length"
                                                        innerRef={(input)=>this.len=input}/>
                                                
                                                </div>
                                                </FormGroup>
                                                <FormGroup>
                                                    <div className="col-md-12">
                                                        <Input type="submit" className="btn btn-outline-dark btn-block">
                                                            Create Column
                                                        </Input>
                                                    </div>
                                                    
                                                </FormGroup>
                                          </Form>
                                        
                                      </div>
                                   
                                  </div>
                               </TabPane>
                           </TabContent>
                       
                   </div>
               </div>
           </div>
        )
    }
}

export default ModifyTable;