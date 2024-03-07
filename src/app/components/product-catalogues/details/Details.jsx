import './Details.css';
import '../../Departments.css'
import TextField from '@mui/material/TextField';
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import AddDetail from './AddDetail';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Delete from '../../Delete';
import CategoryIcon from '@mui/icons-material/Category';
import LayersIcon from '@mui/icons-material/Layers';
import TextureIcon from '@mui/icons-material/Texture';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DescriptionIcon from '@mui/icons-material/Description';
import AcUnitIcon from '@mui/icons-material/AcUnit'; // Winter
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // summer
import FilterDramaIcon from '@mui/icons-material/FilterDrama'; // autumn
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'; // Spring
import DnsIcon from '@mui/icons-material/Dns';
import jwtService from '../../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import Pagination from '@mui/material/Pagination';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SearchIcon from '@mui/icons-material/Search';





function Details() {

    const { t, i18n } = useTranslation('detailsPage');
    const lang = i18n.language;

    // search
    const [searchError, setSearchError] = useState(false);

    // pagination
    const [page, setPage] = useState(1);
    const [totalCtlgs, setTotalCtlgs] = useState(1);
    const itemsPerPage = 7;

    const [isLoading, setIsLoading] = useState(true);

    const [filteredDetails, setFilteredDetails] = useState(null);

    const dispatch = useAppDispatch();
    const [elevatedIndex, setElevatedIndex] = useState(null);
    const [details, setDetails] = useState([]);
    const [query, setQuery] = useState(null)
    const [isQueryFound, setIsQueryFound] = useState(false);
   
    function highlightMatch(text, query) {
        if (!isQueryFound || !query) {
            return <span id="not-applied">{text}</span>;
        }
    
        // Escape special characters in the query for use in a RegExp
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
        // Create a RegExp object with global and case-insensitive flags
        const regex = new RegExp(escapedQuery, 'gi');
    
        // Replace matches in the text with a highlighted span
        const highlightedText = text.replace(regex, (match) => `<span id="not-applied" class="highlight">${match}</span>`);
    
        // Return the highlighted text as JSX
        // Use dangerouslySetInnerHTML to render the HTML string as real HTML
        return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
    }

    function handleSearch(e) {
        const query = e.target.value;
        setQuery(query)
        // check if the query exist
        for (let i = 0; i < details.length; i++) {
            if (Object.values(details[i]).some(value =>
                typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
            )) {
                setIsQueryFound(true);
                return; // Exit the function as we found the query
            }
        }
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

    useEffect(() => {
        if (details.length > 0 && isQueryFound) {
            const filtered = details.filter((detail) => {
                // Check if any field in the Detail matches the query
                return Object.values(detail).some(value =>
                    typeof value === 'string' && value.toLocaleLowerCase().includes(query.toLocaleLowerCase())
                );
            });
    
            setFilteredDetails(filtered);
        }
    }, [details, query, isQueryFound]);


    useEffect(() => {
        async function getDetails() {
            setIsLoading(true)
            try {
                const res = await jwtService.getItems({ 
                    itemType: "productcatalogtdetail",
                    page: page,
                    itemsPerPage: itemsPerPage
                });
                if (res.status === 200) {
                    console.log('The res', res)
                    const formatted = res.data.details.map(ctgr => ({ 
                        id: ctgr.Id,
                        category1: ctgr.CategoryOne,
                        category2: ctgr.CategoryTwo,
                        season: ctgr.Season,
                        textile: ctgr.Textile,
                        templateCatalog: ctgr.ProductCatalog,
                        templateType: ctgr.TemplateType,
                        standardWeight: ctgr.StandardWeight,
                        grammage: ctgr.Grammage,
                        description: ctgr.Description
                    }));
                    setTotalCtlgs(res.data.count)
                    setDetails(formatted)
                }
            } catch (_error) {
                showMsg(_error.message, 'error')
            } finally {
                setIsLoading(false)
            }
        }
        
        getDetails();
    }, []);


    // handling adding a Detail
    function handleAddingDepart() {
        dispatch(openDialog({
            children: ( 
                <AddDetail dtl={false} />
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
                    <AddDetail dtl={details[i]} />
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
                    <Delete itemId={details[i].id} itemType="productcatalogtdetail" />
                )
            }));
        }, 100);
    }


    function getSeasonIcon(season) {
        switch (season.toLowerCase()) {
            case 'winter':
                return <AcUnitIcon />;
            case 'summer':
                return <WbSunnyIcon />;
            case 'autumn':
                return <FilterDramaIcon />;
            case 'fall':
                return <FilterDramaIcon />;
            case 'spring':
                return <LocalFloristIcon />;
            default:
                return null;
        }
    }


    async function fetchSearchResults(query) {
        try {
            setIsLoading(true);
            const res = await jwtService.searchItems({
                itemType: "productcatalogtdetail", 
                query: query
            });
            if (res.status === 200) {
                console.log('The response', res);
              
                
                const formattedDetails = res.data.map(detail => ({
                    id: detail.Id,
                    category1: detail.CategoryOne,
                    category2: detail.CategoryTwo,
                    season: detail.Season,
                    textile: detail.Textile,
                    templateCatalog: detail.ProductCatalog,
                    templateType: detail.TemplateType,
                    standardWeight: detail.StandardWeight,
                    grammage: detail.Grammage,
                    description: detail.Description
                }));
                setDetails(formattedDetails); 
                setIsQueryFound(formattedDetails.length > 0);
            }
        } catch (_error) {
            showMsg(_error.message, 'error');
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
                
                <button id="btn-generic" className="add-btn" onClick={handleAddingDepart}>
                    <img src="/assets/gen/plus.svg" /> 
                    <span id="long" className={lang === 'ar' ? 'ar-txt-btn' : '' }>{t('ADD_DETAIL')}</span>
                </button>
                <TextField 
                    onChange={(e) => handleSearch(e)} 
                    label={t('SEARCH_DETAILS')} type="search"
                    className={`search ${lang === 'ar' ? 'rtl' : ''}`}
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
                     : details.length > 0 ? 
                    (
                <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                  {details.length > 0 && !isQueryFound ? details.map((detail, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="detail-card"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="detail-card dialog">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div className="body-container">
                                        <div>
                                            <DnsIcon />
                                            <span>
                                                {detail.templateCatalog.ProductCatalogName}
                                            </span>
                                        </div>
                                        <div className="cat1">
                                            <CategoryIcon />
                                            <span>
                                                {detail.category1.CategoryName}
                                            </span>
                                        </div>
                                        <div className="template-type">
                                            <CategoryIcon />
                                            <span>
                                                {detail.templateType.TemplateTypeName}
                                            </span>
                                        </div>
                                        <div className="cat2">
                                            <LayersIcon />
                                            <span>
                                                {detail.category2.CategoryName}
                                            </span>
                                        </div>
                                        <div className="description">
                                            <DescriptionIcon />
                                            <span>{detail.description}</span>
                                        </div>
                                            <div className="detail">
                                                {getSeasonIcon(detail.season.SeasonName)}
                                                <span>{detail.season.SeasonName}</span>
                                            </div>
                                            <div className="textile">
                                                <TextureIcon />
                                                <span>{detail.textile.TextileName}</span>
                                            </div>
                                            <div className="weight">
                                                <FitnessCenterIcon />
                                                <span>{detail.standardWeight}g</span>
                                            </div>
                                            <div className="grammage">
                                                <span className="txt-identifier">Grammage:</span>
                                                <span>{detail.grammage} g/m²</span>
                                            </div>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div className="body-container">
                            <div className="template-type">
                                <CategoryIcon />
                                <span>
                                    {detail.templateType.TemplateTypeName}
                                </span>
                            </div>
                                <div className="detail">
                                    {getSeasonIcon(detail.season.SeasonName)}
                                    <span>{detail.season.SeasonName}</span>
                                </div>
                                <div className="textile">
                                    <TextureIcon />
                                    <span>{detail.textile.TextileName}</span>
                                </div>
                                <div className="pattern">
                                    <DnsIcon />
                                    <span>{detail.templateCatalog.ProductCatalogName}</span>
                                </div>
                        </div>
                      </Paper>
                    </Grid>
                  )) : filteredDetails && isQueryFound ? filteredDetails.map((detail, index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                    <Paper
                      className="detail-card"
                      elevation={elevatedIndex === index ? 6 : 2}
                      onMouseOver={() => setElevatedIndex(index)}
                      onMouseOut={() => setElevatedIndex(null)}
                      onClick={() => {
                        setElevatedIndex(index)
                        dispatch(openDialog({
                            children: (
                                <div className="detail-card dialog">
                                    <div id="edit-container">
                                        <EditIcon id="edit-icon" onClick={() => handleEdit(index)} />
                                        <DeleteIcon id="delete-icon" onClick={() => handleDelete(index)} />
                                    </div>
                                    <div className="body-container">
                                        <div>
                                            <DnsIcon />
                                            <span>
                                                {detail.templateCatalog.ProductCatalogName}
                                            </span>
                                        </div>
                                        <div className="cat1">
                                            <CategoryIcon />
                                            <span>
                                                {detail.category1.CategoryName}
                                            </span>
                                        </div>
                                        <div className="template-type">
                                            <CategoryIcon />
                                            <span>
                                                {detail.templateType.TemplateTypeName}
                                            </span>
                                        </div>
                                        <div className="cat2">
                                            <LayersIcon />
                                            <span>
                                                {detail.category2.CategoryName}
                                            </span>
                                        </div>
                                        <div className="description">
                                            <DescriptionIcon />
                                            <span>{detail.description}</span>
                                        </div>
                                            <div className="detail">
                                                {getSeasonIcon(detail.season.SeasonName)}
                                                <span>{detail.season.SeasonName}</span>
                                            </div>
                                            <div className="textile">
                                                <TextureIcon />
                                                <span>{detail.textile.TextileName}</span>
                                            </div>
                                            <div className="weight">
                                                <FitnessCenterIcon />
                                                <span>{detail.standardWeight}g</span>
                                            </div>
                                            <div className="grammage">
                                                <span className="txt-identifier">Grammage:</span>
                                                <span>{detail.grammage} g/m²</span>
                                            </div>
                                    </div>
                                </div>
                            )
                        }))
                      }}
                    >
                        <div className="body-container">
                            <div className="template-type">
                                <CategoryIcon />
                                <span>
                                    {detail.templateType.TemplateTypeName}
                                </span>
                            </div>
                                <div className="detail">
                                    {getSeasonIcon(detail.season.SeasonName)}
                                    <span>{detail.season.SeasonName}</span>
                                </div>
                                <div className="textile">
                                    <TextureIcon />
                                    <span>{detail.textile.TextileName}</span>
                                </div>
                                <div className="pattern">
                                    <DnsIcon />
                                    <span>{detail.templateCatalog.ProductCatalogName}</span>
                                </div>
                        </div>
                      </Paper>
                    </Grid>
                  )) : ""
                  }
                </Grid>
                </Box>
                     ) : (
                        <div className='progress-container'>
                           {t('NO_DETAIL_AVAILABLE')}
                        </div>
                    )
                }
                {
                    details.length > 0 ?
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

export default Details;
