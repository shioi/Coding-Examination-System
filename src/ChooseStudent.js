import { useState, useEffect } from "react";
import { useAuthContext } from './useAuthContext';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


const ChooseStudent = (props) => {
    const { user } = useAuthContext()
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)



    const prev = props.prev
    const setSelection = props.setSelection
    const submit = props.submit
    const select = props.select

    const columns = [
        { field: 'registerno', headerName: 'ID', width: 100 },
        { field: 'firstname', headerName: 'First name', width: 130 },
        { field: 'lastname', headerName: 'Last name', width: 130 },];

    useEffect(() => {
        //fetching the current users
        const url = "http://localhost:4000/api/get/students"
        const abortCont = new AbortController();
        fetch(url, {
            signal: abortCont.signal,
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw Error("Could not load data");
                }
                return res.json();
            })
            .then(data => {
                setLoading(false);
                setData(data);
                setError(null);
                console.log(data)
            })
            .catch(err => {
                setData(null)
                if (err.name === 'AbortError') {
                    console.log("fetch abort");
                } else {
                    setLoading(false);
                    setError(err.message);
                }
            })
        return () => abortCont.abort();
    }, [user.token])



    return (
        <Box>
            <h1>Choose Students</h1>
            <button onClick={prev}>previous</button>
            {data &&
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        getRowId={(row) => row.registerno}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{
                            toolbar: {
                                showQuickFilter: true,
                                quickFilterProps: { debounceMs: 500 },
                            },
                        }}
                        onRowSelectionModelChange={(newRowSelectionModel) => {
                            setSelection(newRowSelectionModel);
                        }}
                        rowSelectionModel={select}
                    />
                </div>
            }
            <Button variant="outlined" onClick={submit}>Submit</Button>
        </Box>
    );
}

export default ChooseStudent;