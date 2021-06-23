/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import * as React from 'react';
import { useEffect, useState } from "react";
import { GuidedDraggingTool } from '../GuidedDraggingTool';
import { SelectionInspector } from './SelectionInspector';
import './Diagram.css';

export function DiagramWrapper (props) {
    /** @internal */
    const [nodeDataArray, setnodeDataArray] = useState([]);
    const [linkDataArray, setlinkDataArray] = useState([
        { from: -3, to: 0, fromPort: "R", toPort: "L" },
        { from: 0, to: "1", fromPort: "R", toPort: "L" },
        { from: 1, to: "2", fromPort: "R", toPort: "L" },
        { from: 2, to: "3", fromPort: "R", toPort: "L" },
        { "from": 0, "to": 1, "color": "red", "fromPort": "T", "toPort": "T" },
        { from: 1, to: "-2", color: "red", fromPort: "T", toPort: "T" }])
    const [modelData, setmodelData] = useState( {canRelink:true} );
    const [selectedData, setSelectedData] = useState(null);
    const [skipsDiagramUpdate, setskipsDiagramUpdate] = useState(false);
    const [data, setData] = useState(props.data);
    console.log(data);
    // init maps
    let mapNodeKeyIdx = new Map();
    let mapLinkKeyIdx = new Map();
        //this.refreshNodeIndex(this.state.nodeDataArray);
        //this.refreshLinkIndex(this.state.linkDataArray);
        // bind handler methods
        // this.handleDiagramEvent = this.handleDiagramEvent.bind(this);
        // this.handleModelChange = this.handleModelChange.bind(this);
        // this.handleInputChange = this.handleInputChange.bind(this);
        // this.handleRelinkChange = this.handleRelinkChange.bind(this);
    
    /**
     * Update map of node keys to their index in the array.
     */
    const refreshNodeIndex = (nodeArr) => {
        mapNodeKeyIdx.clear();
        nodeArr.forEach((n, idx) => {
            mapNodeKeyIdx.set(n.key, idx);
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
    const handleDiagramEvent = (e) => {
        const name = e.name;
        switch (name) {
            case 'ChangedSelection': {
                const sel = e.subject.first();
                //
                if (sel) {
                    if (sel instanceof go.Node) {
                        const idx = mapNodeKeyIdx.get(sel.key);
                        if (idx !== undefined && idx >= 0) {
                            const nd = nodeDataArray[idx];
                            setSelectedData(nd);
                        }
                    }
                    else if (sel instanceof go.Link) {
                        const idx = mapLinkKeyIdx.get(sel.key);
                        if (idx !== undefined && idx >= 0) {
                            const ld = linkDataArray[idx];
                            setSelectedData(ld);
                        }
                    }
                }
                else {
                    setSelectedData(null);
                }
                //
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
    const handleModelChange = (obj) => {
        const insertedNodeKeys = obj.insertedNodeKeys;
        const modifiedNodeData = obj.modifiedNodeData;
        const removedNodeKeys = obj.removedNodeKeys;
        const insertedLinkKeys = obj.insertedLinkKeys;
        const modifiedLinkData = obj.modifiedLinkData;
        const removedLinkKeys = obj.removedLinkKeys;
        const modifiedModelData = obj.modelData;
        // maintain maps of modified data so insertions don't need slow lookups
        const modifiedNodeMap = new Map();
        const modifiedLinkMap = new Map();
        
        let narr = nodeDataArray;
        if (modifiedNodeData) {
            modifiedNodeData.forEach((nd) => {
                modifiedNodeMap.set(nd.key, nd);
                const idx = mapNodeKeyIdx.get(nd.key);
                if (idx !== undefined && idx >= 0) {
                    narr[idx] = nd;
                    if (selectedData && selectedData.key === nd.key) {
                        setSelectedData(nd);
                    }
                }
            });
        }
        if (insertedNodeKeys) {
            insertedNodeKeys.forEach((key) => {
                const nd = modifiedNodeMap.get(key);
                const idx = mapNodeKeyIdx.get(key);
                if (nd && idx === undefined) { // nodes won't be added if they already exist
                    mapNodeKeyIdx.set(nd.key, narr.length);
                    narr.push(nd);
                }
            });
        }
        if (removedNodeKeys) {
            narr = narr.filter((nd) => {
                if (removedNodeKeys.includes(nd.key)) {
                    return false;
                }
                return true;
            });
            setnodeDataArray(narr);
            refreshNodeIndex(narr);
        }
        let larr = linkDataArray;
        if (modifiedLinkData) {
            modifiedLinkData.forEach((ld) => {
                modifiedLinkMap.set(ld.key, ld);
                const idx = mapLinkKeyIdx.get(ld.key);
                if (idx !== undefined && idx >= 0) {
                    larr[idx] = ld;
                    if (selectedData && selectedData.key === ld.key) {
                        selectedData = ld;
                    }
                }
            });
        }
        if (insertedLinkKeys) {
            insertedLinkKeys.forEach((key) => {
                const ld = modifiedLinkMap.get(key);
                const idx = mapLinkKeyIdx.get(key);
                if (ld && idx === undefined) { // links won't be added if they already exist
                    mapLinkKeyIdx.set(ld.key, larr.length);
                    larr.push(ld);
                }
            });
        }
        if (removedLinkKeys) {
            larr = larr.filter((ld) => {
                if (removedLinkKeys.includes(ld.key)) {
                    return false;
                }
                return true;
            });
            setlinkDataArray(larr);
            //this.refreshLinkIndex(larr);
        }
        // handle model data changes, for now just replacing with the supplied object
        if (modifiedModelData) {
            setmodelData(modifiedModelData);
        }
        setskipsDiagramUpdate(true); // the GoJS model already knows about these updates
        
    }
    /**
     * Handle inspector changes, and on input field blurs, update node/link data state.
     * @param path the path to the property being modified
     * @param value the new value of that property
     * @param isBlur whether the input event was a blur, indicating the edit is complete
     */
    const handleInputChange = (path, value, isBlur) => {
        
        const data = selectedData; // only reached if selectedData isn't null
        data[path] = value;
        if (isBlur) {
            const key = data.key;
            if (key < 0) { // negative keys are links
                const idx = mapLinkKeyIdx.get(key);
                if (idx !== undefined && idx >= 0) {
                    setlinkDataArray[idx]( data);
                    setskipsDiagramUpdate(false);
                }
            }
            else {
                const idx = mapNodeKeyIdx.get(key);
                if (idx !== undefined && idx >= 0) {
                    setnodeDataArray[idx] (data);
                    setskipsDiagramUpdate(false);
                }
            }
        }
        
    }
    /**
     * Handle changes to the checkbox on whether to allow relinking.
     * @param e a change event from the checkbox
     */
    const handleRelinkChange = (e) => {
        const target = e.target;
        const value = target.checked;
        setmodelData({ canRelink: value });
        setskipsDiagramUpdate(false);
    }
    //Generate Node Data
    const generateNodeData = (xPosition, yPosition) => {
        var diagramModel = [];
        var tempString = {};
        tempString = { "key": "-3", "category": "Start", "loc": xPosition + " " + yPosition, "text": "Starting Test" };
        diagramModel.push(tempString);
        xPosition += 250;
        for (var index = 0; index < data.Tests.length; index++) {
            tempString = { "key": index, "loc": xPosition + " " + yPosition, "text": data.Tests[index].Property.Name + " " + data.Tests[index].Property.TestLevel };
            xPosition += 250;
            diagramModel.push(tempString);
        }
        tempString = { "key": -1, "loc": xPosition + " " + yPosition, "text": "Test Passed!", "category": "End" };
        diagramModel.push(tempString);
        yPosition -= 150;
        tempString = { "key": -2, "loc": xPosition + " " + yPosition, "text": "Test Failed", "category": "Failed" };
        diagramModel.push(tempString);
        console.log(diagramModel);
        
        setnodeDataArray(diagramModel);
        setskipsDiagramUpdate(false);
        
    }
    const generateArrayData = (xPosition, yPosition)  => {
        //Generate link Data
        var diagramModel = [];
        var tempString = {};
        var pass = "";
        var fail = "";
        var lineColor = ""; //Green or red for pass or fail
        let color = "";
        tempString = { "from": -3, "to": 0, "fromPort": "R", "toPort": "L" };
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
                pass = "-1";
            }
            tempString = { "from": index, "to": pass, "fromPort": "R", "toPort": "L" };
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
                tempString = { "from": index, "to": -2, "color": color, "fromPort": "T", "toPort": "T" };
            }
            else if (index === data.Tests.length - 1 && data.Tests[index].Property.TestLevel == "continue-on-fail") {
                tempString = { "from": index, "to": "-1", "color": color, "fromPort": "T", "toPort": "T" };
            }
            else {
                tempString = { "from": index, "to": fail, "color": color, "fromPort": "T", "toPort": "T" };
            }
            diagramModel.push(tempString);
        }
        console.log("Diagram Model: \n", diagramModel);
        
        setlinkDataArray (diagramModel);
        setskipsDiagramUpdate(false);
    }
    const init = () => {
        console.log(data);
        var xPosition = -200;
        var yPosition = 160;
        generateNodeData(xPosition, yPosition);
        generateArrayData(xPosition, yPosition);
    }

    let diagramRef = React.createRef();

    /**
     * Get the diagram reference and add any desired diagram listeners.
     * Typically the same function will be used for each listener, with the function using a switch statement to handle the events.
     */
    useEffect(() => {
        if (!diagramRef.current)
            return;
        const diagram = diagramRef.current.getDiagram();
        if (diagram instanceof go.Diagram) {
            diagram.addDiagramListener('ChangedSelection', props.onDiagramEvent);
        }
    }, []);
    /**
     * Get the diagram reference and remove listeners that were added during mounting.
     */
    useEffect(() => {
        if (!diagramRef.current)
            return;
        const diagram = diagramRef.current.getDiagram();
        if (diagram instanceof go.Diagram) {
            return () => {
                diagram.removeDiagramListener('ChangedSelection', props.onDiagramEvent);
            }
        }
    }, [])
    /**
     * Diagram initialization method, which is passed to the ReactDiagram component.
     * This method is responsible for making the diagram and initializing the model, any templates,
     * and maybe doing other initialization tasks like customizing tools.
     * The model's data should not be set here, as the ReactDiagram component handles that.
     */
    const initDiagram = ()=> {
        const $ = go.GraphObject.make;
        // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
        const diagram = $(go.Diagram, {
            'undoManager.isEnabled': true,
            // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
            'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
            draggingTool: new GuidedDraggingTool(),
            'draggingTool.horizontalGuidelineColor': 'blue',
            'draggingTool.verticalGuidelineColor': 'blue',
            'draggingTool.centerGuidelineColor': 'green',
            'draggingTool.guidelineWidth': 1,
            model: $(go.GraphLinksModel, {
                linkFromPortIdProperty: "fromPort",  // required information:
                linkToPortIdProperty: "toPort",
                linkKeyProperty: 'key',
                // positive keys for nodes
                makeUniqueKeyFunction: (m, data) => {
                    let k = data.key || 1;
                    while (m.findNodeDataForKey(k))
                        k++;
                    data.key = k;
                    return k;
                },
                // negative keys for links
                makeUniqueLinkKeyFunction: (m, data) => {
                    let k = data.key || -1;
                    while (m.findLinkDataForKey(k))
                        k--;
                    data.key = k;
                    return k;
                }
            })
        });
        const nodeStyle = ()=> {
            return [
                // The Node.location comes from the "loc" property of the node data,
                // converted by the Point.parse static method.
                // If the Node.location is changed, it updates the "loc" property of the node data,
                // converting back using the Point.stringify static method.
                new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                {
                    // the Node.location is at the center of each node
                    locationSpot: go.Spot.Center,
                    //isShadowed: true,
                    //shadowColor: "#888",
                    // handle mouse enter/leave events to show/hide the ports
                    mouseEnter: function (e, obj) {
                        showPorts(obj.part, true);
                    },
                    mouseLeave: function (e, obj) {
                        showPorts(obj.part, false);
                    },
                },
            ];
        }
        // Define a function for creating a "port" that is normally transparent.
        // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
        // and where the port is positioned on the node, and the boolean "output" and "input" arguments
        // control whether the user can draw links from or to the port.
        const makePort = (name, spot, output, input)=> {
            // the port is basically just a small circle that has a white stroke when it is made visible
            return $(go.Shape, "Square", {
                fill: "transparent",
                stroke: null,
                desiredSize: new go.Size(8, 8),
                alignment: spot,
                alignmentFocus: spot,
                portId: name,
                fromSpot: spot,
                toSpot: spot,
                fromLinkable: output,
                toLinkable: input,
                cursor: "pointer",
            });
        }
        // define the Node templates for regular nodes
        var lightText = "whitesmoke";
        diagram.nodeTemplateMap.add("", // the default category
        $(go.Node, "Spot", nodeStyle(), 
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        $(go.Panel, "Auto", $(go.Shape, "RoundedRectangle", { name: "SHAPE", fill: "green", stroke: null }, new go.Binding("fill", "color"), new go.Binding("figure", "figure")), $(go.TextBlock, {
            name: "TB",
            font: "bold 11pt Helvetica, Arial, sans-serif",
            stroke: lightText,
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
        }, new go.Binding("text").makeTwoWay())), 
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, false, true), makePort("L", go.Spot.Left, true, true), makePort("R", go.Spot.Right, true, true), makePort("B", go.Spot.Bottom, true, false)));
        diagram.nodeTemplateMap.add("Failed", // the default category
        $(go.Node, "Spot", nodeStyle(), 
        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
        $(go.Panel, "Auto", $(go.Shape, "square", { name: "SHAPE", fill: "#FF6347", stroke: null }, new go.Binding("figure", "figure")), $(go.TextBlock, {
            name: "TB",
            font: "bold 11pt Helvetica, Arial, sans-serif",
            stroke: lightText,
            margin: 8,
            maxSize: new go.Size(160, NaN),
            wrap: go.TextBlock.WrapFit,
            editable: true,
        }, new go.Binding("text").makeTwoWay())), 
        // four named ports, one on each side:
        makePort("T", go.Spot.Top, false, true), makePort("L", go.Spot.Left, true, true), makePort("R", go.Spot.Right, true, true), makePort("B", go.Spot.Bottom, true, false)));
        diagram.nodeTemplateMap.add("Start", $(go.Node, "Spot", nodeStyle(), $(go.Panel, "Auto", $(go.Shape, "Circle", {
            minSize: new go.Size(40, 40),
            fill: "#79C900",
            stroke: null,
        }), $(go.TextBlock, "Start", {
            font: "bold 11pt Helvetica, Arial, sans-serif",
            stroke: lightText,
        }, new go.Binding("text"))), 
        // three named ports, one on each side except the top, all output only:
        makePort("L", go.Spot.Left, true, false), makePort("R", go.Spot.Right, true, false), makePort("B", go.Spot.Bottom, true, false)));
        diagram.nodeTemplateMap.add("End", $(go.Node, "Spot", nodeStyle(), $(go.Panel, "Auto", $(go.Shape, "Circle", {
            minSize: new go.Size(40, 40),
            fill: "#79C900",
            stroke: null,
        }), $(go.TextBlock, "End", {
            font: "bold 11pt Helvetica, Arial, sans-serif",
            stroke: lightText,
        }, new go.Binding("text"))), 
        // three named ports, one on each side except the bottom, all input only:
        makePort("T", go.Spot.Top, false, true), makePort("L", go.Spot.Left, false, true), makePort("R", go.Spot.Right, false, true)));
        // taken from ../extensions/Figures.js:
        go.Shape.defineFigureGenerator("File", function (shape, w, h) {
            var geo = new go.Geometry();
            var fig = new go.PathFigure(0, 0, true); // starting point
            geo.add(fig);
            fig.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0));
            fig.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
            fig.add(new go.PathSegment(go.PathSegment.Line, w, h));
            fig.add(new go.PathSegment(go.PathSegment.Line, 0, h).close());
            var fig2 = new go.PathFigure(0.75 * w, 0, false);
            geo.add(fig2);
            // The Fold
            fig2.add(new go.PathSegment(go.PathSegment.Line, 0.75 * w, 0.25 * h));
            fig2.add(new go.PathSegment(go.PathSegment.Line, w, 0.25 * h));
            geo.spot1 = new go.Spot(0, 0.25);
            geo.spot2 = go.Spot.BottomRight;
            return geo;
        });
        diagram.nodeTemplateMap.add("Title", $(go.Node, "Auto", nodeStyle(), $(go.Shape, "File", { fill: "#EFFAB4", stroke: null }), $(go.TextBlock, {
            margin: 5,
            maxSize: new go.Size(200, NaN),
            wrap: go.TextBlock.WrapFit,
            textAlign: "center",
            editable: true,
            font: "bold 12pt Helvetica, Arial, sans-serif",
            stroke: "#454545",
        }, new go.Binding("text").makeTwoWay())
        // no ports, because no links are allowed to connect with a comment
        ));
        // replace the default Link template in the linkTemplateMap
        diagram.linkTemplate = $(go.Link, // the whole link panel
        {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
        }, new go.Binding("points").makeTwoWay(), $(go.Shape, // the highlight shape, normally transparent
        {
            isPanelMain: true,
            strokeWidth: 8,
            stroke: "transparent",
            name: "HIGHLIGHT",
        }), $(go.Shape, // the link path shape
        { isPanelMain: true, stroke: "green", strokeWidth: 2 }, new go.Binding("stroke", "color")), $(go.Shape, // the arrowhead
        { toArrow: "standard", strokeWidth: 0, fill: "green" }, new go.Binding("fill", "color")), $(go.Panel, "Auto", // the link label, normally not visible
        {
            visible: false,
            name: "LABEL",
            segmentIndex: 2,
            segmentFraction: 0.5,
        }, new go.Binding("visible", "visible").makeTwoWay(), $(go.Shape, "RoundedRectangle", // the label shape
        { fill: "#F8F8F8", stroke: null }), $(go.TextBlock, "Yes", // the label
        {
            textAlign: "center",
            font: "10pt helvetica, arial, sans-serif",
            stroke: "#333333",
            editable: true,
        }, new go.Binding("text").makeTwoWay())));
        // Make link labels visible if coming out of a "conditional" node.
        // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
        function showLinkLabel(e) {
            var label = e.subject.findObject("LABEL");
            if (label !== null)
                label.visible = e.subject.fromNode.data.figure === "Diamond";
        }
        // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
        diagram.toolManager.linkingTool.temporaryLink.routing =
            go.Link.Orthogonal;
        diagram.toolManager.relinkingTool.temporaryLink.routing =
            go.Link.Orthogonal;
        function showPorts(node, show) {
            var diagram = node.diagram;
            if (!diagram || diagram.isReadOnly || !diagram.allowLink)
                return;
            node.ports.each(function (port) {
                port.stroke = show ? "white" : null;
            });
        }
        return diagram;
    }
    let inspector;
        if (selectedData !== null) {
            inspector = <SelectionInspector selectedData={selectedData} onInputChange={handleInputChange}/>;
        }
    
    return (
        <div>
        <ReactDiagram ref={diagramRef} 
            divClassName='diagram-component' 
            initDiagram={initDiagram} 
            nodeDataArray={nodeDataArray} 
            linkDataArray={linkDataArray} 
            modelData={modelData} 
            skipsDiagramUpdate={skipsDiagramUpdate}/>
            <button style={{ border: "solid 1 gray", height: 30 }} onClick={init}>Show Recipe Flow</button>
            {inspector}
        </div>); 
}
