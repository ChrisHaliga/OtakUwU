import React from 'react'
import Platform from './platform.component';
import { Form, Button, FormGroup, FormControl, ControlLabel, Row } from "react-bootstrap";
import Col from 'react-bootstrap/Col';

export default function show( {show, all_platforms} ) {

    return (   
        <div class="jumbotron mt-3 container h-100 d-flex"style={{backgroundColor: "#FF69B4" ,width:"70%", padding:"20px", marginBottom:"10px"}}>
            <Row>
                <Col><img src={(!show.icon || show.icon == "default" || !show.icon.includes("http"))? process.env.PUBLIC_URL +"/imgs/not_found.gif":show.icon} 
                alt={`Cover art for ${show.title}`} width="100px" height ="140px" /></Col>
                <Col md="auto">
                <h2>{show.title}</h2>
                <h4>Available On ...</h4>
                {
                    all_platforms.filter(platform => 
                        show.links.includes(platform._id)
                    ).map(platform => <Platform platform={platform}/>)
                }
                </Col>
            </Row>
        </div>
    )
}