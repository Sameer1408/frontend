import React,{useEffect, useState} from 'react'
import InsideOrderListing from './InsideOrderListing';
import io from 'socket.io-client'
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import sound from '../audio/sound.mp3'
import {Howl, Howler} from 'howler';
const socket = io.connect('http://localhost:4000')
socket.on('connect', () => {
    console.log(`I'm connected with the back-end`);
});

toast.configure()

function OrderListingCompo(props) {
    
    const playSound = (src)=>{
        var sound = new Howl({
          src,
          volume: 0.5
        });
        sound.play();
      }
    const {orderItems,totalAmount,createdAt} = props.order;
    const {cart} = orderItems;
    const {cartItems} = cart;
    const [currentStatus, setCurrentStatus] = useState(props.order.status)
    let date = String(createdAt).slice(0,10);
    
    useEffect(() => {
        socket.emit('join',`order_${props.order._id}`) 
        socket.on('orderUpdated',(data)=>{
            updateStatus(data);
           // console.log(data)
        })
    }, [])

    const updateStatus=(data)=>{
        if(data.id==props.order._id){
        console.log(data.id)
        setCurrentStatus(data.status)
        toast(`Order status updated to ${data.status}`)}
        playSound(sound)
    }


    return (
        <div style={{border:"2px solid black",margin:"20px 0px"}}>
        Odered On  : {date}
        {
            cartItems.map((e)=>{
            return <InsideOrderListing order={e} />
            })
        }
        Total Amount : Rs{totalAmount}
         {currentStatus}
        </div>
    )
}
export default OrderListingCompo