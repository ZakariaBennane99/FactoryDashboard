import '../../Departments.css'
import './Suppliers.css'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AddSupplier from './AddSupplier';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import { DataGrid } from '@mui/x-data-grid';
import * as React from 'react';





function Suppliers() {

    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'address', headerName: 'Address', width: 300 },
        { field: 'phone', headerName: 'Phone Number', width: 150 },
        { field: 'email', headerName: 'Email', width: 250 },
    ];
      
      
    const rows = [
        { id: 1, name: "Aleppo Textiles Ltd.", phone: "+963 1234 567", email: "contact@aleppotextiles.sy", address: "123 Industrial Zone, Aleppo, Syria" },
        { id: 2, name: "Damascus Fabrics Co.", phone: "+963 9876 543", email: "info@damascusfabrics.sy", address: "456 Business District, Damascus, Syria" },
        { id: 3, name: "Latakia Weaving Works", phone: "+963 3456 789", email: "sales@latakia-weaving.sy", address: "789 Seaside Avenue, Latakia, Syria" },
        { id: 4, name: "Homs Cotton Suppliers", phone: "+963 2345 678", email: "support@homscotton.sy", address: "321 Cotton Drive, Homs, Syria" },
        { id: 5, name: "Tartous Textile Solutions", phone: "+963 5432 109", email: "inquiries@tartoustextile.sy", address: "654 Harbor Road, Tartous, Syria" },
        { id: 6, name: "Raqqa Garment Makers", phone: "+963 6789 012", email: "contact@raqqagarments.sy", address: "987 Fabric Lane, Raqqa, Syria" },
        { id: 7, name: "Deir Ezzor Cloth Co.", phone: "+963 7890 345", email: "info@deirezzorcloth.sy", address: "210 Textile Avenue, Deir Ezzor, Syria" },
    ];

    const [filteredSuppliers, setFilteredSuppliers] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    function highlightMatch(text, query) {
        if (!isQueryFound || !query) {
            return <span>{text}</span>;
        }
    
        // Escape special characters in the query for use in a RegExp
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        // Create a RegExp object with global and case-insensitive flags
        const regex = new RegExp(escapedQuery, 'gi');
    
        // Replace matches in the text with a highlighted span
        const highlightedText = text.replace(regex, (match) => `<span class="highlight">${match}</span>`);
    
        // Return the highlighted text as JSX
        // Use dangerouslySetInnerHTML to render the HTML string as real HTML
        return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
    } 
    

    function handleSearch(e) {
        const query = e.target.value;
        setQuery(query)
        // check if the query exist
        for (let i = 0; i < suppliers.length; i++) {
            if (Object.values(suppliers[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (suppliers.length > 0 && isQueryFound) {
            const filtered = suppliers.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredSuppliers(filtered);
        }
    }, [suppliers, query, isQueryFound]);


    useEffect(() => {
        // get the Userments from the backend
        async function getSuppliers() {
            try {
                const response = await axios.get('http://localhost:3050/suppliers');
                console.log('The response', response)
                const suppliersArr = response.data.suppliers;
                setSuppliers(suppliersArr);
            } catch (error) {
                console.error('There was an error!', error);
            }
        }
        
        getSuppliers();
    }, []);


    function handleAddingSupplier() {
        dispatch(openDialog({
            children: ( 
                <AddSupplier splie={false}/>
            )
        }))
    }

    function handleEdit(i) {
        // first close the current window
        dispatch(closeDialog())
        setTimeout(() => {
            // Now open a new edit dialog with the selected user data
            dispatch(openDialog({
                children: ( 
                    <AddSupplier splier={suppliers[i]} />
                )
            }));
        }, 100);
    }

    function handleDelete(i) {
        // first close the current window
        dispatch(closeDialog())
        setTimeout(() => {
            // Now open a new edit dialog with the selected user data
            dispatch(openDialog({
                // you need to pass the user id to the 
                // component, so you can easily delete it
                children: ( 
                    <Delete itemId={i} />
                )
            }));
        }, 100);
    }


    return (
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
        />
      </div>
    )

    /*
    return (
        <div className="parent-container">

            <div className="top-ribbon">
                <button className="add-btn" onClick={handleAddingSupplier}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>Add Supplier</span>
                </button>
                <TextField onChange={(e) => handleSearch(e)} id="outlined-search" className="search" label="Search Suppliers" type="search" />

            </div>  

            <div className="main-content">
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {suppliers.length > 0 && !isQueryFound ? suppliers.map((supplier, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card supplier"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog supplier">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <BusinessIcon /> 
                                        <span className="supplier-name">
                                            {supplier.name}
                                        </span>
                                    </div>
                                    <div>
                                        <LocationOnIcon />
                                        <span className="supplier-location">
                                            {supplier.address}
                                        </span>
                                    </div>
                                    <div>
                                        <PhoneIcon />
                                        <span className="supplier-phone">
                                            {supplier.phone}
                                        </span>
                                    </div>
                                    <div>
                                        <EmailIcon /> 
                                        <span className="supplier-email">
                                            {supplier.email}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                            <div>
                                <BusinessIcon /> 
                                <span className="supplier-name">
                                    {supplier.name}
                                </span>
                            </div>
                            <div>
                                <LocationOnIcon />
                                <span className="supplier-location">
                                    {supplier.address}
                                </span>
                            </div>
                            <div>
                                <PhoneIcon />
                                <span className="supplier-phone">
                                    {supplier.phone}
                                </span>
                            </div>
                            <div>
                                <EmailIcon /> 
                                <span className="supplier-email">
                                    {supplier.email}
                                </span>
                            </div>
                      </Paper>
                    </Grid>
                  )) : filteredSuppliers && isQueryFound ? filteredSuppliers.map((supplier, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card supplier"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog supplier">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <BusinessIcon /> 
                                        <span className="supplier-name">
                                            {highlightMatch(supplier.name, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <LocationOnIcon />
                                        <span className="supplier-location">
                                            {highlightMatch(supplier.address, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <PhoneIcon />
                                        <span className="supplier-phone">
                                            {highlightMatch(supplier.phone, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <EmailIcon /> 
                                        <span className="supplier-email">
                                            {highlightMatch(supplier.email, query)}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <BusinessIcon /> 
                            <span className="supplier-name">
                                {highlightMatch(supplier.name, query)}
                            </span>
                        </div>
                        <div>
                            <LocationOnIcon />
                            <span className="supplier-location">
                                {highlightMatch(supplier.address, query)}
                            </span>
                        </div>
                        <div>
                            <PhoneIcon />
                            <span className="supplier-phone">
                                {highlightMatch(supplier.phone, query)}
                            </span>
                        </div>
                        <div>
                            <EmailIcon /> 
                            <span className="supplier-email">
                                {highlightMatch(supplier.email, query)}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : <div>Loading...</div>
                  }
                </Grid>
            </Box>
            </div>

        </div>
    )*/
}

export default Suppliers;