import React, { useState } from 'react'
import axios from 'axios'
import './Style/ChatBot.css'
import chatbotimg from './Pics/chatbot.png'
export default function ChatBot() {
    const [example,setExample] = useState([])
    const [question,setQuestion] = useState();
    const [answer,setAnswer] = useState();

    const muplitpleEvent = async function(que){
        setAnswer('')
        setExample([])
        setQuestion(que);
        try{
        const response = await axios.post(`http://localhost:5000/example/${que}`,{})
        if(response.data.examples){
            setExample(response.data.examples);
        }}
        catch(error){
            console.log(error)
        }
    }

    const GetSingleAnswer = async function(event){
        event.preventDefault();
        const response = await axios.post('http://localhost:5000/query',{
            Question:question
        })
        if(response.data.answer){
            setAnswer(response.data.answer);
        }
    }
  return (
    <div>
        <div className='ChatBot-pic'>
            <img src = {chatbotimg} alt="CB" />
        </div>
        <div className='ChatBot-functions'>
        <div className = 'Query-outerBox'>
        <form onSubmit={GetSingleAnswer}>
            <h2>Query </h2>
            <div >
                <ol>
                {example.map((ex)=>(
                    <div onClick={(event)=>{muplitpleEvent(ex.Question)}}><li>{ex.Question}</li></div>
                ))}
                </ol>
            </div>
            <br/>
            <div style={{color:'green'}}>
                {answer}
            </div>
            <br/>
            <div className='chatbot-bottom'>
                <input required type='text' onChange={(event)=>{muplitpleEvent(event.target.value)}}></input>
                <div className='query-button'>
                    <button type='submit'>Get</button>
                </div>
            </div>
        </form>
    </div>
        </div>
    </div>
  )
}
