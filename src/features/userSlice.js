import {createSlice} from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: "user",
    initialState:{
        username:'',
        fname:'',
        lname:'',
        role:'',
        userId:null,
    },
    reducers:{
        setUsername: (state, action)=>{
            state.username = action.payload;
        },
        setFname: (state, action)=>{
            state.fname = action.payload;
        },
        setLname: (state, action)=>{
            state.lname = action.payload;
        },
        setRole: (state, action)=>{
            state.role = action.payload;
        },
        setUserId:(state, action)=>{
            state.userId = action.payload;
        },
    }
})

export const {setUsername, setFname, setLname, setRole, setUserId} = userSlice.actions;
export default userSlice.reducer;