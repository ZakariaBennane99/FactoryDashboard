import { useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function AddTask({ tsk }) {

    const [task, setTask] = useState({
        taskName: tsk ? tsk.taskName : '',
        dueDate: tsk ? new Date(tsk.dueDate) : null,
        status: tsk ? tsk.status : '',
        priority: tsk ? tsk.priority : '',
        assignedToDepartment: tsk ? tsk.assignedToDepartment : '',
        createdByDepartment: tsk ? tsk.createdByDepartment : ''
    });

    const handleChange = (prop) => (event) => {
        setTask({ ...task, [prop]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(task);
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
        'PENDING', 'APPROVED', 'REJECTED', 'FULFILLED',
        'CANCELLED', 'COMPLETED', 'ONGOING'
    ];

    const priorities = [
        "LOW",
        "MEDIUM",
        "HIGH"
    ]


    const handleDateChange = (date) => {
        setInternalOrder({ ...task, dueDate: date });
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ minWidth: 120, maxWidth: 500, margin: 'auto', padding: '15px' }}>
                <form onSubmit={handleSubmit}>
                  <FormControl fullWidth margin="normal">
                    <TextField
                      label="Task Name"
                      variant="outlined"
                      value={task.taskName}
                      onChange={handleChange('taskName')}
                      required
                    />
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                        <DatePicker
                            label="Due Date"
                            value={task.dueDate}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} required />}
                        />
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={task.status}
                      label="Status"
                      onChange={handleChange('status')}
                      required
                    >
                      {statuses.map((status) => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                    
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Priority</InputLabel>
                    <Select
                      value={task.priority}
                      label="Priority"
                      onChange={handleChange('priority')}
                      required
                    >
                      {priorities.map((priority) => (
                        <MenuItem key={priority} value={priority}>{priority}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                    
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Assigned To Department</InputLabel>
                    <Select
                      value={task.assignedToDepartment}
                      label="Assigned To Department"
                      onChange={handleChange('assignedToDepartment')}
                      required
                    >
                      {departments.map((department) => (
                        <MenuItem key={department.value} value={department.value}>{department.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                    
                  <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
                    <InputLabel>Created By Department</InputLabel>
                    <Select
                      value={task.createdByDepartment}
                      label="Created By Department"
                      onChange={handleChange('createdByDepartment')}
                      required
                    >
                      {departments.map((department) => (
                        <MenuItem key={department.value} value={department.value}>{department.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                    
                  <button type="submit" className="add-depart-btn">
                    {tsk ? 'Update' : 'Add'} Task
                  </button>
                </form>
            </Box>
        </LocalizationProvider>
    );
}

export default AddTask;
