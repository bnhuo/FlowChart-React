/*
*  Copyright (C) 1998-2021 by Northwoods Software Corporation. All Rights Reserved.
*/
import * as React from 'react';
import './Inspector.css';
export function InspectorRow (props) {
    

    const handleInputChange = (e)=> {
        props.onInputChange(props.id, e.target.value, e.type === 'blur');
    }

    let formatLocation = (loc) => {
        const locArr = loc.split(' ');
        if (locArr.length === 2) {
            const x = parseFloat(locArr[0]);
            const y = parseFloat(locArr[1]);
            if (!isNaN(x) && !isNaN(y)) {
                return `${x.toFixed(0)} ${y.toFixed(0)}`;
            }
        }
        return loc;
    }
    
    let val = props.value;
    if (props.id === 'loc') {
        val = formatLocation(props.value);
    }
    return (<tr>
    <td>{props.id}</td>
    <td>
        <input disabled={props.id === 'key'} value={val} onChange={handleInputChange} onBlur={handleInputChange}>
        </input>
    </td>
    </tr>);
    
}
