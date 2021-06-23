/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/

import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import * as React from 'react';

import { GuidedDraggingTool } from '../GuidedDraggingTool';

import './Diagram.css';

interface DiagramProps {
  linkFromPortIdProperty: any;
  linkToPortIdProperty: any;
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

export class DiagramWrapper extends React.Component<DiagramProps, {}> {
  /**
   * Ref to keep a reference to the Diagram component, which provides access to the GoJS diagram via getDiagram().
   */
  private diagramRef: React.RefObject<ReactDiagram>;

  /** @internal */
  constructor(props: DiagramProps) {
    super(props);
    this.diagramRef = React.createRef();
  }

  /**
   * Get the diagram reference and add any desired diagram listeners.
   * Typically the same function will be used for each listener, with the function using a switch statement to handle the events.
   */
  public componentDidMount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Get the diagram reference and remove listeners that were added during mounting.
   */
  public componentWillUnmount() {
    if (!this.diagramRef.current) return;
    const diagram = this.diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.removeDiagramListener('ChangedSelection', this.props.onDiagramEvent);
    }
  }

  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model, any templates,
   * and maybe doing other initialization tasks like customizing tools.
   * The model's data should not be set here, as the ReactDiagram component handles that.
   */
  private initDiagram(): go.Diagram {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram =
      $(go.Diagram,
        {
          'undoManager.isEnabled': true,  // must be set to allow for model change listening
          // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
          'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
          draggingTool: new GuidedDraggingTool(),  // defined in GuidedDraggingTool.ts
          'draggingTool.horizontalGuidelineColor': 'blue',
          'draggingTool.verticalGuidelineColor': 'blue',
          'draggingTool.centerGuidelineColor': 'green',
          'draggingTool.guidelineWidth': 1,
          model: $(go.GraphLinksModel,
            {
              linkKeyProperty: 'key',  // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
              // positive keys for nodes
              makeUniqueKeyFunction: (m: go.Model, data: any) => {
                let k = data.key || 1;
                while (m.findNodeDataForKey(k)) k++;
                data.key = k;
                return k;
              },
              // negative keys for links
              makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
                let k = data.key || -1;
                while (m.findLinkDataForKey(k)) k--;
                data.key = k;
                return k;
              }
            })
        });

        function nodeStyle() {
          return [
            // The Node.location comes from the "loc" property of the node data,
            // converted by the Point.parse static method.
            // If the Node.location is changed, it updates the "loc" property of the node data,
            // converting back using the Point.stringify static method.
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
              go.Point.stringify
            ),
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
        function makePort(name, spot, output, input) {
          // the port is basically just a small circle that has a white stroke when it is made visible
          return $(go.Shape, "Square", {
            fill: "transparent",
            stroke: null, // this is changed to "white" in the showPorts function
            desiredSize: new go.Size(8, 8),
            alignment: spot,
            alignmentFocus: spot, // align the port on the main Shape
            portId: name, // declare this object to be a "port"
            fromSpot: spot,
            toSpot: spot, // declare where links may connect at this port
            fromLinkable: output,
            toLinkable: input, // declare whether the user may draw links to/from here
            cursor: "pointer", // show a different cursor to indicate potential link point
          });
        }
    
        // define the Node templates for regular nodes
    
        var lightText = "whitesmoke";
    
        diagram.nodeTemplateMap.add(
          "", // the default category
          $(
            go.Node,
            "Spot",
            nodeStyle(),
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(
              go.Panel,
              "Auto",
              $(
                go.Shape,
                "RoundedRectangle",
                { name: "SHAPE", fill: "green", stroke: null },
                new go.Binding("fill", "color"),
                new go.Binding("figure", "figure")
              ),
              $(
                go.TextBlock,
                {
                  name: "TB",
                  font: "bold 11pt Helvetica, Arial, sans-serif",
                  stroke: lightText,
                  margin: 8,
                  maxSize: new go.Size(160, NaN),
                  wrap: go.TextBlock.WrapFit,
                  editable: true,
                },
                new go.Binding("text").makeTwoWay()
              )
            ),
            // four named ports, one on each side:
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, false)
          )
        );
    
