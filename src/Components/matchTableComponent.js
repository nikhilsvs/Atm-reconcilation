import React , { Component} from 'react';
import {Form, FormGroup,Label,Input,Button} from 'reactstrap';
import {baseUrl} from '../baseUrl';
import { CSVLink, CSVDownload } from "react-csv";

class Match extends Component{

    constructor(props){

        super(props);

        this.state={
            dbSelected:null,
            table1:null,
            table2:null,
            table1Desc:[],
            table2Desc:[],
            tables:[],
            matched:[],
            isLoading:true
        }
        this.loadTable = this.loadTable.bind(this);
        this.onTable1Change = this.onTable1Change.bind(this);
        this.onTable2Change = this.onTable2Change.bind(this);
        this.matchSubmit = this.matchSubmit.bind(this);

    }

    onTable1Change(event){
        this.setState({
           table1:event.target.value
        });
    
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
                table1Desc:response
            });

        })
        .catch((err)=>alert("Error : " + err.message))
    }
    onTable2Change(event){
        this.setState({
            table2:event.target.value
         });
     
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
                 table2Desc:response
             });
 
         })
         .catch((err)=>alert("Error : " + err.message))
    }
    matchSubmit(event){
        alert("Match Submit Triggered !!");
        var obj = {
            table1 : this.state.table1,
            table2:this.state.table2,
            col1:this.state.col1,
            col2:this.state.col2,
            db:this.state.dbSelected,
            type:this.type.value
        }
        alert(JSON.stringify(obj));
        fetch(baseUrl + 'match',{
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
                var err = new Error("Error in Matching " + response.status + response.statusText);
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((matchedData)=>{
            this.setState({
                matched:matchedData,
                isLoading:false
            });
            console.log(matchedData);
            alert("Report has been Successfullyy generated")
        })
        .catch((err)=>{
            alert(err);
        })
        event.preventDefault();
    }
    loadTable(event){
      
        this.setState({
            dbSelected:this.db.value
        })
        fetch(baseUrl + `databases/${this.db.value}/tables`)
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
                    <div className="col-md-6 offset-md-3">
                        <FormGroup row classnName="text-center align-self-center">
                            <Label htmlFor = "db">
                                <strong>Select Database</strong>
                            </Label>
                            <Input type="select" name="db" id="db" placeholder="Database" 
                            innerRef={(input)=>this.db=input} onChange={this.loadTable}>
                                {
                                    this.props.databases.map((item)=>{

                                        return(
                                            <option>
                                                {item.Database}
                                            </option>
                                        )
                                    })
                                }
                            </Input>
                        </FormGroup>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-5">
                        <FormGroup row>
                            <Label htmlFor = "table1">
                                <strong>Select Table 1</strong>
                            </Label>
                            <Input type="select" name="table1" id="table1" innerRef={(input)=>this.table1 = input}
                            onChange={this.onTable1Change}>
                                {
                                    this.state.tables.map((x)=>{
                                        var table= Object.values(x);
                                        return(
                                            <option>
                                                {table}
                                            </option>
                                        )
                                    })
                                }
                            </Input>
                            </FormGroup>
                            <FormGroup row>
                                <Label htmlFor = "col1">
                                    <strong>Select Column 1</strong>
                                </Label>
                                <Input type="select" name="col1" id="col1" innerRef={(input)=>this.col1 = input}
                                onChange={(event)=>this.setState({col1:event.target.value})}>
                                    {
                                        this.state.table1Desc.map((x)=>{
                                            var column= x.Field;
                                            return(
                                                <option>
                                                    {column}
                                                </option>
                                            )
                                        })
                                    }
                                </Input>
                            </FormGroup>
                        </div>
                        <div className="col-md-2">
                                <div className="vdivider"></div>
                        </div>
                        <div className="col-md-5">
                        <FormGroup row>
                            <Label htmlFor = "table2">
                                <strong>Select Table 2</strong>
                            </Label>
                            <Input type="select" name="table2" id="table2" innerRef={(input)=>this.table2 = input}
                            onChange={this.onTable2Change}>
                                {
                                    this.state.tables.map((x)=>{
                                        var table= Object.values(x);
                                        return(
                                            <option>
                                                {table}
                                            </option>
                                        )
                                    })
                                }
                            </Input>
                        </FormGroup>
                        <FormGroup row>
                                <Label htmlFor = "col2">
                                    <strong>Select Column 2</strong>
                                </Label>
                                <Input type="select" name="col2" id="col2" innerRef={(input)=>this.col2 = input} 
                                    onChange={(event)=>this.setState({col2:event.target.value})}>
                                    {
                                        this.state.table2Desc.map((x)=>{
                                            var column= x.Field;
                                            return(
                                                <option>
                                                    {column}
                                                </option>
                                            )
                                        })
                                    }
                                </Input>
                            </FormGroup>
                    </div>
                </div>
                <hr></hr>
                <div className="row">
                    <div className="col-md-12">
                    <Form onSubmit={this.matchSubmit}>
                        <FormGroup row>
                            <div className="col-md-6 offset-md-3">
                                <Label htmlFor="type"><strong>Select Type of Join</strong></Label>
                                <Input type = "select" name="type" id="type" placeholder="type" 
                                    innerRef={(input)=>this.type=input}>
                                        <option>INNER JOIN</option>
                                        <option>LEFT JOIN</option>
                                        <option>RIGHT JOIN</option>
                                    </Input>
                            </div>
                        </FormGroup>
                        <FormGroup row>
                            <div className="col-md-6 offset-md-3">
                                <Button type="submit" className="btn-block bg-dark">
                                    Match the records
                                </Button>
                            </div>
                        </FormGroup>
                    </Form>
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            {
                                this.state.isLoading == true
                                ?
                                <div>
                                 </div>

                                :
                                <CSVLink className="btn btn-outline btn-warning btn-block" data={this.state.matched}>Download report</CSVLink>
                            }
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Match;