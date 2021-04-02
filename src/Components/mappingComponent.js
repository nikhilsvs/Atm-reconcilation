import React , {Component} from 'react';
import {Form,Input,InputGroup,Label,Button,Modal,ModalBody,ModalHeader} from 'reactstrap';
import FormGroup from 'reactstrap/lib/FormGroup';
import {baseUrl} from '../baseUrl';




class Mapping extends Component{
    constructor(props){
        super(props);

        this.state={
            files:[],
            filename1Selected:null,
            filename2Selected:null,
            file1Desc:[],
            file2Desc:[],
            col1:'',
            col2:'',
            col3:'',
            finalcol1:'',
            finalcol2:'',
            finalcol3:'',
            isModalOpen:false,
            colsMap:[{
                file1col:'',
                file2col:'',
                match:false
            }],
            isLoading:true
        }
        this.handleFilenameSubmit = this.handleFilenameSubmit.bind(this);
        this.fileDescfetch = this.fileDescfetch.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleCustomMap = this.handleCustomMap.bind(this);
        this.handleMap = this.handleMap.bind(this);
        this.handleMappingFileChange = this.handleMappingFileChange.bind(this);
        this.addNewColumn = this.addNewColumn.bind(this);
        this.onCustomMapChange = this.onCustomMapChange.bind(this);
        this.makeMappingTable = this.makeMappingTable.bind(this);
    }

