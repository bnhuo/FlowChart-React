/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import { produce } from 'immer';
import * as React from 'react';

import { DiagramWrapper } from './components/DiagramWrapper';
import { SelectionInspector } from './components/SelectionInspector';

import './App.css';
import data from "./components/data.jsx";

/**
 * Use a linkDataArray since we'll be using a GraphLinksModel,
 * and modelData for demonstration purposes. Note, though, that
 * both are optional props in ReactDiagram.
 */
interface AppState {
  linkFromPortIdProperty: string;
  linkToPortIdProperty: string;
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  selectedData: go.ObjectData | null;
  skipsDiagramUpdate: boolean;
}

class App extends React.Component<{}, AppState> {
  // Maps to store key -> arr index for quick lookups
  private mapNodeKeyIdx: Map<go.Key, number>;
  private mapLinkKeyIdx: Map<go.Key, number>;

  constructor(props: object) {
    super(props);
    this.init = this.init.bind(this);
    this.state = {
      linkFromPortIdProperty: "fromPort",
      linkToPortIdProperty: "toPort",
      nodeDataArray: [],
      linkDataArray: [
        {from: -3, to: 0, fromPort: "R", toPort: "L"},
        {from: 0, to: "1", fromPort: "R", toPort: "L"},
        {from: 1, to: "2", fromPort: "R", toPort: "L"},
        {from: 2, to: "3", fromPort: "R", toPort: "L"},
        {"from": 0, "to": 1, "color": "red", "fromPort": "T", "toPort": "T"},
        {from: 1, to: "-2", color: "red", fromPort: "T", toPort: "T"}
                      ],
      modelData: {
        canRelink: true
      },
      selectedData: null,
      skipsDiagramUpdate: false
    };
    // init maps
    this.mapNodeKeyIdx = new Map<go.Key, number>();
    this.mapLinkKeyIdx = new Map<go.Key, number>();
    this.refreshNodeIndex(this.state.nodeDataArray);
    //this.refreshLinkIndex(this.state.linkDataArray);
    // bind handler methods
    this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRelinkChange = this.handleRelinkChange.bind(this);
  }

  /**
   * Update map of node keys to their index in the array.
   */
  private refreshNodeIndex(nodeArr: Array<go.ObjectData>) {
    this.mapNodeKeyIdx.clear();
    nodeArr.forEach((n: go.ObjectData, idx: number) => {
      this.mapNodeKeyIdx.set(n.key, idx);
    });
  }

  /**
   * Update map of link keys to their index in the array.
   */
  

  /**
   * Handle any relevant DiagramEvents, in this case just selection changes.
   * On ChangedSelection, find the corresponding data and set the selectedData state.
   * @param e a GoJS DiagramEvent
   */
  public handleDiagramEvent(e: go.DiagramEvent) {
    const name = e.name;
    switch (name) {
      case 'ChangedSelection': {
        const sel = e.subject.first();
        this.setState(
          produce((draft: AppState) => {
            if (sel) {
              if (sel instanceof go.Node) {
                const idx = this.mapNodeKeyIdx.get(sel.key);
                if (idx !== undefined && idx >= 0) {
                  const nd = draft.nodeDataArray[idx];
                  draft.selectedData = nd;
                }
              } else if (sel instanceof go.Link) {
                const idx = this.mapLinkKeyIdx.get(sel.key);
                if (idx !== undefined && idx >= 0) {
                  const ld = draft.linkDataArray[idx];
                  draft.selectedData = ld;
                }
              }
            } else {
              draft.selectedData = null;
            }
          })
        );
        break;
      }
      default: break;
    }
  }

