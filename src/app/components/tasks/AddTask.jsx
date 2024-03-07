import { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import jwtService from '../../../app/auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from 'app/store';
import '../Departments.css';


function AddTask({ tsk }) {

  const { t, i18n } = useTranslation('tasksPage');
  const lang = i18n.language;

  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false)

    const [task, setTask] = useState({
      id: tsk ? tsk.id : '',
      taskName: tsk ? tsk.taskName : '',
      dueDate: tsk ? new Date(tsk.dueDate) : null,
      status: tsk ? tsk.status : (lang === 'ar' ? 'معلق' : 'PENDING' ),
      priority: tsk ? tsk.priority : '',
      assignedToDepartment: tsk ? tsk.assignedToDepartment : '',
      notes: tsk ? tsk.notes : ''
    });

    const [departments, setDepartments] = useState([])

    const handleChange = (prop) => (event) => {
      setTask({ ...task, [prop]: event.target.value });
    };

    const statuses = [
      'PENDING', 'APPROVED', 'REJECTED', 'FULFILLED',
      'CANCELLED', 'COMPLETED', 'ONGOING'
    ];

    const statusesAr = [
      'معلق', // PENDING
      'موافق عليه', // APPROVED
      'مرفوض', // REJECTED
      'مُنجز', // FULFILLED
      'ملغى', // CANCELLED
      'مكتمل', // COMPLETED
      'جاري' // ONGOING
    ];

    const prioritiesAr = [
      'منخفض', // LOW
      'متوسط', // MEDIUM
      'عالي' // HIGH
    ];

    const priorities = [
        "LOW",
        "MEDIUM",
        "HIGH"
    ]

    const handleDateChange = (date) => {
        setTask({ ...task, dueDate: date });
    };

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

    const handleAddTasks = async (event) => {

      event.preventDefault();
      
      setIsLoading(true)
      
      if (lang === 'ar') {
        setTask({ ...task, 
          priority: priorities[prioritiesAr.indexOf(task.priority)],
          status: statuses[statusesAr.indexOf(task.status)]
         });
      } 

      try {
          const res = await jwtService.createItem({ 
            itemType: 'task',
            data: task
          }, { 'Content-Type': 'application/json' });
          if (res.status === 201) {
              showMsg(res.message, 'success')
          }
      } catch (_error) {
          showMsg(_error.message, 'error')
      } finally {
        setIsLoading(false)
      }
    };

    const handleUpdateTasks = async (event) => {
      event.preventDefault();

      setIsLoading(true)
      try {
          const res = await jwtService.updateItem({ 
              itemType: 'task',
              data: {
                  data: task,
                  itemId: task.id
              }
           }, { 'Content-Type': 'application/json' });
          if (res.status === 200) {
              showMsg(res.message, 'success')
          }
      } catch (_error) {
          showMsg(_error.message, 'error')
      } finally {
        setIsLoading(false)
      }
    };

  
  // get the list of existing departments with their DB ids
  useEffect(() => {    
      async function getDepartments() {
          try {
              const res = await jwtService.getItems({
                itemType: 'department'
              });
              if (res.status === 200) {
                console.log('THE RESPONSE', res.data)
                const formattedDeparts = res.data.departments.map(department => ({
                  id: department.Id,
                  name: department.Name,
                }));
                setDepartments(formattedDeparts)
              }
          } catch (_error) {
              showMsg(_error.message, 'error')
          }
      }
      
      getDepartments();
  }, []);


    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={tsk ? handleUpdateTasks : handleAddTasks}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label={t('TASK_NAME')}
                      variant="outlined"
                      value={task.taskName}
                      onChange={handleChange('taskName')}
                      required
                    />
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                        <DatePicker
                            label={t('DUE_DATE')}
                            minDate={new Date()}
                            value={task.dueDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>{t('STATUS')}</InputLabel>
                    <Select
                      value={lang === 'ar' ? statusesAr[statuses.indexOf(task.status)] : task.status}
                      label={t('STATUS')}
                      onChange={handleChange('status')}
                      required
                    >
                      { lang === 'ar' ?
                      statusesAr.map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      )) : 
                      statuses.map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))
                      }
                    </Select>
                  </FormControl>
                    
                  <FormControl fullWidth margin="normal">
                    <InputLabel>{t('PRIORITY')}</InputLabel>
                    <Select
                      value={lang === 'ar' ? prioritiesAr[priorities.indexOf(task.priority)] : task.priority}
                      label={t('PRIORITY')}
                      onChange={handleChange('priority')}
                      required
                    >
                      { lang === 'ar' ?
                         prioritiesAr.map((priority) => (
                          <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                        ))
                      : priorities.map((priority) => (
                        <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                      ))
                      }
                    </Select>
                  </FormControl>
                    
                  <FormControl fullWidth margin="normal">
                    <InputLabel>{t('ASSIGN_TO_DEPARTMENT')}</InputLabel>
                    <Select
                      value={task.assignedToDepartment.id ? task.assignedToDepartment.id : task.assignedToDepartment}
                      label={t('ASSIGN_TO_DEPARTMENT')}
                      onChange={handleChange('assignedToDepartment')}
                      required
                    >
                      {departments.map((department) => (
                        <MenuItem key={department.id} value={department.id}>{department.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                      label={t('NOTES')}
                      variant="outlined"
                      multiline
                      rows={3}
                      value={task.notes}
                      onChange={handleChange('notes')}
                    />
                  </FormControl>
                    
                  <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {tsk ? (isLoading ? t('UPDATING') : t('UPDATE_TASK')) : (isLoading ? t('ADDING') : t('ADD_TASK'))}
                  </button>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default AddTask;