    addNewColumn(){
        let obj = {
            file1col:'',
                file2col:'',
                match:false
        };

        let temp = this.state.colsMap;

        temp.push(obj);

        this.setState({
            colsMap:temp
        })
    }
    handleMappingFileChange(event,idx){

        let tempObj = this.state.colsMap;
        if(event.target.type=='checkbox')
        {
            tempObj[idx][event.target.name] = event.target.checked;
        }
        else{
            tempObj[idx][event.target.name] = event.target.value;
        }
        
        this.setState({
            colsMap:tempObj
        });

    }
    onCustomMapChange(event){
        this.setState({
            [event.target.name]:event.target.value
        });

        if(event.target.name == 'col1' || event.target.name == 'col2' || event.target.name == 'col3'){
            this.setState({
                [`final${event.target.name}`]:event.target.value
            });
        }
    }
    makeMappingTable(){

        let obj = {
            cols:[]
        };

        obj.t1 = this.state.filename1Selected;
        obj.t2 = this.state.filename2Selected;
        this.state.colsMap.forEach((item)=>{
            if(item.file1col != ''){
                obj.cols.push(`${this.state.filename1Selected}.\`${item.file1col}\``);
            }
            else{
                obj.cols.push(`${this.state.filename2Selected}.\`${item.file2col}\``);
            }
        });

        obj.tname=`${this.state.filename1Selected}${this.state.filename2Selected}`;
        fetch(baseUrl + "mapping",{
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
                var err = new Error("Error in Making Mapping Data Table");
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((response)=>{
            alert("Mapping Table Data made !!");
        })
        .catch((err)=>{
            alert(err.message);
        })

    }
    handleCustomMap(event){
        alert("Cutsom Map triggered !!");

        let a = [];

        let cols = this.state.colsMap;
        let finalamap1 = `${this.state.finalcol1} ${this.op1.value} ${this.amap1.value}`;
        let finalamap2 = `${this.state.finalcol2} ${this.op2.value} ${this.amap2.value}`;
        let finalamap3 = `${this.state.finalcol3} ${this.op3.value} ${this.amap3.value}`;
        for(let i = 0;i<this.state.colsMap.length;i++)
        {
            let temp = [];
            temp.push(cols[i].file1col);
            temp.push(cols[i].file2col);
            temp.push(this.state.filename1Selected);
            temp.push(this.state.filename2Selected);
            if(cols[i].match)
            temp.push('Y');
            else{
                temp.push('N');
            }
            temp.push(finalamap1);
            temp.push(finalamap2);
            temp.push(finalamap3);
            temp.push(this.apply1.value);
            temp.push(this.apply2.value);
            temp.push(this.apply3.value);
            temp.push(this.uval1.value);
            temp.push(this.uval2.value);

            a.push(temp);
        }

        fetch(baseUrl + `databases/atmrecon/tables/mapping`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                values:(a)
            })
        })
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                let err = new Error("Error in configuring mappping");
                err.response = response;
                throw err;
            }

        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((result)=>{
            alert("Successfull Configured Mapping");
            this.makeMappingTable();
        })
        .catch((err)=>{
            alert(err.message);
        })
        alert(JSON.stringify(a));
        event.preventDefault();
    }
    handleMap(event){

        alert(JSON.stringify(this.state.colsMap));

        event.preventDefault();

    }
    toggleModal(){
        this.setState({
            isModalOpen:!this.state.isModalOpen
        })
    }
    fileDescfetch(file,idx){
         fetch(baseUrl + `databases/atmrecon/tables/${file}/desc`)
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
                 [`file${idx}Desc`]:response
             });
 
         })
         .catch((err)=>alert("Error : " + err.message))
    }
    handleFilenameSubmit(event){

      

        this.setState({
            filename1Selected:this.filename1.value,
            filename2Selected:this.filename2.value
        });

        this.fileDescfetch(this.filename1.value,1);
        this.fileDescfetch(this.filename2.value,2);
       
        this.setState({
            isLoading:false
        });
       
        event.preventDefault();
    }
    componentDidMount()
    {
      
        fetch(baseUrl + 'databases/atmrecon/tables')
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Error n fetching files from atmrecon")
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((response)=>{
            let temp = response.map((item)=>{
                return(
                    Object.values(item)[0]
                );
            });

            this.setState({
                files : temp
            });
        })
    }
    render()
    {
        let file1arr = [];
        let file2arr = [];
        let n1 = this.state.file1Desc.length;
        let n2 = this.state.file2Desc.length;
        let a = ['<','<=','>','>=','=','in'];
        let y = [];
        this.state.file1Desc.forEach((item)=>{
            y.push(
                <option>
                    {`${this.state.filename1Selected}.\`${item.Field}\``}
                </option>
            )
                
           
        });
        this.state.file2Desc.forEach((item)=>{
            y.push(
                <option>
                    {`${this.state.filename2Selected}.\`${item.Field}\``}
                </option>
            )
        });
        let ans = a.map((item)=>{
            return(
                <option>
                    {item}
                </option>
            );
        });
        let n = this.state.colsMap.length;
        file1arr = this.state.colsMap.map((temp,idx)=>{
            return(
                    <FormGroup row>
                        <div className="col-md-4">
                            <Input type="select" name={`file1col`} id={`file1col`} value = {this.state.colsMap[idx].file1col}
                                innerRef={(input)=>this.file1col = input}
                             onChange={(event)=>this.handleMappingFileChange(event,idx)}>
                                <option>
                                    
                                </option>
                            {
                                this.state.file1Desc.map((x)=>{
                                    return(
                                        <option>
                                        {x.Field}
                                        </option>
                                    )
                                    })
                            }
                            </Input>
                        </div>
                        <div className="col-md-4">
                            <Input type="select" name={`file2col`} id={`file2col`} 
                            value = {this.state.colsMap[idx].file2col}
                            innerRef={(input)=>this.file2col = input}
                         onChange={(event)=>this.handleMappingFileChange(event,idx)}>
                                    <option>
                                        
                                    </option>
                            {
                                
                                this.state.file2Desc.map((x)=>{
                                    
                                    return(
                                        <option>
                                        {x.Field}
                                        </option>
                                    )
                                    })
                            }
                            </Input>
                        </div>
                        <div className="col-md-2 self-align-center text-center">
                            <Input type="checkbox" name="match" id="match" 
                            checked = {this.state.colsMap[idx].match}
                            innerRef={(input)=>this.match = input}
                            onChange={(event)=>this.handleMappingFileChange(event,idx)}
                            />
                                   
                        </div>
                        {
                            idx == n-1
                            ?
                            <div className="col-md-2 self-align-center text-center">
                                <span className="fa fa-plus addColBtn" onClick={this.addNewColumn}></span>      
                            </div>
                            :
                            null
                        }           
                    </FormGroup>
            )
        });
        
        return(
            <div className="container">
                <div className="row">
                   <div className="col-md-12">
                       <h2><strong>Create Mapping Format</strong></h2>
                   </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Form onSubmit={this.handleFilenameSubmit}>
                            <FormGroup row>
                                <div className="col-md-4">
                                    <Label htmlFor="filename1">
                                        <strong>FileName1</strong>
                                    </Label>
                                    <Input type="select" name="filename1" id="filename1" placeholder="Filename 1"
                                    innerRef={(input)=>this.filename1 = input}>
                                        {
                                            this.state.files.map((item)=>{
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
                                    <Label htmlFor="filename2">
                                        <strong>FileName1</strong>
                                    </Label>
                                    <Input type="select" name="filename2" id="filename2" placeholder="Filename 2"
                                    innerRef={(input)=>this.filename2 = input}>
                                        {
                                            this.state.files.map((item)=>{
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
                                    <Button onSubmit = {this.handleFilenameSubmit} type="submit" className = "btn btn-block bg-dark mt-auto">
                                        Submit
                                    </Button>
                                </div>
                            </FormGroup>
                        </Form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        {
                            this.state.isLoading==false
                            ?
                            <div className="row">
                                <div className="col-md-4">
                                    <h4><cite>{this.state.filename1Selected}</cite></h4>
                                </div>
                                <div className="col-md-4">
                                    <h4><cite>{this.state.filename2Selected}</cite></h4>
                                </div>
                                <div className="col-md-2">
                                    {
                                        this.state.file2Desc.length>0
                                        ?
                                        <h4><cite>match</cite></h4>
                                        :
                                        <h4></h4>
                                    }
                                </div>
                            </div>
                            :
                            null
                        }
                        
                       <div className="row">
                        <div className="col-md-12">
                            {
                                this.state.isLoading == false
                                ?
                                <Form onSubmit={this.handleMap}>
                                        {file1arr}
                                            <FormGroup row>
                                                <div className="col-md-12">
                                                    <Button type="submit" className="btn btn-block bg-dark">
                                                        Submit
                                                    </Button>
                                                </div>
                                            </FormGroup>
                                           
                            </Form>
                            :
                            null
                            }
                        
                        </div>    
                       </div>
                                 
                    </div>
                    <div className="col-md-4 text-center">
                        {
                            this.state.isLoading == false
                            ?
                           
                           <>
                                <div className="modalBtn">
                                    <button className="btn btn-outline-dark btn-block" onClick={this.toggleModal}>Custom Match</button>
                                </div>

                                
                           </>
                                
                          
                            :
                            null
                        }
                    </div>
                    
                    
                </div>
                <Modal isOpen={this.state.isModalOpen} contentClassName="customModal">
                    <ModalHeader toggle={this.toggleModal}>
                        <strong>Custom Match</strong>
                    </ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.handleCustomMap}>
                            <FormGroup row>
                                <div className="col-md-3">
                                    <Label htmlFor="col1">
                                        <strong>Select Column</strong>
                                    </Label>   
                                    <Input type="select" name="col1" id = "col1" onChange = {(event)=>this.onCustomMapChange(event)}
                                    innerRef={(input)=>this.col1=input}>
                                        {y}
                                    </Input>
                                </div>
                                <div className="col-md-3">
                                    <Label htmlFor="finalcol1">
                                        <strong>Edit Column</strong>
                                    </Label>   
                                    <Input type="text" name="finalcol1" id = "finalcol1" value = {this.state.finalcol1} 
                                    onChange = {(event)=>this.onCustomMapChange(event) }innerRef={(input)=>this.finalcol1=input}>
                                        {y}
                                    </Input>
                                </div>
                                <div className="col-md-2">
                                    <Label htmlFor="op1">
                                        <strong>Operator</strong>
                                    </Label>   
                                    <Input type="select" name="op1" id = "op1" innerRef={(input)=>this.op1=input}>
                                        {ans}
                                    </Input>
                                </div>
                                <div className="col-md-3">
                                    <Label htmlFor="amap1">
                                        <strong>Condition1</strong>
                                    </Label>   
                                    <Input type="text" name="amap1" id = "amap1" placeholder="amap1" innerRef={(input)=>this.amap1=input}/>
                                </div>
                                <div className="col-md-1">
                                    <Label htmlFor="apply1">
                                        <strong>Apply</strong>
                                    </Label>   
                                    <Input type="select" name="apply1" id = "apply1" placeholder="apply1" innerRef={(input)=>this.apply1=input}>
                                        <option>
                                            {this.state.filename1Selected}
                                        </option>
                                        <option>
                                            {this.state.filename2Selected}
                                        </option>
                                        <option>
                                            Both
                                        </option>
                                    </Input>
                                </div>
                                                             
                            </FormGroup>
                            <FormGroup row>
                            <div className="col-md-3">
                                    <Label htmlFor="col2">
                                        <strong>Select Column</strong>
                                    </Label>   
                                    <Input type="select" name="col2" id = "col2" onChange = {(event)=>this.onCustomMapChange(event)}
                                    innerRef={(input)=>this.col2=input}>
                                        {y}
                                    </Input>
                                </div>
                                <div className="col-md-3">
                                    <Label htmlFor="finalcol2">
                                        <strong>Edit Column</strong>
                                    </Label>   
                                    <Input type="text" name="finalcol2" id = "finalcol2" value = {this.state.finalcol2} innerRef={(input)=>this.finalcol2=input}
                                    onChange = {(event)=>this.onCustomMapChange(event)}/>
                                       
                                </div>
                                <div className="col-md-2">
                                    <Label htmlFor="op2">
                                        <strong>Operator</strong>
                                    </Label>   
                                    <Input type="select" name="op2" id = "op2" innerRef={(input)=>this.op2=input}>
                                        {ans}
                                    </Input>
                                </div>
                                <div className="col-md-3">
                                    <Label htmlFor="amap2">
                                        <strong>Condition2</strong>
                                    </Label>   
                                    <Input type="text" name="amap2" id = "amap2" placeholder="amap2" innerRef={(input)=>this.amap2=input}/>
                                </div>
                                <div className="col-md-1">
                                    <Label htmlFor="apply2">
                                        <strong>Apply</strong>
                                    </Label>   
                                    <Input type="select" name="apply2" id = "apply2" placeholder="apply2" innerRef={(input)=>this.apply2=input}>
                                        <option>
                                            {this.state.filename1Selected}
                                        </option>
                                        <option>
                                            {this.state.filename2Selected}
                                        </option>
                                        <option>
                                            Both
                                        </option>
                                    </Input>
                                </div>
                                                             
                            </FormGroup>
                            <FormGroup row>
                                <div className="col-md-3">
                                    <Label htmlFor="col3">
                                        <strong>Select Column</strong>
                                    </Label>   
                                    <Input type="select" name="col3" id = "col3" onChange = {(event)=>this.onCustomMapChange(event)}
                                    innerRef={(input)=>this.col3=input}>
                                        {y}
                                    </Input>
                                </div>
                                <div className="col-md-3">
                                    <Label htmlFor="finalcol3">
                                        <strong>Edit Column</strong>
                                    </Label>   
                                    <Input type="text" name="finalcol3" id = "finalcol3" value = {this.state.finalcol3} innerRef={(input)=>this.finalcol3=input}
                                    onChange = {(event)=>this.onCustomMapChange(event)}/>
                                      
                                </div>
                                <div className="col-md-2">
                                    <Label htmlFor="op3">
                                        <strong>Operator</strong>
                                    </Label>   
                                    <Input type="select" name="op3" id = "op3" innerRef={(input)=>this.op3=input}>
                                        {ans}
                                    </Input>
                                </div>
                                <div className="col-md-3">
                                    <Label htmlFor="amap3">
                                        <strong>Condition3</strong>
                                    </Label>   
                                    <Input type="text" name="amap3" id = "amap3" placeholder="amap3" innerRef={(input)=>this.amap3=input}/>
                                </div>
                                <div className="col-md-1">
                                    <Label htmlFor="apply3">
                                        <strong>Apply</strong>
                                    </Label>   
                                    <Input type="select" name="apply3" id = "apply3" placeholder="apply3" innerRef={(input)=>this.apply3=input}>
                                        <option>
                                            {this.state.filename1Selected}
                                        </option>
                                        <option>
                                            {this.state.filename2Selected}
                                        </option>
                                        <option>
                                            Both
                                        </option>
                                    </Input>
                                </div>
                                                             
                            </FormGroup>
                            <FormGroup row>
                                <div className = "col-md-6">
                                    <Label htmlFor="uval1">
                                        <strong>{this.state.filename1Selected}'s Unique Value</strong>
                                    </Label>
                                    <Input type="select" name="uval1" id="uval1" innerRef={(input)=>this.uval1=input}>
                                    {
                                        this.state.file1Desc.map((x)=>{
                                            return(
                                                <option>
                                                {x.Field}
                                                </option>
                                            )
                                            })
                                    }
                                    </Input>
                                </div>
                                <div className = "col-md-6">
                                    <Label htmlFor="uval2">
                                        <strong>{this.state.filename2Selected}'s Unique Value</strong>
                                    </Label>
                                    <Input type="select" name="uval2" id="uval2" innerRef={(input)=>this.uval2=input}>
                                    {
                                        this.state.file2Desc.map((x)=>{
                                            return(
                                                <option>
                                                {x.Field}
                                                </option>
                                            )
                                            })
                                    }
                                    </Input>
                                </div>
                            </FormGroup>
                            <FormGroup row>
                                <div className="col-md-12">
                                    <Button type="submit" className="btn-block bg-dark">
                                        MAP
                                    </Button>
                                </div>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default Mapping;