import '../../../components/Departments.css'
import './Sizes.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../../components/Delete';
import AddSize from './AddSize';
import HeightIcon from '@mui/icons-material/Height';
import CategoryIcon from '@mui/icons-material/Category';
import RulerIcon from '@mui/icons-material/Straighten'; 
import ExtensionIcon from '@mui/icons-material/Extension';
import ScissorsIcon from '@mui/icons-material/ContentCut'; 
import ScaleIcon from '@mui/icons-material/Scale'
import CheckroomIcon from '@mui/icons-material/Checkroom';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import NumbersIcon from '@mui/icons-material/Numbers'; 
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'
import { useTranslation } from 'react-i18next';





function Sizes() {

    const { t, i18n } = useTranslation('sizesPage');
    const lang = i18n.language;

    // search
    const [searchError, setSearchError] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

    const [filteredSizes, setFilteredSizes] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    function highlightMatch(text, query) {
        if (!isQueryFound || !query) {
            return <span>{text}</span>;
        }

        // Convert both text and query to string to ensure numbers are handled correctly
        const textString = String(text);
        const queryString = String(query);
    
        // Escape special characters in the query for use in a RegExp
        const escapedQuery = queryString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        // Create a RegExp object with global and case-insensitive flags
        const regex = new RegExp(escapedQuery, 'gi');
        // Replace matches in the text with a highlighted span
        const highlightedText = textString.replace(regex, (match) => `<span class="highlight">${match}</span>`);
        // Return the highlighted text as JSX
        // Use dangerouslySetInnerHTML to render the HTML string as real HTML
        return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
    }

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

    function handleSearch(e) {
        const query = e.target.value;
        setQuery(query)
        // check if the query exist
        for (let i = 0; i < sizes.length; i++) {
            if (Object.values(sizes[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (sizes.length > 0 && isQueryFound) {
            const filtered = sizes.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredSizes(filtered);
        }
    }, [sizes, query, isQueryFound]);


    useEffect(() => {
        async function getSizes() {

            setIsLoading(true)
            try {
                const res = await jwtService.getItems({
                    itemType: "templatesize",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                console.log(res)
                if (res.status === 200) {
                    const formatted = res.data.sizes.map(ctgr => ({ 
                        id: ctgr.Id,
                        size: ctgr.Size, 
                        template: ctgr.Template, 
                        templateSizeType: ctgr.TemplateSizeType,
                        description: ctgr.Description,
                        components: ctgr.Components, 
                        measurements: ctgr.Measurements
                    }));
                    console.log(formatted)
                    setTotalCtlgs(res.data.count)
                    setSizes(formatted)
                }
            } catch (_error) {
                showMsg(_error, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getSizes();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddSize sze={false} />
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
                    <AddSize sze={sizes[i]} />
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
                    <Delete itemId={sizes[i].id} itemType="templatesize" />
                )
            }));
        }, 100);
    }

    function getIconByType(type) {
        console.log(type)
        switch (type) {
            case 'CUTTING':
                return <ScissorsIcon />;
            case 'DRESSUP':
                return <CheckroomIcon />;
            default:
                return null;
        }
    }

    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "templatesize", // Changed from "templatetype" to "templatesize"
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedSizes = res.data.map(size => ({
                    id: size.Id,
                    size: size.Size, 
                    template: size.Template, 
                    templateSizeType: size.TemplateSizeType,
                    description: size.Description,
                    components: size.Components, 
                    measurements: size.Measurements
                }));
                setSizes(formattedSizes); // Changed from setTypes to setSizes
                setIsQueryFound(formattedSizes.length > 0);
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

    
    return (
        <div className="parent-container">

            <div className="top-ribbon">


                <button id="btn-generic" className="add-btn" onClick={handleAddingInternalOrder}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span>{t('ADD_SIZE')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_SIZES')}
                    type="search"
                    error={searchError}
                    helperText={searchError ? t('QUERY_ERROR') : ""} />
                <button id="btn-generic" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} 
                disabled={isLoading} onClick={handleSearchButtonClick}>
                    <SearchIcon />
                    <span className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('SEARCH')}</span>
                </button>  

            </div>  

            <div className="main-content">
            {
                    isLoading ?
                    (
                        <div className='progress-container'>
                            <CircularProgress />
                        </div>
                    ) 
                     : sizes.length > 0 ? 
                    (
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                          {sizes.length > 0 && !isQueryFound ? sizes.map((size, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card size"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}  
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                        <div className="depart-card dialog size">
                                            <div id="edit-container">
                                                <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                                <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                            </div>
                                            <div>
                                                <HeightIcon /> 
                                                <span className="size">
                                                    {size.size.SizeName}
                                                </span>
                                            </div>
                                            <div>
                                                <CategoryIcon /> 
                                                <span className="template">
                                                    {size.template.TemplateName}
                                                </span>
                                            </div>
                                            <div>
                                                <DescriptionIcon /> 
                                                <span className="description">
                                                    {size.description}
                                                </span>
                                            </div>
                                            <div>
                                                {getIconByType(size.templateSizeType)}
                                                <span className="measurement-size-type">
                                                    {size.templateSizeType}
                                                </span>
                                            </div>
                                            {
                                                size.measurements.length > 0 ? 
                                                size.measurements.map((msr, i) => {
                                                    return (
                                                        <div className="special">
                                                            <h2>{t('MEASUREMENT')} {i + 1}</h2>
                                                            <div>
                                                                <RulerIcon />
                                                                <span className="measurement-name">
                                                                    {msr.MeasurementName}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <NumbersIcon />
                                                                <span className="measurement-value">
                                                                    {msr.MeasurementValue}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <ScaleIcon />
                                                                <span className="measurement-unit">
                                                                    {msr.MeasurementUnit}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                : ''
                                            }
        
                                            {
                                                size.components.length > 0 ? 
                                                size.components.map((cm, index) => {
                                                    return (
                                                        <div className="special" key={index}>
                                                            <h2>{t('COMPONENT')} {index + 1}</h2>
                                                            <div>
                                                                <ExtensionIcon /> 
                                                                <span>{cm.ComponentName}</span>
                                                            </div>
                                                            <div>
                                                                <DescriptionIcon /> 
                                                                <span>{cm.Description}</span>
                                                            </div>
                                                            <div>
                                                                <LayersIcon /> 
                                                                <span>{cm.Material.Name}</span> 
                                                            </div>
                                                            <div>
                                                                <CategoryIcon /> 
                                                                <span>{cm.Template.Name}</span> 
                                                            </div>
                                                            <div>
                                                                <NumbersIcon /> 
                                                                <span>{cm.Quantity}</span>
                                                            </div>
                                                            <div>
                                                                <RulerIcon /> 
                                                                <span>{cm.UnitOfMeasure}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                                : ''
                                            }
                                        </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <HeightIcon /> 
                                    <span className="size">
                                        {size.size.SizeName}
                                    </span>
                                </div>
                                <div>
                                    <CategoryIcon /> 
                                    <span className="template">
                                        {size.template.TemplateName}
                                    </span>
                                </div>
                                <div>
                                {getIconByType(size.templateSizeType)}
                                    <span className="measurement-size-type">
                                        {size.templateSizeType}
                                    </span>
                                </div>
                              </Paper>
                            </Grid>
                          )) : filteredSizes && isQueryFound ? filteredSizes.map((size, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                            <Paper
                              className="depart-card size"
                              elevation={elevatedIndex === index ? 6 : 2}
                              onMouseOver={() => setElevatedIndex(index)}
                              onMouseOut={() => setElevatedIndex(null)}
                              onClick={() => {
                                setElevatedIndex(index)
                                dispatch(openDialog({
                                    children: (
                                        <div className="depart-card dialog size">
                                            <div id="edit-container">
                                                <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                                <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                            </div>
                                            <div>
                                                <HeightIcon /> 
                                                <span className="size">
                                                    {size.size.SizeName}
                                                </span>
                                            </div>
                                            <div>
                                                <CategoryIcon /> 
                                                <span className="template">
                                                    {size.template.TemplateName}
                                                </span>
                                            </div>
                                            <div>
                                                <DescriptionIcon /> 
                                                <span className="description">
                                                    {size.description}
                                                </span>
                                            </div>
                                            <div>
                                                {getIconByType(size.templateSizeType)}
                                                <span className="measurement-size-type">
                                                    {size.templateSizeType}
                                                </span>
                                            </div>
                                            {
                                                size.measurements.length > 0 ? 
                                                size.measurements.map((msr, i) => {
                                                    return (
                                                        <div>
                                                            <h3>{t('MEASUREMENT')} {i + 1}</h3>
                                                            <div>
                                                                <RulerIcon />
                                                                <span className="measurement-name">
                                                                    {msr.MeasurementName}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <NumbersIcon />
                                                                <span className="measurement-value">
                                                                    {msr.MeasurementValue}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <ScaleIcon />
                                                                <span className="measurement-unit">
                                                                    {msr.MeasurementUnit}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                : ''
                                            }
        
                                            {
                                                size.components.length > 0 ? 
                                                size.components.map((cm, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <h3>{t('COMPONENT')} {index + 1}</h3>
                                                            <div>
                                                                <ExtensionIcon /> 
                                                                <span>{cm.ComponentName}</span>
                                                            </div>
                                                            <div>
                                                                <DescriptionIcon /> 
                                                                <span>{cm.Description}</span>
                                                            </div>
                                                            <div>
                                                                <LayersIcon /> 
                                                                <span>{cm.Material.Name}</span> 
                                                            </div>
                                                            <div>
                                                                <CategoryIcon /> 
                                                                <span>{cm.Template.Name}</span> 
                                                            </div>
                                                            <div>
                                                                <NumbersIcon /> 
                                                                <span>{cm.Quantity}</span>
                                                            </div>
                                                            <div>
                                                                <RulerIcon /> 
                                                                <span>{cm.UnitOfMeasure}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                                : ''
                                            }
                                        </div>
                                    )
                                }))
                              }}
                            >
                                <div>
                                    <HeightIcon /> 
                                    <span className="size">
                                        {highlightMatch(size.size.SizeName, query)}
                                    </span>
                                </div>
                                <div>
                                    <CategoryIcon /> 
                                    <span className="template">
                                        {highlightMatch(size.template.TemplateName, query)}
                                    </span>
                                </div>
                                <div>
                                    {getIconByType(size.templateSizeType)}
                                    <span className="measurement-size-type">
                                        {highlightMatch(size.templateSizeType, query)}
                                    </span>
                                </div>
                              </Paper>
                            </Grid>
                          )) : ""
                          }
                        </Grid>
                    </Box>
                     ) : (
                        <div className='progress-container'>
                            {t('NO_TEMPLATE_SIZES')}
                        </div>
                    )
                }
                {
                    sizes.length > 0 ?
                    <Pagination
                        count={Math.ceil(totalCtlgs / itemsPerPage)}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                    /> : ''
                }

            </div>

        </div>
    )
}

export default Sizes;