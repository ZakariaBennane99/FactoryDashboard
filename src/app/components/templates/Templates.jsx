import '../../components/Departments.css'
import './Templates.css'
import { TextField, Box, Grid, Paper } from '@mui/material'
import { useState, useEffect } from 'react';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import NoteAddIcon from '@mui/icons-material/Add'
import Delete from '../../components/Delete';
import AddTemplate from './AddTemplate';
import CategoryIcon from '@mui/icons-material/Category';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import jwtService from '../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';



function trimText(txt, maxLength) {
    if (txt.length > maxLength) {
        return txt.substring(0, maxLength) + '...'
    } else {
        return txt
    }
}


function Templates() {

    const { t, i18n } = useTranslation('templatesPage');
    const lang = i18n.language;

    // search
    const [searchError, setSearchError] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

    const [filteredTemplates, setFilteredTemplates] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex ] = useState(null);
    const [templates, setTemplates] = useState([]);
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
        for (let i = 0; i < templates.length; i++) {
            if (Object.values(templates[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
    }

    useEffect(() => {
        if (templates.length > 0 && isQueryFound) {
            const filtered = templates.filter((user) => {
                // Check if any field in the Userment matches the query
                return Object.values(user).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredTemplates(filtered);
        }
    }, [templates, query, isQueryFound]);


    useEffect(() => {
        async function getTemplates() {
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({ 
                    itemType: "template",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res) {
                    const formatted = res.data.templates.map(ctgr => ({ 
                        id: ctgr.Id,
                        productCatalogueDetail: ctgr.ProductCatalogDetail,
                        templateName: ctgr.TemplateName,
                        description: ctgr.Description,
                        file: ctgr.FilePath
                    }));
                    setTotalCtlgs(res.data.count)
                    setTemplates(formatted)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getTemplates();
    }, []);


    function handleAddingInternalOrder() {
        dispatch(openDialog({
            children: ( 
                <AddTemplate tmplt={false} />
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
                    <AddTemplate tmplt={templates[i]} />
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
                    <Delete itemId={templates[i].id} itemType="template" />
                )
            }));
        }, 100);
    }

    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "template", 
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res)
                
                const formattedTemplates = res.data.map(tmpl => ({
                    id: tmpl.Id,
                    templateName: tmpl.TemplateName,
                    productCatalogueDetail: tmpl.ProductCatalogDetail,
                    description: tmpl.Description,
                    file: tmpl.FilePath,
                }));
                setTemplates(formattedTemplates); 
                setIsQueryFound(formattedTemplates.length > 0);
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
                    <span>{t('ADD_TEMPLATE')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
                    label={t('SEARCH_TEMPLATES')}
                    type="search"
                    error={searchError}
                    helperText={searchError ? t('QUERY_ERROR') : ""} />
                <button id="btn-generic" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading} onClick={handleSearchButtonClick}>
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
                     : templates.length > 0 ? 
                    (
                <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {templates.length > 0 && !isQueryFound ? templates.map((template, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card template"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}  
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="depart-card dialog template">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <NoteAddIcon /> 
                                        <span className="template-name">
                                            {template.templateName}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="product-catalogue">
                                            {template.productCatalogueDetail.ProductCatalog.ProductCatalogName}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="template-description">
                                            {template.description}
                                        </span>
                                    </div>
                                    <div>
                                        <InsertDriveFileIcon />
                                        <span className="template-specifics" 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => window.open(`http://localhost:3002${template.file}`, '_blank')}>
                                            {template.file}
                                        </span>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <NoteAddIcon /> 
                            <span className="template-name">
                                {template.templateName}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon /> 
                            <span className="product-catalogue">
                                {template.productCatalogueDetail.ProductCatalog.ProductCatalogName}
                            </span>
                        </div>
                        <div>
                            <DescriptionIcon />
                            <span className="template-description">
                                {trimText(template.description, 30)}
                            </span>
                        </div>
                        <div>
                            <InsertDriveFileIcon />
                            <span className="template-specifics">
                                {template.file}
                            </span>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredTemplates && isQueryFound ? filteredTemplates.map((template, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="depart-card template"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                            <div className="depart-card dialog template">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div>
                                        <NoteAddIcon /> 
                                        <span className="template-name">
                                            {highlightMatch(template.templateName, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <CategoryIcon /> 
                                        <span className="product-catalogue">
                                            {highlightMatch(template.productCatalogueDetail.ProductCatalog.ProductCatalogName, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <DescriptionIcon />
                                        <span className="template-description">
                                            {highlightMatch(template.description, query)}
                                        </span>
                                    </div>
                                    <div>
                                        <InsertDriveFileIcon />
                                        <span className="template-specifics" onClick={() => window.open(`http://localhost:3002/${template.file}`, '_blank')}>
                                            {highlightMatch(template.file, query)}
                                        </span>
                                    </div>
                            </div>
                            )
                        }))
                      }}
                    >
                        <div>
                            <NoteAddIcon /> 
                            <span className="template-name">
                                {highlightMatch(template.templateName, query)}
                            </span>
                        </div>
                        <div>
                            <CategoryIcon /> 
                            <span className="product-catalogue">
                                {highlightMatch(template.productCatalogueDetail.ProductCatalog.ProductCatalogName, query)}
                            </span>
                        </div>
                        <div>
                            <DescriptionIcon />
                            <span className="template-description">
                                {highlightMatch(trimText(template.description, 30), query)}
                            </span>
                        </div>
                        <div>
                            <InsertDriveFileIcon />
                            <span className="template-specifics">
                                {highlightMatch(template.file, query)}
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
                            {t('NO_TEMPLATE_AVAILABLE')}
                        </div>
                    )
                }
                {
                    templates.length > 0 ?
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

export default Templates;