  /**
   * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
   * This method iterates over those changes and updates state to keep in sync with the GoJS model.
   * @param obj a JSON-formatted string
   */
  public handleModelChange(obj: go.IncrementalData) {
    const insertedNodeKeys = obj.insertedNodeKeys;
    const modifiedNodeData = obj.modifiedNodeData;
    const removedNodeKeys = obj.removedNodeKeys;
    const insertedLinkKeys = obj.insertedLinkKeys;
    const modifiedLinkData = obj.modifiedLinkData;
    const removedLinkKeys = obj.removedLinkKeys;
    const modifiedModelData = obj.modelData;

    // maintain maps of modified data so insertions don't need slow lookups
    const modifiedNodeMap = new Map<go.Key, go.ObjectData>();
    const modifiedLinkMap = new Map<go.Key, go.ObjectData>();
    this.setState(
      produce((draft: AppState) => {
        let narr = draft.nodeDataArray;
        if (modifiedNodeData) {
          modifiedNodeData.forEach((nd: go.ObjectData) => {
            modifiedNodeMap.set(nd.key, nd);
            const idx = this.mapNodeKeyIdx.get(nd.key);
            if (idx !== undefined && idx >= 0) {
              narr[idx] = nd;
              if (draft.selectedData && draft.selectedData.key === nd.key) {
                draft.selectedData = nd;
              }
            }
          });
        }
        if (insertedNodeKeys) {
          insertedNodeKeys.forEach((key: go.Key) => {
            const nd = modifiedNodeMap.get(key);
            const idx = this.mapNodeKeyIdx.get(key);
            if (nd && idx === undefined) {  // nodes won't be added if they already exist
              this.mapNodeKeyIdx.set(nd.key, narr.length);
              narr.push(nd);
            }
          });
        }
        if (removedNodeKeys) {
          narr = narr.filter((nd: go.ObjectData) => {
            if (removedNodeKeys.includes(nd.key)) {
              return false;
            }
            return true;
          });
          draft.nodeDataArray = narr;
          this.refreshNodeIndex(narr);
        }

        let larr = draft.linkDataArray;
        if (modifiedLinkData) {
          modifiedLinkData.forEach((ld: go.ObjectData) => {
            modifiedLinkMap.set(ld.key, ld);
            const idx = this.mapLinkKeyIdx.get(ld.key);
            if (idx !== undefined && idx >= 0) {
              larr[idx] = ld;
              if (draft.selectedData && draft.selectedData.key === ld.key) {
                draft.selectedData = ld;
              }
            }
          });
        }
        if (insertedLinkKeys) {
          insertedLinkKeys.forEach((key: go.Key) => {
            const ld = modifiedLinkMap.get(key);
            const idx = this.mapLinkKeyIdx.get(key);
            if (ld && idx === undefined) {  // links won't be added if they already exist
              this.mapLinkKeyIdx.set(ld.key, larr.length);
              larr.push(ld);
            }
          });
        }
        if (removedLinkKeys) {
          larr = larr.filter((ld: go.ObjectData) => {
            if (removedLinkKeys.includes(ld.key)) {
              return false;
            }
            return true;
          });
          draft.linkDataArray = larr;
          //this.refreshLinkIndex(larr);
        }
        // handle model data changes, for now just replacing with the supplied object
        if (modifiedModelData) {
          draft.modelData = modifiedModelData;
        }
        draft.skipsDiagramUpdate = true;  // the GoJS model already knows about these updates
      })
    );
  }

  /**
   * Handle inspector changes, and on input field blurs, update node/link data state.
   * @param path the path to the property being modified
   * @param value the new value of that property
   * @param isBlur whether the input event was a blur, indicating the edit is complete
   */
  public handleInputChange(path: string, value: string, isBlur: boolean) {
    this.setState(
      produce((draft: AppState) => {
        const data = draft.selectedData as go.ObjectData;  // only reached if selectedData isn't null
        data[path] = value;
        if (isBlur) {
          const key = data.key;
          if (key < 0) {  // negative keys are links
            const idx = this.mapLinkKeyIdx.get(key);
            if (idx !== undefined && idx >= 0) {
              draft.linkDataArray[idx] = data;
              draft.skipsDiagramUpdate = false;
            }
          } else {
            const idx = this.mapNodeKeyIdx.get(key);
            if (idx !== undefined && idx >= 0) {
              draft.nodeDataArray[idx] = data;
              draft.skipsDiagramUpdate = false;
            }
          }
        }
      })
    );
  }

  /**
   * Handle changes to the checkbox on whether to allow relinking.
   * @param e a change event from the checkbox
   */
  public handleRelinkChange(e: any) {
    const target = e.target;
    const value = target.checked;
    this.setState({ modelData: { canRelink: value }, skipsDiagramUpdate: false });
  }

  //Generate Node Data
  public generateNodeData(xPosition, yPosition) {
    var diagramModel: object[] = [];
    var tempString = {};
    tempString = {"key":"-3" , "category":"Start", "loc": xPosition + " " + yPosition , "text":"Starting Test"};
    diagramModel.push(tempString);
    xPosition += 250;
    for (var index = 0; index < data.Tests.length; index++) {
      tempString = {"key": index, "loc":xPosition + " " + yPosition, "text": data.Tests[index].Property.Name + " " + data.Tests[index].Property.TestLevel};
      xPosition += 250;
      diagramModel.push(tempString);
    }

    tempString = {"key":-1,"loc": xPosition + " " + yPosition, "text":"Test Passed!", "category":"End"};
    diagramModel.push(tempString);
    yPosition -= 150;
    tempString = {"key":-2,"loc": xPosition + " " + yPosition, "text":"Test Failed", "category":"Failed"};
    diagramModel.push(tempString);
    console.log(diagramModel);
    this.setState({
      nodeDataArray: diagramModel,
      skipsDiagramUpdate: false,
    });
  }


