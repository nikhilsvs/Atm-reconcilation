import React,{Component} from 'react';
import { useTable } from 'react-table';
import {Form,FormGroup,Input,Label,Button,Table,Modal,ModalBody,ModalHeader} from 'reactstrap';
import {baseUrl} from '../baseUrl';
import { CSVLink, CSVDownload } from "react-csv";
import {Link} from 'react-router-dom';


function RenderData({tabledata}){


    let headers = Object.keys(tabledata[0]);
    

    return(
        <Table striped bordered hover responsive>
            <thead>
                <tr>
                    {
                        headers.map((item)=>{
                            return(
                                <th>
                                    {item}
                                </th>
                            )
                        })
                    }
                </tr>
            </thead>
           <tbody>
           {
                tabledata.map((item)=>{
                    let temp = Object.values(item);
                    let x = temp.map((item)=>{
                        return(
                            <td>
                                {item}
                            </td>
                        );
                    })

                    return(
                        <tr>
                            {x}
                        </tr>
                    )
                })
            }
           </tbody>
            
        </Table>
    );

}

class Unreconciled extends Component{

    constructor(props){
        super(props);
        this.state={
            dbSelected:null,
            tableSelected:null,
            tables:[],
            tabledata:[],
            tablecols:[],
            isModalOpen:false,
            selectedData:null
        }
        this.loadTable = this.loadTable.bind(this);
        this.loadData = this.loadData.bind(this);
        this.tableInput = this.tableInput.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.loadCols = this.loadCols.bind(this);
    }
    loadCols(event){
        this.setState({
            tableSelected:event.target.value
        });

        fetch(baseUrl + `databases/atmrecon/tables/${event.target.value}/desc`)
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Error in Fetching data");
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((response)=>{

            let temp  = [];
            response.forEach((item)=>{
                temp.push(item.Field);
            })
            this.setState({
                tablecols:temp
            });
        })
        .catch((err)=>{
            alert(err.message);
        })

    }
    toggleModal(i){
        this.setState({
            isModalOpen:!this.state.isModalOpen,
            selectedData:i
        });
    }
    tableInput(event){
       
        this.setState({
            tableSelected:this.table.value
        });
    }
    loadData(event){

        alert("Load Data Triggered !!");
       
        let condition = `\`${this.col.value}\` between "${this.start.value}"  and "${this.end.value}" `;

        fetch(baseUrl + `getdata`,{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                condition:condition,
                db:`atmrecon`,
                tname:this.recontype.value
            })
        })
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Error in Fetching data");
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((response)=>{
            this.setState({
                tabledata:response
            });
        })
        .catch((err)=>{
            alert(err.message);
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

    componentDidMount(){

        fetch(baseUrl + "databases/atmrecon/tables")
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Error in Fetching data");
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((response)=>{
            this.setState({
                tables:response
            });
        })
        .catch((err)=>{
            alert(err.message);
        })
    }
    render(){

     
        const y = this.state.tables.map((item)=>{

            return(
                <option>
                    {Object.values(item)[0]}
                </option>
            )
        })
        return(
           <div className="container">
                <div className="row">
                   <div className="col-md-12">
                       <h2><strong>View UnReconciled Data</strong></h2>
                   </div>
               </div>
                   <Form onSubmit = {this.loadData}>
                       <FormGroup row>
                            <div className="col-md-3">
                                <Label htmlFor = "recontype">
                                    <strong>
                                        Reconcile Type
                                    </strong>         
                                </Label>
                                <Input type='select' name="recontype" id="recontype" innerRef={(input)=>this.recontype=input} 
                                    onChange = {(event)=>this.loadCols(event)}>
                                        {
                                            this.state.tables.map((item)=>{
                                                return(
                                                    <option>
                                                        {Object.values(item)[0]}
                                                    </option>
                                                )
                                            })
                                        }
                                        
                                </Input>
                            </div>
                            <div className="col-md-3">
                                <Label htmlFor = "col">
                                    <strong>
                                        Date col
                                    </strong>         
                                </Label>
                                <Input type='select' name="col" id="col" innerRef={(input)=>this.col=input} 
                                    >
                                    {
                                        this.state.tablecols.map((item)=>{
                                            return(
                                                <option>
                                                    {item}
                                                </option>
                                            )
                                            
                                        })
                                    }
                                </Input>
                            </div>
                            <div className="col-md-3">
                                <Label htmlFor = "start">
                                    <strong>
                                        From
                                    </strong>         
                                </Label>
                                <Input type='text' name="start" id="start" innerRef={(input)=>this.start=input} 
                                    />
                            </div>
                            <div className="col-md-3">
                                <Label htmlFor = "end">
                                    <strong>
                                        End
                                    </strong>         
                                </Label>
                                <Input type='text' name="end" id="end" innerRef={(input)=>this.end=input} 
                                    />
                            </div>      
                       </FormGroup>
                   </Form>
            
               <div className="row mt-2">
                   <div className="col-md-12">
                       <Button className="btn-block bg-dark" onClick={this.loadData}>
                           Load data
                       </Button>
                   </div>
               </div>
               <div className="row mt-2">

                    <div className="col-md-12">
                        {
                            this.state.tabledata.length>0
                            ?
                            <>
                            <CSVLink className="btn btn-outline btn-warning btn-block" data={this.state.tabledata}>Download report</CSVLink>
                            <RenderData tabledata = {this.state.tabledata}/>
                            </>
                            :
                            null
                        }
                   </div>
                   
                      
                 
               </div>
              
           </div>
        );
        
    }
}

export default Unreconciled;