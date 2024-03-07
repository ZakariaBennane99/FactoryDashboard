import '../../Departments.css'
import './Materials.css'
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import PaletteIcon from '@mui/icons-material/Palette';
import tinycolor from 'tinycolor2';
import AddMaterial from './AddMaterial';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ReportDates from './ReportDates';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { CircularProgress } from '@mui/material';
import NumbersIcon from '@mui/icons-material/Numbers';
import StraightenIcon from '@mui/icons-material/Straighten'; 
import Pagination from '@mui/material/Pagination';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';




function Materials() {

    const { t, i18n } = useTranslation('materialsPage');
    const lang = i18n.language;

    // pagination
    const [page, setPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(1);
    const itemsPerPage = 7;

    // search
    const [searchError, setSearchError] = useState(false);

    const [isLoading, setIsLoading] = useState(false)

    const [filteredMaterials, setFilteredMaterials] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [materials, setMaterials] = useState([]);
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
    
    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "material", 
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedMaterials = res.data.materials.map(mtrl => ({
                    id: mtrl.Id,
                    name: mtrl.Name,
                    type: mtrl.Type,
                    color: mtrl.Color,
                    description: mtrl.Description,
                    quantity: mtrl.Quantity,
                    unitOfMeasure: mtrl.UnitOfMeasure,
                    category: {
                        id: mtrl.Category.Id,
                        name: mtrl.Category.CategoryName
                    },
                    supplier: {
                        id: mtrl.Supplier.Id,
                        name: mtrl.Supplier.Name
                    }
                }));
                setMaterials(formattedMaterials); 
                setIsQueryFound(formattedMaterials.length > 0);
            }
        } catch (_error) {
            showMsg(_error.message, 'error')
        } finally {
            setIsLoading(false); 
        }
    }

    function handleSearchButtonClick() {
        if (query && query.length > 3) {
            fetchSearchResults(query);
        } else {
            setSearchError(true);
        }
    }

    function handleSearch(e) {
        const query = e.target.value;
        setQuery(query)
        // check if the query exist
        for (let i = 0; i < materials.length; i++) {
            if (Object.values(materials[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (materials.length > 0 && isQueryFound) {
            const filtered = materials.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredMaterials(filtered);
        }
    }, [materials, query, isQueryFound]);

    function showMsg(msg, status) {
    
        dispatch(closeDialog())
        setTimeout(()=> dispatch(
            showMessage({
                message: msg, // text or html
                autoHideDuration: 3000, // ms
                anchorOrigin: {
                    vertical  : 'top', // top bottom
                    horizontal: 'center' // left center right
                },
                variant: status // success error info warning null
        })), 100);
    } 

    useEffect(() => {
        async function getMaterials() {
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({
                    itemType: "material"
                });
                if (res.status === 200) {
                    setMaterials(res.data.materials.map(mtrl => {
                        return {
                            id: mtrl.Id,
                            name: mtrl.Name,
                            type: mtrl.Type,
                            color: mtrl.Color,
                            description: mtrl.Description,
                            quantity: mtrl.Quantity,
                            unitOfMeasure: mtrl.UnitOfMeasure,
                            category: {
                                id: mtrl.Category.Id,
                                name: mtrl.Category.CategoryName
                            },
                            supplier: {
                                id: mtrl.Supplier.Id,
                                name: mtrl.Supplier.Name
                            } 
                        }
                    }))
                    setTotalUsers(res.data.count)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getMaterials();
    }, []);


    function handleAddingMaterial() {
        dispatch(openDialog({
            children: ( 
                <AddMaterial mtrl={false} />
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
                    <AddMaterial mtrl={materials[i]} />
                )
            }));
        }, 100);
    }

    function handleReports(i) {
        // first close the current window
        dispatch(closeDialog())
        setTimeout(() => {
            // Now open a new edit dialog with the selected user data
            dispatch(openDialog({
                children: ( 
                    <ReportDates materialId={materials[i].id} />
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
                    <Delete itemId={materials[i].id} itemType="material" />
                )
            }));
        }, 100);
    }



    return (
        <div className="parent-container">

            <div className="top-ribbon">
                
                <button id="btn-generic" className="add-btn" onClick={handleAddingMaterial}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('ADD_MATERIAL')}</span>
                </button>

                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_MATERIAL')}
                    type="search"
                    error={searchError}
                    helperText={searchError ? t('QUERY_ERROR') : ""} />

                <button id="btn-generic" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading} onClick={handleSearchButtonClick}>
                    <SearchIcon />
                    <span className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('SEARCH')}</span>
                </button> 

            </div>  

            <div className="main-content">
                {isLoading ? (
                    <div className='progress-container'>
                        <CircularProgress />
                    </div>
                ) : materials.length > 0 ? 
                <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {materials.length > 0 && !isQueryFound ? materials.map((material, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card material"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog material">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <AccountTreeIcon id="material-reports" onClick={() => handleReports(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <TextSnippetIcon />
                                        <span className="material-name">
                                            {material.name}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon />
                                        <span className="material-type">
                                            {material.type}
                                        </span>
                                    </div>
                                    <div>
                                        <PaletteIcon />
                                        <span className="material-color" style={{ 
                                            backgroundColor: material.color.toLocaleLowerCase(), 
                                            color: tinycolor(material.color.toLocaleLowerCase()).isLight() ? 'black' : 'white' }}>
                                            {material.color}
                                        </span>
                                    </div>
                                    <div>
                                        <NumbersIcon />
                                        <span className="material-quantity">
                                            {material.quantity}
                                        </span>
                                    </div>
                                    <div>
                                        <StraightenIcon />
                                        <span className="material-uom">
                                            {material.unitOfMeasure}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon />
                                        <span className="material-category">
                                            {material.category.name}
                                        </span>
                                    </div>
                                    <div>
                                        <BusinessIcon /> 
                                        <span className="material-supplier">
                                            {material.supplier.name}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="material-description">
                                            {material.description}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <TextSnippetIcon />
                            <span className="material-name">
                                {material.name}
                            </span>
                        </div>
                        <div>   
                            <PaletteIcon />
                            <span className="material-color" style={{ 
                                backgroundColor: material.color.toLocaleLowerCase(), 
                                color: tinycolor(material.color.toLocaleLowerCase()).isLight() ? 'black' : 'white' }}>
                                {material.color}
                            </span>
                        </div>
                        <div> 
                            <NumbersIcon />
                            <span className="material-quantity">
                                {material.quantity}
                            </span>
                        </div>
                        <div>
                            <BusinessIcon /> 
                            <span className="material-supplier">
                                {material.supplier.name}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredMaterials && isQueryFound ? filteredMaterials.map((material, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card material"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog material">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <AccountTreeIcon id="material-reports" onClick={() => handleReports(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <TextSnippetIcon />
                                        <span className="material-name">
                                            {highlightMatch(material.name, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon />
                                        <span className="material-type">
                                            {highlightMatch(material.type, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <PaletteIcon />
                                        <span className="material-color" style={{ 
                                            backgroundColor: material.color.toLocaleLowerCase(), 
                                            color: tinycolor(material.color.toLocaleLowerCase()).isLight() ? 'black' : 'white' }}>
                                            {highlightMatch(material.color, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <NumbersIcon />
                                        <span className="material-quantity">
                                            {highlightMatch(material.quantity.toString(), query)}
                                        </span>
                                    </div>
                                    <div>
                                        <StraightenIcon />
                                        <span className="material-uom">
                                            {highlightMatch(material.unitOfMeasure, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon />
                                        <span className="material-category">
                                            {highlightMatch(material.category.name, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <BusinessIcon /> 
                                        <span className="material-supplier">
                                            {highlightMatch(material.supplier.name, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="material-description">
                                            {highlightMatch(material.description, query)}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <TextSnippetIcon />
                            <span className="material-name">
                                {highlightMatch(material.name, query)}
                            </span>
                        </div>
                        <div>   
                            <PaletteIcon />
                            <span className="material-color" style={{ 
                                backgroundColor: material.color.toLocaleLowerCase(), 
                                color: tinycolor(material.color.toLocaleLowerCase()).isLight() ? 'black' : 'white' }}>
                                {highlightMatch(material.color, query)}
                            </span>
                        </div>
                        <div> 
                            <NumbersIcon />
                            <span className="material-quantity">
                                {highlightMatch(material.quantity.toString(), query)}
                            </span>
                        </div>
                        <div>
                            <BusinessIcon /> 
                            <span className="material-supplier">
                                {highlightMatch(material.supplier.name, query)}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : ""
                  }
                </Grid>
                </Box>
                 : (
                    <div className='progress-container'>
                        {t('NO_MATERIAL_AVAILABLE')}
                    </div>
                )}


                {
                    materials.length > 0 ?
                    <Pagination
                        count={Math.ceil(totalUsers / itemsPerPage)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                    /> : ''
                }

            </div>

        </div>
    )
}

export default Materials;