import React from 'react'


// This component contains the lists of the users messaged by the owner of the account 
const Chatlist = () => {
  return (
    <div className='Chatlist'>
        <div className="user">
            <div className='user-cont'>
                <img
            src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            />
            <div className="userProfile">
                <span>Username</span>
                <p>Hello World</p>
            </div>
            </div>
            <div className="time">8:32 pm</div>
        </div>
        <div className="user">
            <div className='user-cont'>
                <img
            src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            />
            <div className="userProfile">
                <span>Username</span>
                <p>Hello World</p>
            </div>
            </div>
            <div className="time">8:32 pm</div>
        </div>
        <div className="user">
            <div className='user-cont'>
                <img
            src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            />
            <div className="userProfile">
                <span>Username</span>
                <p>Hello World</p>
            </div>
            </div>
            <div className="time">8:32 pm</div>
        </div>    
    </div>
  )
}

export default Chatlist
