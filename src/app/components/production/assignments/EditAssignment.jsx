import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import jwtService from '../../../auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { closeDialog } from 'app/store/fuse/dialogSlice';
import { useAppDispatch } from 'app/store';
import { useTranslation } from 'react-i18next';



function EditAssignment({ tsk }) {

  const { t, i18n } = useTranslation('assignmentsPage');
  const lang = i18n.language;

  const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const [task, setTask] = useState({
        id: tsk.id,
        taskName: tsk.taskName,
        dueDate: new Date(tsk.dueDate),
        status: tsk.status,
        priority: tsk.priority,
        assignedToDepartment: tsk.assignedToDepartment,
        createdByDepartment: tsk.createdByDepartment,
        notes: tsk.notes
    });

    const handleChange = (prop) => (event) => {
        setTask({ ...task, [prop]: event.target.value });
    };

    const statuses = [
      'REJECTED', 'COMPLETED', 'ONGOING'
    ];

    const priorities = [
        "LOW",
        "MEDIUM",
        "HIGH"
    ]

    const handleDateChange = (date) => {
        setInternalOrder({ ...task, dueDate: date });
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

    const handleDepartmentChange = (prop) => (event) => {
      const departmentName = event.target.value;
      const department = departments.find(d => d.value === departmentName);
      setTask({ ...task, [prop]: { name: department.label, value: department.value } });
    };



    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={handleUpdateTasks}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label={t('editAssignment.taskName')}
                      variant="outlined"
                      value={task.taskName}
                      onChange={handleChange('taskName')}
                      required
                      disabled
                    />
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                        <DatePicker
                            label={t('editAssignment.dueDate')}
                            value={task.dueDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                            disabled
                        />
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                  <InputLabel>{t('editAssignment.status')}</InputLabel>
                    <Select
                      value={task.status}
                      label={t('editAssignment.status')}
                      onChange={handleChange('status')}
                      required
                    >
                      {statuses.includes(task.status) ? null : (
                        <MenuItem key={task.status} value={task.status} disabled>
                          {task.status}
                        </MenuItem>
                      )}
                      {statuses.map((status) => (
                          <MenuItem key={status} value={status}>{t(`editAssignment.statusOptions.${status}`)}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                    
                  <FormControl fullWidth margin="normal" disabled>
                  <InputLabel>{t('editAssignment.priority')}</InputLabel>
                    <Select
                      value={task.priority}
                      label={t('editAssignment.priority')}
                      onChange={handleChange('priority')}
                      required
                    >
                      {priorities.map((priority) => (
                        <MenuItem key={priority} value={priority}>{t(`editAssignment.priorityOptions.${priority}`)}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                    
                  <FormControl fullWidth margin="normal" disabled>
                  <InputLabel>{t('editAssignment.assignedToDepartment')}</InputLabel>
                    <Select
                      value={task.assignedToDepartment.name}
                      label={t('editAssignment.assignedToDepartment')}
                      onChange={handleDepartmentChange('assignedToDepartment')}
                      required
                    >
                      <MenuItem key={task.assignedToDepartment.name} value={task.assignedToDepartment.name}>{task.assignedToDepartment.name}</MenuItem>
                    </Select>
                  </FormControl>
                    
                  <FormControl fullWidth margin="normal" disabled>
                  <InputLabel>{t('editAssignment.createdByDepartment')}</InputLabel>
                    <Select
                      value={task.createdByDepartment.name}
                      label={t('editAssignment.createdByDepartment')}
                      onChange={handleDepartmentChange('createdByDepartment')}
                      required
                    >
                      <MenuItem key={task.createdByDepartment.name} value={task.createdByDepartment.name}>{task.createdByDepartment.name}</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <TextField
                      label={t('editAssignment.notes')}
                      variant="outlined"
                      value={task.notes}
                      onChange={handleChange('notes')}
                      required
                    />
                  </FormControl>
                    
                  <button type="submit" className={`add-depart-btn ${isLoading ? 'disabled-button' : ''}`} disabled={isLoading}>
                    {isLoading ? t('editAssignment.updatingButton') : t('editAssignment.updateButton')}
                  </button>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default EditAssignment;
