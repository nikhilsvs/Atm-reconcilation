import React,{Component} from 'react';
import Header from './headerComponent';
import Home from './homeComponent';
import ReadTable from './readtableComponent';
import CreateTable from './createTableComponent';
import Populate from './populateComponent';
import Database from './createdatabaseComponent';
import ModifyTable from './modifyTableComponent';
import Mapping from './mappingComponent';
import {Redirect,Route,Switch,withRouter} from 'react-router-dom';
import {fetchEntity,fetchFormat,loginUser,logoutUser} from '../redux/actionCreators';
import Match from './matchTableComponent';
import {connect} from 'react-redux';
import ReconcileData from './reconcileComponent';
import Login from './loginComponent';
import Unreconciled from './unreconciledComponent';

const mapStateToProps = state =>{

    return{
        entity:state.entities,
        format:state.format,
        auth : state.auth
    }
    
}

const mapDispatchToProps = (dispatch) =>({
    fetchEntity : ()=>{dispatch(fetchEntity())},
    fetchFormat:()=>{dispatch(fetchFormat())},
    loginUser : (creds)=>{dispatch(loginUser(creds))},
    logoutUser : ()=>{dispatch(logoutUser())}
});

class Main extends Component{

    constructor(props){
        super(props);
    }
   
    componentDidMount(){
        this.props.fetchEntity();
        this.props.fetchFormat();
    }
    
    render()
    {
        const readTable = ()=>{
            return(
                <ReadTable entity={this.props.entity.entity} 
                format={this.props.format.format}/>
            )
        }
        const createTable = ()=>{
            return(
                <CreateTable entity={this.props.entity.entity}
                format={this.props.format.format}/>
            )
        }
        const populateData=()=>{
            return(
                <Populate entity={this.props.entity.entity}
                format={this.props.format.format}/>
            )
        }
        const createDatabase = ()=>{
            return(
                <Database entity={this.props.entity.entity}
                format={this.props.format.format}
                />
            )
        }
        const matchcomponent = ()=>{
            return(
                <Match entity={this.props.entity.entity}
                format={this.props.format.format}/>
            )
        }
        const modifyTable=()=>{
            return(
                <ModifyTable entity={this.props.entity.entity}
                format={this.props.format.format}/>
            )
        }
        const mappingComponent = ()=>{
            return(
                <Mapping/>
            )
        }
        const reconcileDataComponent = ()=>{
            return(
                <ReconcileData />
            )
        }
        const unreconcileData = ()=>{
            return(
                <Unreconciled entity={this.props.entity.entity} 
                format={this.props.format.format}/>
            )
        }
        const loginComponent = ()=>{
            return(
                <Login auth = {this.props.auth} loginUser = {this.props.loginUser}/>
            )
        }
        if(!this.props.auth.isAuthenticated){
            return(
                <>
                <Switch>
                    <Route path="/login" component={loginComponent}/>
                </Switch>
                 <Redirect to = '/login'/>
                </>
            );
        }
        else{
            return(
                <>
                <Header auth={this.props.auth} logout={this.props.logoutUser}/>
                <Switch>
                    <Route path="/Home" component ={()=><Home/>}/>
                    <Route path="/mapping" component = {mappingComponent}/>
                    <Route path="/createDatabase" component={createDatabase}/>
                    <Route path ='/createtable' component ={createTable}/>
                    <Route path ='/modifytable' component ={modifyTable}/>
                    <Route path ='/readtable_recon' component ={readTable}/>
                    <Route path ='/readtable_unrecon' component ={unreconcileData}/>
                    <Route path="/populatedata" component={populateData}/>
                    <Route path="/matchTables" component={matchcomponent}/>
                    <Route path="/reconciledata" component = {reconcileDataComponent}/>
                 
                    <Redirect to = '/Home'/>
                </Switch>
               </>
            );
        }
        
    }
}

export default withRouter((connect(mapStateToProps,mapDispatchToProps)(Main)));

//connect is a HOC (Higher order component)