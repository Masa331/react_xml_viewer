import React, { Component } from 'react';
import OpenTag from './OpenTag.js';
import CloseTag from './CloseTag.js';
import EmptyNode from './EmptyNode.js';
import EndNode from './EndNode.js';

import nodeFactory from './nodeFactory.js';

const repeat = function(str, times) {
  return (new Array(times + 1)).join(str);
};

const coll = function myself (objs = []) {
  let result = objs.map((obj) => {
    obj.collapsed = true;
    obj.elements = myself(obj.elements);
    return obj;
  })
  console.log(result);
  return result;
}

const exp = function myself (objs = []) {
  let result = objs.map((obj) => {
    obj.collapsed = false;
    obj.elements = myself(obj.elements);
    return obj;
  })
  console.log(result);
  return result;
}

class SubNode extends Component {
  constructor(props) {
    super(props);


    console.log("v konstruktoru: ", this.props.name, ", collapsed: ", this.props.collapsed);

    this.state = {
      name: this.props.name,
      indentation: this.props.indentation,
      elements: this.props.elements || [],
      collapsed: this.props.collapsed
    };
  }

  spaces() {
    return <span dangerouslySetInnerHTML={{ __html: repeat("&nbsp;", this.props.indentation) }} />
  }

  collapse = () => {
    this.setState({ collapsed: true });
  };

  expand = () => {
    this.setState({ collapsed: false });
  };

  collapseChildren = () => {
    console.clear();
    this.setState({ elements: coll(this.state.elements) });
  };

  expandChildren = () => {
    console.clear();
    this.setState({ elements: exp(this.state.elements) });
  };

  render() {
    let content;

    console.log("v subnode: ", this.state.name, ", collapsed: ", this.state.collapsed);
    let subNodes = this.state.elements.map((element, index) => {
      // return nodeFactory(element, this.state.indentation + 2, index);
      var isEmptyNode = (!element.elements) || (element.elements.length === 0);
      var isEndNode = (element.elements) && (element.elements.length === 1) && element.elements[0].type === "text";
      var indentation = this.state.indentation + 2;

      if(isEmptyNode) {
        return (
          <EmptyNode key={index} name={element.name} indentation={indentation} />
        );
      } else if(isEndNode) {
        return (
          <EndNode key={index} name={element.name} indentation={indentation} text={element.elements[0].text} />
        );
      } else {
        console.log("v factory c.2: ", element.name, ", collapsed: ", element.collapsed);
        return (
          <SubNode
            key={index}
            name={element.name}
            indentation={indentation}
            elements={element.elements}
            collapsed={element.collapsed}
          />
        );
      }
    })

    if(this.state.collapsed) {
      content = <br/>
    } else {
      content =
        <React.Fragment>
          <br />
          { subNodes }
          {this.spaces()}
        </React.Fragment>
    }

    return (
      <div>
        {this.spaces()}
        <OpenTag
          name={this.props.name}
          collapse={this.collapse}
          expand={this.expand}
          collapseChildren={this.collapseChildren}
          expandChildren={this.expandChildren}
        />
        { content }
        <CloseTag name={this.props.name} />
      </div>
    );
  }
}

export default SubNode;