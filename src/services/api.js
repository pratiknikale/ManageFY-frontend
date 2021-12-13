import axios from 'axios';

const API = axios.create({baseURL: 'https://mytodo-mern-app.herokuapp.com'});

API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')){
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }

    return req;
})

export const getList = async () => {
    return await API.get('/api/get');
}

export const getEdit = async (id) => {
    return await API.get(`/api/getId/${id}`);
}

export const editItem = async (id, data) => {
    return await API.put('/api/edit', {id: id, data: data});
}

export const updateStatus = async (id, status, stask) => {     //REVISIT ....can be better
    return await API.put('/api/updateStatus', {id: id, status: status, stask: stask});
}

export const insertItem = async (item) => {
    return await API.post('/api/insert', {item: item});
}

export const deleteItem = async (id) => {
    return await API.delete(`/api/delete/${id}`);
}

export const signup = async (data, navigate) => {
    try{
        const signUp = await API.post('/userAuth/signup', data);
        localStorage.setItem('profile', JSON.stringify({...signUp?.data}));
        navigate('/home');
        return signUp;
    }catch(error){
        alert(error.response.data.message);
        
    }
    
}

export const signin = async (Data, navigate) => {
    try{
        const signIn = await API.post('/userAuth/signin', Data);
        localStorage.setItem('profile', JSON.stringify({...signIn?.data}));
        navigate('/home');
        return signIn;
    }catch(error){ 
        alert(error.response.data.message);

    }
    
}