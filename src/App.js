import React, { Component } from 'react';
import styled from "styled-components";

const Container = styled.div`
	padding: 5px;
	margin: 7px;
	border: 1px solid #ffe7d3;
    border-radius: 5px;
    box-shadow: 0px 0px 0px 5px;
	display: flex;
	flex-direction: column;
    overflow-x: scroll;
`

const ChildContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
`

const Header = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 5px;
	margin: 5px;
	align-items: center;
`

const Button = styled.button`
	font-size: 1em;
	margin: 5px;
	padding: 3px 0.75px;
    border: 0px;
`

class Item extends Component {
    constructor(props) {
      super(props);
      this.state = {
        name: this.props.item.title,
        count: 0,
        open: true,
        renaming: false,
      };
    }

    toggle = () => {
        this.setState({
            ...this.state,
            open: !this.state.open,
        });
    }

    startRename = () => {
        this.setState({
            ...this.state,
            oldName: this.state.name,
            renaming: true,
        });
    }

    changeName = (e) => {
        this.setState({
            ...this.state,
            name: e.target.value,
            })
    }

    saveName = () => {
        if (this.props.parent){
            this.props.set(this.props.parent, {old: this.props.item.title, new: this.state.name}, "EDIT");
        }
        else {
            this.props.set(null, {old: this.props.item.title, new: this.state.name}, "EDIT");   
        }
        this.setState({
            ...this.state,
            renaming: false,
        })
    }

    cancelRename = () => {
        this.setState({
            ...this.state,
            renaming: false,
        })
    }

    staticHeader = () => (
        <Header>
            {this.props.parent ?  <Button onClick={() => this.props.set(this.props.parent, this.props.item.title, "REMOVE")}>Remove</Button> : "" }
            <h3 onClick={this.startRename}>{this.props.item.title}</h3>
                <span>
                    {this.props.item.children.length > 0 ? <Button onClick={this.toggle}>Toggle</Button> : ""}
                    <Button onClick={() => this.props.set(this.props.item.title, "New "+this.state.count++, "ADD")}>Add</Button> 
                 </span>
            </Header>
    )

    renameHeader = () => (
        <Header>
            <Button onClick={()=>this.cancelRename()}>Cancel</Button>
            <input value={this.state.name} onChange={e => this.changeName(e)} autoFocus/>
            <Button onClick={this.saveName}>Save</Button>
        </Header>
    )

    render = () => {
        return (
            <Container >
                    {!this.state.renaming ? this.staticHeader() : this.renameHeader() }
                    {this.state.open ?
                        <ChildContainer>
                                {this.props.item.children.map((child, index)=>(
                                    <Item key={child.title+index} parent = {this.props.item.title} item={child} set={this.props.set}/>
                                ))}
                        </ChildContainer>
                        :
                        ""
                    }
            </Container>
        );
    }
}

const modify = (start, where, what, how) => {
        if (where === null) {
            switch(how) {
                case "EDIT":
                    start.title = what.new;
                    break;
                default:
                    break;
            }
        }
        else if (start.title === where){
            switch(how) {
                case "ADD":
                    start.children = [...start.children, {title: what, children: []}];
                    break;
                case "REMOVE":
                    start.children = start.children.filter(item => item.title !== what);
                    break;
                case "EDIT":
                    start.children = start.children.map(item => item.title === what.old ? {...item, title: what.new} : item);
                    break;
                default:
                    break;
            }
        }
        else {
            if (start.children.length > 0){
               for (var i = 0; i<start.children.length; i++){
                    modify(start.children[i], where, what, how);
                }
            }
        }
        return start;
    }

class App extends Component {
    constructor(props) {
      super(props);
    
      this.state = {
        store: {
            title: "Tree Editor",
            children: [],
        }
      };
    }

    setData = (where, what, how) => {
        this.setState({
            ...this.state,
            store: modify(this.state.store, where, what, how),
        });
    }

	render() {
		return (
            <div>
        	   <Item item={this.state.store} set={this.setData}/>
           </div>
		);
	}
}

export default App;