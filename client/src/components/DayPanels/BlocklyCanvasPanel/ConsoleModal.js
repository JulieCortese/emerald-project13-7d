import {Button, Checkbox} from 'antd';
import React, {useState} from "react";
import { openConnection, disconnect, writeToPort } from "../ConsoleView";

export default function ConsoleModal(props) {
    const [connectionOpen, setConnectionOpen] = useState(false);
    const [baudRate, setBaudRate] = useState(9600);
    const [input, setInput] = useState('');
    const [newLine, setnewLine] = useState(false);

    const handleConnect = async () => {
        if(!connectionOpen){
            if(typeof window['port'] === 'undefined'){
                const filters = [
                    { usbVendorId: 0x2341, usbProductId: 0x0043 },
                    { usbVendorId: 0x2341, usbProductId: 0x0001 }
                  ];
                let port;
                try{
                    port = await navigator.serial.requestPort({ filters });
                }
                catch(e){
                    console.log(e);
                    return;
                }
                window['port'] = port;
            }
            setConnectionOpen(true);
            document.getElementById("connect-button").innerHTML = "Disconnect";
            openConnection(baudRate, newLine);
        }
        else{
            console.log('Close connection');
            disconnect();
            setConnectionOpen(false);
            document.getElementById("connect-button").innerHTML = "Connect";
        }
    }

    const handleChange = (event) => {
        setBaudRate(event.target.value);
    }

    const sendInput = () =>{
        if(!connectionOpen){
            window.alert("Connection not opened.");
            return;
        }
        console.log(input);
        writeToPort(input);
    }

    return(
        <div id="console-container">
            <label className = "label">Baud Rate: </label>
            <select value={baudRate} onChange={handleChange}>
                <option value="9600" >9600</option>
                <option value="300">300</option>
                <option value="600">600</option>
                <option value="1200">1200</option>
                <option value="2400">2400</option>
                <option value="4800">4800</option>
                <option value="14400">14400</option>
                <option value="19200">19200</option>
                <option value="28800">28800</option>
                <option value="31250">31250</option>
                <option value="38400">38400</option>
                <option value="57600">57600</option>
                <option value="115200">115200</option>
            </select>
            <Button id="connect-button" onClick = {()=>handleConnect()}>Connect</Button>
            <Checkbox checked={newLine} disabled={connectionOpen} onClick={()=>{setnewLine(!newLine)}}>New Line</Checkbox>
            <div>
                <input type="text" value={input} placeholder="Enter your message" onChange={e => {setInput(e.target.value)}}></input>
                <Button id="connect-button" onClick = {()=>sendInput()}>Send</Button>
            </div>
            <div id="content-container">
                <p id="console-content">Waiting for input...</p>
            </div>
        </div>
    )
}