import React,{Component} from 'react';
import {Form,FormGroup,Input,Label,Button,Table} from 'reactstrap';
import {baseUrl} from '../baseUrl';



class CreateTable extends Component{

    constructor(props){
        super(props)
        
        this.state={
            cols:null,
            db:null,
            tname:null,
            inputFields:[],
            entity:null,
            format:null
        }

        this.tabledescSubmit = this.tabledescSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.createTableSubmit = this.createTableSubmit.bind(this);
        this.handleAddField = this.handleAddField.bind(this);
    }
    createConfiguredTable()
    {
        const bodyobj = {
            inputFields : this.state.inputFields,
            tname:this.state.tname
        };
        console.log(bodyobj);
        alert(JSON.stringify(bodyobj));
   
        fetch(baseUrl + `configureTable`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Origin':'http://localhost/3000'
            },
            body:JSON.stringify(bodyobj)
        })
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Error in making Configure Table " + response.status + response.statusText);
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((result)=>{
            alert("Your Configure Table has be Successfully Created ");
        })
        .catch((err)=>{
            alert("Sorry there was a error in making a new Configure table " + 
                "\n Error : " +  err.message);
        })
    }
    createTableSubmit(event){
        var str = "";
        for(var i = 0;i<this.state.inputFields.length;i++)
        {
            str += "\n Col1 Name : "+this.state.inputFields[i].name ;
        }
        const bodyobj = {
            inputFields : this.state.inputFields,
            tname:this.state.tname
        };
        console.log(bodyobj);
        alert(JSON.stringify(bodyobj));
        alert(str);
        fetch(baseUrl + `databases/atmrecon/tables`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Origin':'http://localhost/3000'
            },
            body:JSON.stringify(bodyobj)
        })
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Error in making Table " + response.status + response.statusText);
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((result)=>{
            alert("Your Table has be Successfully Created ");
            this.createConfiguredTable();
        })
        .catch((err)=>{
            alert("Sorry there was a error in making a new table " + 
                "\n Error : " +  err.message);
        });
        fetch(baseUrl + `databases/configuredtables/tables/entityformat`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Origin':'http://localhost/3000'
            },
            body:JSON.stringify({
                values:[
                    [this.state.entity,this.state.format]
                ]
            })
        })
        .then((response)=>{
            if(response.ok){
                return response;
            }
            else{
                var err = new Error("Error in making Table " + response.status + response.statusText);
                err.response = response;
                throw err;
            }
        },(error)=>{
            throw error;
        })
        .then((response)=>response.json())
        .then((result)=>{
            alert("Your EntityFormat Table has be Successfully Updated ");
        })
        .catch((err)=>{
            alert("Sorry there was a error in making a new table " + 
                "\n Error : " +  err.message);
        })
        event.preventDefault();
    }
    handleAddField(event){
        var arr = this.state.inputFields;
        arr.push({ name:'',
                datatype:'',
                len:0});
        this.setState({
            inputFields:arr
        });
    }
    onInputChange(event,idx){
       var arr = this.state.inputFields;
       arr[idx][event.target.name] = event.target.value;

       this.setState({
           inputFields:arr
       });
    }
    tabledescSubmit(event){
        event.preventDefault(); 
        alert("Table  : " + `${this.entity.value}${this.format.value}`);
        this.setState({
            cols:this.cols.value,
            tname:`${this.entity.value}${this.format.value}`,
            entity:this.entity.value,
            format:this.format.value
        });

        let temp = [];

        for(let i = 0;i<this.cols.value;i++)
        {
            temp.push({
                name:'',
                datatype:'',
                len:0,
                startpos:0
            });
        }

        this.setState({
            inputFields:temp
        });
        event.preventDefault(); 
    }
    render(){
 
        const inputRef = (input,i,name)=>{
            var item = `${name}${i}`;
            this.item = input;
        }
    
        return(
           <div className="container">
               <div className="row">
                   <div className="col-md-12">
                       <h2><strong>Create File Format</strong></h2>
                   </div>
                </div>
               <div className="row">
                   <div className="col-md-12">
                   <Form onSubmit={this.tabledescSubmit}>
                       <FormGroup row>
                            <div className="col-md-3">
                                <Label htmlFor = "filetype"><strong>File Type</strong></Label>
                                <Input type="select" name="filetype" id="filetype" innerRef={(input)=>this.filetype=input}>
                                    <option>Raw</option>
                                    <option>Delimited</option>
                                </Input>
                            </div>
                            <div className="col-md-3">
                                <Label htmlFor = "entity"><strong>Entity</strong></Label>
                                <Input type="text" name="entity" id="entity" innerRef={(input)=>this.entity=input}
                                placeholder="Entity Name"/>
                            </div>
                            <div className="col-md-3">
                                <Label htmlFor = "format"><strong>format</strong></Label>
                                <Input type="text" name="format" id="format" innerRef={(input)=>this.format=input}
                                placeholder="format"/>
                            </div>
                            <div className="col-md-1">
                                <Label htmlFor = "cols"><strong>Columns</strong></Label>
                                <Input type="Number" name="cols" id="cols" innerRef={(input)=>this.cols=input}
                                placeholder="Columns"/>
                            </div>
                            <div className="col-md-2 text-center align-self-center mt-auto mb-1">
                                <Input type="submit" className="btn btn-primary bg-dark"/>
                            </div>
                            
                           
                       </FormGroup>
                   </Form>
                   </div>
                  
               </div>
               <div className="row">
                   <div className="col-md-12">
                       <Form onSubmit={this.createTableSubmit}>
                            {
                                this.state.inputFields.map((item,i)=>{
                                    return(
                                        <FormGroup row>
                                        <div className="col-md-4">
                                            <Label htmlFor="name"><strong>Column Name</strong></Label>
                                            <Input type="text" name="name" id="name" placeholder={`Column Name ${i}`} value={item.name} onChange={(event)=>this.onInputChange(event,i)}/>
                                        </div>
                                        <div className="col-md-4">
                                        <Label htmlFor="datatype"><strong>DataType</strong></Label>
                                            <Input type="select" name="datatype" id="datatype" placeholder={`DataType ${i}`} value={item.datatype} onChange={(event)=>this.onInputChange(event,i)}>
                                                <option>varchar</option>
                                                <option>char</option>
                                                <option>int</option>
                                                <option>bigint</option>
                                                <option>date</option>
                                                <option>time</option>
                                            </Input>
                                        </div>
                                        <div className="col-md-2">
                                            <Label htmlFor="len"><strong>Length</strong></Label>
                                            <Input type="number" name="len" id="len" placeholder="Length" value={item.len} onChange={(event)=>this.onInputChange(event,i)}/>
                                        </div>
                                        <div className="col-md-2">
                                            <Label htmlFor="startpos"><strong>Start Position</strong></Label>
                                            <Input type="number" name="startpos" id="startpos" placeholder="Start Position" value={item.startpos} onChange={(event)=>this.onInputChange(event,i)}/>
                                        </div>
                                    </FormGroup>
                                    )
                                })
                            }
                            {
                                this.state.inputFields.length>0
                                ?
                                <Button type="submit" className="btn-block bg-dark">Submit</Button>
                                :
                                <>
                                </>
                            }
                       </Form>
                   </div>
               </div>
           </div>
        )
    }
}

export default CreateTable;