import React,{Component} from 'react';
import {Nav,NavItem,Navbar,NavbarBrand,NavbarToggler,NavLink,Collapse,
        Dropdown,DropdownItem,DropdownMenu,DropdownToggle,UncontrolledDropdown} from 'reactstrap';
import {useHistory} from 'react-router-dom';
import {Link} from 'react-router-dom';


class Header extends Component{

    constructor(props){
        super(props);

        this.state = {
            isNavOpen : false,
            isDropdown : false
        }
        this.toggleNav = this.toggleNav.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        
    }
    
    async handleLogout(){

        await this.props.logout();

    }
    toggleNav(){
        this.setState({
            isNavOpen:!this.state.isNavOpen
        })
    }
    toggleDropdown(){
        this.setState({
            isDropdown:!this.state.isDropdown
        })
    }
    render(){
        return(
            <Navbar expand="md" light>
                <NavbarBrand href="/home">
                    ATMRecon
                </NavbarBrand>
                <NavbarToggler onClick={this.toggleNav}></NavbarToggler>
                <Collapse isOpen = {this.state.isNavOpen} navbar>
                <Nav navbar>
                    <NavItem>
                        <Dropdown isOpen={this.state.isDropdown} toggle={this.toggleDropdown}>
                            <DropdownToggle className="dropBtn">
                                Admin
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>
                                    <NavLink href='/createtable'>Create file format</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href='/mapping'>Create Mapping Format</NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavItem>
                    <NavItem>
                        <UncontrolledDropdown >
                            <DropdownToggle className="dropBtn">
                                Operations
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>
                                    <NavLink href='/populatedata'>Import Files</NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </NavItem>
                    <NavItem>
                        <UncontrolledDropdown >
                            <DropdownToggle className="dropBtn">
                                Reconcilation
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>
                                    <NavLink href='/reconciledata'>Reconcile Data</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href='/readtable_recon'>View Reconciled Data</NavLink>
                                </DropdownItem>
                                <DropdownItem>
                                    <NavLink href='/readtable_unrecon'>View Unreconciled Data</NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </NavItem>
                    
                </Nav>
                <Nav navbar className="ml-auto">
                    <NavItem>
                       
                        <UncontrolledDropdown >
                            <DropdownToggle className="username">
                                {this.props.auth.user.username}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>
                                    <NavLink onClick={this.handleLogout}>Logout</NavLink>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </NavItem>
                </Nav>
                </Collapse>
            </Navbar>
        )
    }
}

export default Header;