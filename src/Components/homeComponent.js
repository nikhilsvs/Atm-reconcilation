import React,{Component} from 'react';
import {Jumbotron,UncontrolledCarousel, Breadcrumb,BreadcrumbItem} from 'reactstrap';

class Home extends Component{

    constructor(props){
        super(props);
    }

    render(){
        const items =  [
            {
                src:'images/carousel1.jpeg',
                caption:'Welcome to The App!!',
                header:'AtmRecon ',
                key:1
            },
            {
                src:'images/carousel2.jpeg',
                caption:'Manage your Database with Ease',
                header:'Enjoy',
                key:2
            },
            {
                src:'images/8231.jpg',
                caption:'Manage your Database with Ease',
                header:'Enjoy',
                key:2
            }
        ]
        return(
        <>
        <div className="container">
            <div className="row">
                <div className="col-md-12 text-center">
                    <h1>Welcome to the App</h1>
                   
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                <img src="images/29300.jpg" width="100%"/>
                </div>
            </div>
        </div>
        </>
               
        );
    }
}

export default Home;