        diagram.nodeTemplateMap.add(
          "Failed", // the default category
          $(
            go.Node,
            "Spot",
            nodeStyle(),
            // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
            $(
              go.Panel,
              "Auto",
              $(
                go.Shape,
                "square",
                { name: "SHAPE", fill: "#FF6347", stroke: null },
                new go.Binding("figure", "figure")
              ),
              $(
                go.TextBlock,
                {
                  name: "TB",
                  font: "bold 11pt Helvetica, Arial, sans-serif",
                  stroke: lightText,
                  margin: 8,
                  maxSize: new go.Size(160, NaN),
                  wrap: go.TextBlock.WrapFit,
                  editable: true,
                },
                new go.Binding("text").makeTwoWay()
              )
            ),
            // four named ports, one on each side:
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, true, true),
            makePort("R", go.Spot.Right, true, true),
            makePort("B", go.Spot.Bottom, true, false)
          )
        );
    
        diagram.nodeTemplateMap.add(
          "Start",
          $(
            go.Node,
            "Spot",
            nodeStyle(),
            $(
              go.Panel,
              "Auto",
              $(go.Shape, "Circle", {
                minSize: new go.Size(40, 40),
                fill: "#79C900",
                stroke: null,
              }),
              $(
                go.TextBlock,
                "Start",
                {
                  font: "bold 11pt Helvetica, Arial, sans-serif",
                  stroke: lightText,
                },
                new go.Binding("text")
              )
            ),
            // three named ports, one on each side except the top, all output only:
            makePort("L", go.Spot.Left, true, false),
            makePort("R", go.Spot.Right, true, false),
            makePort("B", go.Spot.Bottom, true, false)
          )
        );
    
        diagram.nodeTemplateMap.add(
          "End",
          $(
            go.Node,
            "Spot",
            nodeStyle(),
            $(
              go.Panel,
              "Auto",
              $(go.Shape, "Circle", {
                minSize: new go.Size(40, 40),
                fill: "#79C900",
                stroke: null,
              }),
              $(
                go.TextBlock,
                "End",
                {
                  font: "bold 11pt Helvetica, Arial, sans-serif",
                  stroke: lightText,
                },
                new go.Binding("text")
              )
            ),
            // three named ports, one on each side except the bottom, all input only:
            makePort("T", go.Spot.Top, false, true),
            makePort("L", go.Spot.Left, false, true),
            makePort("R", go.Spot.Right, false, true)
          )
        );
    
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
    
        diagram.nodeTemplateMap.add(
          "Title",
          $(
            go.Node,
            "Auto",
            nodeStyle(),
            $(go.Shape, "File", { fill: "#EFFAB4", stroke: null }),
            $(
              go.TextBlock,
              {
                margin: 5,
                maxSize: new go.Size(200, NaN),
                wrap: go.TextBlock.WrapFit,
                textAlign: "center",
                editable: true,
                font: "bold 12pt Helvetica, Arial, sans-serif",
                stroke: "#454545",
              },
              new go.Binding("text").makeTwoWay()
            )
            // no ports, because no links are allowed to connect with a comment
          )
        );
    
        // replace the default Link template in the linkTemplateMap
        diagram.linkTemplate = $(
          go.Link, // the whole link panel
          {
            routing: go.Link.AvoidsNodes,
            curve: go.Link.JumpOver,
            corner: 5,
            toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            // mouse-overs subtly highlight links:
            
          },
          new go.Binding("points").makeTwoWay(),
          $(
            go.Shape, // the highlight shape, normally transparent
            {
              isPanelMain: true,
              strokeWidth: 8,
              stroke: "transparent",
              name: "HIGHLIGHT",
            }
          ),
          $(
            go.Shape, // the link path shape
            { isPanelMain: true, stroke: "green", strokeWidth: 2 },
            new go.Binding("stroke", "color")
          ),
          $(
            go.Shape, // the arrowhead
            { toArrow: "standard", strokeWidth: 0, fill: "green" },
            new go.Binding("fill", "color")
          ),
          $(
            go.Panel,
            "Auto", // the link label, normally not visible
            {
              visible: false,
              name: "LABEL",
              segmentIndex: 2,
              segmentFraction: 0.5,
            },
            new go.Binding("visible", "visible").makeTwoWay(),
            $(
              go.Shape,
              "RoundedRectangle", // the label shape
              { fill: "#F8F8F8", stroke: null }
            ),
            $(
              go.TextBlock,
              "Yes", // the label
              {
                textAlign: "center",
                font: "10pt helvetica, arial, sans-serif",
                stroke: "#333333",
                editable: true,
              },
              new go.Binding("text").makeTwoWay()
            )
          )
        );
    
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
          if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
          node.ports.each(function (port) {
            port.stroke = show ? "white" : null;
          });
        }

    return diagram;
  }

  public render() {
    return (
      <ReactDiagram
        ref={this.diagramRef}
        divClassName='diagram-component'
        initDiagram={this.initDiagram}
        nodeDataArray={this.props.nodeDataArray}
        linkDataArray={this.props.linkDataArray}
        modelData={this.props.modelData}
        onModelChange={this.props.onModelChange}
        skipsDiagramUpdate={this.props.skipsDiagramUpdate}
      />
    );
  }
}
