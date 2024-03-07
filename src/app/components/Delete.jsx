import { Box } from '@mui/material';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import jwtService from '../../app/auth/services/jwtService/jwtService';
import { useState } from 'react'
import './Departments.css'
import { useTranslation } from 'react-i18next';


function DeleteItem({ itemId, itemType }) {

    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const [isLoading, setIsLoading] = useState(false)

    const dispatch = useAppDispatch();

    function showMsg(msg, status) {
        // then close the dialog, and show a quick message
        dispatch(closeDialog())
        setTimeout(()=> dispatch(
            showMessage({
                message: msg, //'Item deleted successfully!', // text or html
                autoHideDuration: 3000, // ms
                anchorOrigin: {
                    vertical  : 'top', // top bottom
                    horizontal: 'center' // left center right
                },
                variant: status // success error info warning null
            })), 100);
    }

    // this function will call the backend to 
    // delete the item depending on the itemType
    async function deleteItem() {
        setIsLoading(true)
        try {
            // @route: /api/delete/{itemType}
            // @description: delete an item
            const res = await jwtService.deleteItem({ 
                itemType: itemType,
                itemId: itemId
            });
            if (res.status === 200) {
                showMsg(res.message, 'success')
            }
        } catch (errors) {
            showMsg(errors.message, 'error')
        } finally {
            setIsLoading(false)
        }
    }



    return (
        <Box className="delete-box" sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '25px' }}>
            <p>
                {
                    lang === 'ar' ?
                    'هل أنت متأكد من أنك تريد حذف هذا العنصر؟'
                    :
                    'Are you sure you want to delete this item?'
                }
            </p>
            <div className="button-container">

                <button className={`yes-button ${isLoading ? 'disabled-button' : ''}`} 
                    onClick={deleteItem} disabled={isLoading}>
                    {isLoading ? (lang === 'ar' ? 'جاري الحذف...' : 'Deleting...') : (lang === 'ar' ? 'نعم' : 'Yes')}
                </button>
                <button className={`no-button ${isLoading ? 'disabled-button' : ''}`}  
                    onClick={() => dispatch(closeDialog())} disabled={isLoading}>
                    {lang === 'ar' ? 'لا' : 'No'}
                </button>
                
            </div>
        </Box>
    )
}

export default DeleteItem