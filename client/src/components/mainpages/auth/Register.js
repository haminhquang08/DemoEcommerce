import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import axios from 'axios'

function Register() {
    const [user, setUser] = useState({
        name:'', email:'', password: ''
    })

    const onChangeInput = e =>{
        const {name, value} = e.target;
        setUser({...user, [name]:value})
    }

    const registerSubmit = async e =>{  
        e.preventDefault()
        try {
            await axios.post('/user/register', {...user})

            localStorage.setItem('firstLogin', true)

            window.location.href = "/";
            alert("Đăng ký tài khoản thành công!")
        } catch (err) {
            alert(err.response.data.message)
        }
    }

    return (
        <div className="login-page">
            <form onSubmit={registerSubmit}>
                <h2>Đăng ký tài khoản</h2>
                <input type="text" name="name" required
                placeholder="Name" value={user.name} onChange={onChangeInput} />

                <input type="email" name="email" required
                placeholder="Email" value={user.email} onChange={onChangeInput} />

                <input type="password" name="password" required autoComplete="on"
                placeholder="Password" value={user.password} onChange={onChangeInput} />

                <div className="row">
                    <button type="submit">Đăng ký</button>
                    <Link to="/login">Đăng nhập</Link>
                </div>
            </form>
        </div>
    )
}

export default Register