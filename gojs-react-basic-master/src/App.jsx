/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/
import * as go from 'gojs';
import { produce } from 'immer';
import * as React from 'react';
import { useState } from 'react';
import { DiagramWrapper } from './components/DiagramWrapper';

import './App.css';
import data from "./components/data.jsx";

function App (props) {
    //this.init = this.init.bind(this);
        return (<div>
        <p>
          Try moving around nodes, editing text, relinking, undoing (Ctrl-Z), etc. within the diagram
          and you'll notice the changes are reflected in the inspector area. You'll also notice that changes
          made in the inspector are reflected in the diagram. If you use the React dev tools,
          you can inspect the React state and see it updated as changes happen.
        </p>
        <p>
          Check out the <a href='https://gojs.net/latest/intro/react.html' target='_blank' rel='noopener noreferrer'>Intro page on using GoJS with React</a> for more information.
        </p>
        {/* <DiagramWrapper linkFromPortIdProperty={"fromPort"} linkToPortIdProperty={"toPort"} nodeDataArray={nodeDataArray} linkDataArray={linkDataArray} modelData={modelData} skipsDiagramUpdate={skipsDiagramUpdate} onDiagramEvent={handleDiagramEvent} onModelChange={handleModelChange}/> */}
        <DiagramWrapper data={data}></DiagramWrapper>
      </div>);
}
export default App;
