import React,{Component} from 'react';
import {Form,FormGroup,Label,Input,Button,Card,CardBody,CardHeader} from 'reactstrap';
import {Link} from 'react-router-dom';

class Login extends Component{
    constructor(props){
        super(props);


        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(event){

        this.props.loginUser({
            username:this.username.value,
            password:this.password.value
        });
        event.preventDefault();
    }

    render(){

        return(
            <>
            <div className="upperLayer">
            <div className="loginrow loginspace">
                <div className="container">
                    <div className="row loginHeading">
                        <div className="col-md-12 text-center">
                            <h1><strong>Welcome to ATM Reconcilation</strong></h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 text-center align-self-center">
                            
                            <img src="images/login.png" width="100%"/>
                        </div>
                        <div className="col-md-6 align-self-center">
                        {
                            this.props.auth.isAuthenticated
                            ?
                            <div className="loggedIn">

                                    <h3>Hello</h3>
                                    <h1><cite>{this.props.auth.user.username}</cite></h1>
                                    <Link to="/Home" className = "btn btn-outline-danger btn-block-lg">See Your Profile</Link>
                            </div>
                            :
                            <Card className="loginCard">
                            <CardHeader className="text-center loginCardHeader">
                                <h3><cite><strong>Login</strong></cite></h3>
                            </CardHeader>
                            <CardBody className="loginCardBody">
                            <Form onSubmit = {this.handleLogin}>
                                <FormGroup row>
                                    <div className="col-md-12">
                                        <Label htmlFor="username"><strong>username</strong></Label>
                                        <Input type="text" name="username" id="username" placeholder="username"
                                        innerRef={(input)=>this.username=input}/>
                                    </div>
                                </FormGroup>
                                <FormGroup row>
                                    <div className="col-md-12">
                                        <Label htmlFor="password"><strong>password</strong></Label>
                                        <Input type="password" name="password" id="password" placeholder="password"
                                        innerRef={(input)=>this.password=input}/>
                                    </div>
                                </FormGroup>
                                <FormGroup row>
                                    <div className="col-md-12">
                                        <button type="submit" className="btn btn-dark btn-block"> Login </button>
                                    </div>
                                </FormGroup>
                            </Form>
                            </CardBody>
                        </Card>
                        }
                        </div>
                    </div>
                </div>
            </div>
            </div>
            
           
            </>
        )
    }
}

export default Login;