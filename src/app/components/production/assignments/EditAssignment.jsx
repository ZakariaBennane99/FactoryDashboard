import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import jwtService from '../../../auth/services/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';



function EditAssignment({ task }) {

  const currentUserId = window.localStorage.getItem('userId');

    const [assignment, setTask] = useState({
        assignmentName: task.taskName,
        dueDate: new Date(task.dueDate),
        status: task.status,
        priority: task.priority,
        assignedToDepartment: task.assignedToDepartment,
        createdByDepartment: task.createdByDepartment,
        notes: task.notes
    });

    const handleChange = (prop) => (event) => {
        setTask({ ...assignment, [prop]: event.target.value });
    };

    const departments = [
        { label: 'Design', value: 'Design' },
        { label: 'Production', value: 'Production' },
        { label: 'Quality Control', value: 'Quality Control' },
        { label: 'Warehouse', value: 'Warehouse' },
        { label: 'Human Resources', value: 'Human Resources' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Sales', value: 'Sales' },
        { label: 'Operations', value: 'Operations' },
        { label: 'Product Management', value: 'Product Management' },
        { label: 'Supply Chain', value: 'Supply Chain' }
    ]

    const statuses = [
        'REJECTED', 'COMPLETED', 'ONGOING'
    ];

    const priorities = [
        "LOW",
        "MEDIUM",
        "HIGH"
    ]

    const handleDateChange = (date) => {
        setInternalOrder({ ...assignment, dueDate: date });
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
  
        try {
            // @route: api/update/assignments
            // @description: update an existing assignment
            const res = await jwtService.updateItem({ 
                itemType: 'assignments',
                data: {
                    data: assignment,
                    itemId: task.taskId
                }
             }, { 'Content-Type': 'application/json' });
            if (res) {
                // the msg will be sent so you don't have to hardcode it
                showMsg(res, 'success')
            }
        } catch (_error) {
            // the error msg will be sent so you don't have to hardcode it
            showMsg(_error, 'error')
        } 
    };



    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={task ? handleUpdateTasks : handleEditAssignments}>
                  <FormControl fullWidth margin="normal" disabled>
                    <TextField
                      label="Task Name"
                      variant="outlined"
                      value={assignment.assignmentName}
                      onChange={handleChange('assignmentName')}
                      required
                    />
                  </FormControl>

                  <FormControl fullWidth margin="normal" disabled>
                        <DatePicker
                            label="Due Date"
                            value={assignment.dueDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                  </FormControl>

                  <FormControl fullWidth margin="normal" disabled>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={assignment.status}
                      label="Status"
                      onChange={handleChange('status')}
                      required
                    >
                      {statuses.map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                    
                  <FormControl fullWidth margin="normal" disabled>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={assignment.priority}
                      label="Priority"
                      onChange={handleChange('priority')}
                      required
                    >
                      {priorities.map((priority) => (
                        <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                    
                  <FormControl fullWidth margin="normal" disabled>
                    <InputLabel>Assigned To Department</InputLabel>
                    <Select
                      value={assignment.assignedToDepartment}
                      label="Assigned To Department"
                      onChange={handleChange('assignedToDepartment')}
                      required
                    >
                      {departments.map((department) => (
                        <MenuItem key={department.value} value={department.value}>{department.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                    
                  <FormControl fullWidth margin="normal" sx={{ mb: 3 }} disabled>
                    <InputLabel>Created By Department</InputLabel>
                    <Select
                      value={assignment.createdByDepartment}
                      label="Created By Department"
                      onChange={handleChange('createdByDepartment')}
                      required
                    >
                      {departments.map((department) => (
                        <MenuItem key={department.value} value={department.value}>{department.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Notes"
                      variant="outlined"
                      value={assignment.notes}
                      onChange={handleChange('notes')}
                      required
                    />
                  </FormControl>
                    
                  <button type="submit" className="add-depart-btn">
                    Update Task
                  </button>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default EditAssignment;
