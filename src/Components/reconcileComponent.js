import React , {Component} from 'react';
import {baseUrl} from '../baseUrl';
import {Form,Input,InputGroup,Label,Button,Modal,ModalBody,ModalHeader,FormGroup} from 'reactstrap';
import { CSVLink, CSVDownload } from "react-csv";
class ReconcileData extends Component{

    constructor(props){
        super(props);

        this.state = {
            mappingData : [],
            table1:[],
            table2:[],
            file1:null,
            file2:null
        }

        this.onTable1Selected = this.onTable1Selected.bind(this);
        this.handleReconcileSubmit = this.handleReconcileSubmit.bind(this);
    }
    handleReconcileSubmit(event){

        let finalMapping = this.state.mappingData.filter((item)=>{
            return item.file1 == this.file1.value && item.file2 == this.file2.value
        });

       
        let obj = {
            cols:[],
            exactMatchh : null
        };

        
        finalMapping.forEach((item)=>{
            let temp = {
                col1:item.col1,
                col2:item.col2,
                matchh:item.matchh
            };
           
            if(item.matchh == 'Y')
            {
                obj.exactMatchh = temp;
            }
            obj.cols.push(temp);
        });

        obj.amap1 = finalMapping[0].amap1;
        obj.amap2 = finalMapping[0].amap2;
        obj.amap3 = finalMapping[0].amap3;
        obj.apply1 = finalMapping[0].apply1;
        obj.apply2 = finalMapping[0].apply2;
        obj.apply3 = finalMapping[0].apply3;
        obj.uval1 = finalMapping[0].uval1;
        obj.uval2 = finalMapping[0].uval2;
        obj.file1 = this.file1.value;
        obj.file2 = this.file2.value;

      
        fetch(baseUrl + `reconcilation/${this.file1.value}${this.file2.value}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(obj)
        })
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Error in Reconciling data");
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((response)=>{
            alert("Reconcilation Done Successfully");
        })
        .catch((err)=>{
            alert(err.message);
        })
        console.log(obj);
        event.preventDefault();
    }

    onTable1Selected(event){

        let table1 = event.target.value;
        let a = [];
        this.state.mappingData.forEach((item,idx,self)=>{
            if(item.file1 == table1){
                a.push(item.file2);
            }    
        });

        a = a.filter((item,idx,self)=>{
            return self.indexOf(item) == idx;
        });

        this.setState({
            table2:a
        });

        
    }

    componentDidMount(){
        fetch(baseUrl + 'databases/atmrecon/tables/mapping')
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Error in fetching mapping data");
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((response)=>{
            let a = response.map((item,idx,self)=>{
                return item.file1;
            });
            a = a.filter((item,idx,self)=>{
                return self.indexOf(item) == idx;
            })
            this.setState({
                mappingData:response,
                table1:a
            });
        })
        .catch((err)=>{
            alert(err.message);
        })
    }

    render(){

        return(
            <div className="container">
                <div className="row">
                   <div className="col-md-12 text-center">
                       <h2><strong>Reconcile Data</strong></h2>
                   </div>
                   </div>
                <div className="row">
                    <div className="col-md-12">
                        <Form onSubmit={this.handleReconcileSubmit}>
                            <FormGroup row>
                                <div className="col-md-4">
                                    <Label htmlFor="file1">
                                        <strong>File 1</strong>
                                    </Label>
                                    <Input type="select" name="file1" id="file1" placeholder="File 1"
                                    innerRef={(input)=>this.file1 = input} onChange = {this.onTable1Selected}>
                                        <option>

                                        </option>
                                        {
                                            this.state.table1.map((item)=>{
                                                return(
                                                    <option>
                                                        {item}
                                                    </option>
                                                );
                                            })
                                        }
                                    </Input>
                                </div>
                                <div className="col-md-4">
                                    <Label htmlFor="file2">
                                        <strong>File 2</strong>
                                    </Label>
                                    <Input type="select" name="file2" id="file2" placeholder="File 2"
                                    innerRef={(input)=>this.file2 = input}>
                                        <option>

                                        </option>
                                        {
                                            this.state.table2.map((item)=>{
                                                return(
                                                    <option>
                                                        {item}
                                                    </option>
                                                );
                                            })
                                        }
                                    </Input>
                                </div>
                                <div className="col-md-4 self-align-center mt-auto">
                                    <Button onSubmit = {this.handleReconcileSubmit} type="submit" className = "btn btn-block bg-dark mt-auto">
                                        Reconcile
                                    </Button>
                                </div>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <img src="images/homePic.png" width="60%"/>
                    </div>
                </div>
            </div>
        )
    }


}

export default ReconcileData;