  public generateArrayData(xPosition, yPosition) {

    //Generate link Data
    var diagramModel: object[] = [];
    var tempString = {}
    var pass = "";
    var fail = "";
    var lineColor = ""; //Green or red for pass or fail
    let color = "";
    tempString = {"from":-3, "to":0, "fromPort":"R", "toPort":"L"}
    diagramModel.push(tempString);

    //Write flow for Passed Tests
    for (var index = 0; index < data.Tests.length; index++) {
      if (data.Tests[index].Property.OnPass.Type == "goto") {
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //For now the Param will be the Key, but should be string converted to key in future
        pass = data.Tests[index].Property.OnPass.Param;
      }
      else if (data.Tests[index].Property.OnPass.Type == "none") {
        pass = (index + 1).toString();
      }
      else if (data.Tests[index].Property.OnPass.Type == "exit") {
        pass = "-1"
      }
      tempString = {"from": index , "to":pass , "fromPort":"R", "toPort":"L"}
      diagramModel.push(tempString);
    }

    //Writing flow for Failed tests
    for (var index = 0; index < data.Tests.length; index++) {
      if (data.Tests[index].Property.TestLevel == "pass-on-fail") {
        fail = (index + 1).toString();
        color = "red";
      }
      else if (data.Tests[index].Property.TestLevel == "stop-on-fail") {
        fail = (-2).toString();
        color = "red";
      }
      else if (data.Tests[index].Property.TestLevel == "continue-on-fail") {
        fail = (index + 1).toString();
        color = "red";
      }

      if (index === data.Tests.length - 1 && data.Tests[index].Property.TestLevel == "stop-on-fail") {
        tempString = {"from":index, "to":-2 , "color":color  , "fromPort":"T", "toPort":"T"}
      }
      else if (index === data.Tests.length - 1 && data.Tests[index].Property.TestLevel == "continue-on-fail") {
        tempString = {"from": index , "to":"-1" , "color":color, "fromPort":"T", "toPort":"T"}
      }
      else {
        tempString = {"from": index, "to":fail, "color":color , "fromPort":"T", "toPort":"T"}
      }

      diagramModel.push(tempString);
    }

    console.log("Diagram Model: \n",diagramModel)
    this.setState({
      linkDataArray: diagramModel,
      skipsDiagramUpdate: false,
    });
  }
  public init(){
    console.log(data);
    var xPosition = -200
    var yPosition = 160
    this.generateNodeData(xPosition, yPosition);
    this.generateArrayData(xPosition, yPosition);
  }


  public render() {
    const selectedData = this.state.selectedData;
    let inspector;
    if (selectedData !== null) {
      inspector = <SelectionInspector
                    selectedData={this.state.selectedData}
                    onInputChange={this.handleInputChange}
                  />;
    }

    return (
      <div>
        <p>
          Try moving around nodes, editing text, relinking, undoing (Ctrl-Z), etc. within the diagram
          and you'll notice the changes are reflected in the inspector area. You'll also notice that changes
          made in the inspector are reflected in the diagram. If you use the React dev tools,
          you can inspect the React state and see it updated as changes happen.
        </p>
        <p>
          Check out the <a href='https://gojs.net/latest/intro/react.html' target='_blank' rel='noopener noreferrer'>Intro page on using GoJS with React</a> for more information.
        </p>
        <DiagramWrapper
          linkFromPortIdProperty={"fromPort"}
          linkToPortIdProperty={"toPort"}
          nodeDataArray={this.state.nodeDataArray}
          linkDataArray={this.state.linkDataArray}
          modelData={this.state.modelData}
          skipsDiagramUpdate={this.state.skipsDiagramUpdate}
          onDiagramEvent={this.handleDiagramEvent}
          onModelChange={this.handleModelChange}
        />
        <button  style={{ border: "solid 1 gray", height: 30 }} onClick={this.init}>Show Recipe Flow</button>
        <label>
          Allow Relinking?
          <input
            type='checkbox'
            id='relink'
            checked={this.state.modelData.canRelink}
            onChange={this.handleRelinkChange} />
        </label>
        {inspector}
      </div>
    );
  }
}

export default App;
