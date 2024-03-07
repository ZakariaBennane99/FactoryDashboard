import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Paper, Grid, Typography } from '@mui/material';
import jwtService from '../../../auth/services/jwtService/jwtService';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useAppDispatch } from 'app/store';
import { openDialog, closeDialog } from 'app/store/fuse/dialogSlice';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditModel from './EditModel';



// Helper function to process models and organize them into todo, progress, and done
const processModels = (models) => {
  return models.reduce((acc, model) => {
    model.trackingModels.forEach(trackingModel => {
      const { status } = trackingModel;
      const modelInfo = {
        id: model.id,
        modelName: model.modelName,
        departmentId: model.departmentId,
        modelImage: model.modelImage,
        templateName: model.templateName,
        color: model.color,
        size: model.size,
        quantity: model.quantity,
        notes: model.notes,
        trackingModelId: trackingModel.trackingModelId,
        status: trackingModel.status,
      };
      if (status === 'AWAITING' || status === 'TODO') {
        acc.todo.push(modelInfo);
      } else if (status === 'INPROGRESS') {
        acc.progress.push(modelInfo);
      } else if (status === 'DONE') {
        acc.done.push(modelInfo);
      }
    });
    return acc;
  }, { todo: [], progress: [], done: [] });
};



const TaskTracking = () => {

  const { t, i18n } = useTranslation('taskTrackingPage');
  const lang = i18n.language;

  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();

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


  const [state, setState] = useState({
    todo: [],
    progress: [],
    done: [],
  });

  useEffect(() => {
    const initializeModels = async () => {
      setIsLoading(true)
      try {
        const res = await jwtService.getProdModels();
        console.log(res);
        if (res.status === 200) {
          const processedData = processModels(res.data);
          setState(processedData);
        }
      } catch (_error) {
        showMsg(t(_error.message), 'error');
      } finally {
        setIsLoading(false)
      }

    };
  
    initializeModels();
  }, []);


  // update the tracking model MainStatus to INPROGRESS
  // update the startTime to the current time 
  // and return true
  const onMoveToInProgress = async (id) => {
    try {
        const res = await jwtService.updateToProg({ 
            itemId: id
         }, { 'Content-Type': 'application/json' });
        if (res.status === 200) {
          showMsg(t(res.message), 'success');
            return true
        }
    } catch (_error) {
        showMsg(t(_error.message), 'error');
        return false
    } 
  };

  const onMoveToDone = async (id, departId) => {
    // first close the current window
    dispatch(closeDialog())
    setTimeout(() => {
        // Now open a new edit dialog with the selected user data
        dispatch(openDialog({
            children: ( 
                <EditModel trackingId={id} depart={departId} />
            ),
            disableBackdropClick: true,
        }));
    }, 100);
  };


  const onDragEnd = (result) => {
    const { source, destination } = result;
  
    // Dropped outside the list or invalid movement
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }
  
    // Get the item being moved
    const item = state[source.droppableId][source.index];

    console.log('THE ITEM', item)
  
    // Prevent moving items that are already in DONE
    if (item.status === 'DONE') {
      console.log("Items in DONE cannot be moved.");
      return;
    }

  
    // Prevent moving directly from todo to done
    if (source.droppableId === 'todo' && destination.droppableId === 'done' || (destination.droppableId === 'todo' && source.droppableId === 'done')) {
      console.log("Items cannot be moved directly from TODO to DONE.");
      return;
    }
  
    // Prevent moving from progress back to todo
    if (source.droppableId === 'progress' && destination.droppableId === 'todo') {
      console.log("Items cannot be moved back to TODO from INPROGRESS.");
      return;
    }

    if (destination.droppableId === 'progress') {
      const res = onMoveToInProgress(item.trackingModelId);
      if (!res) {
        showMsg(t('An error has happened please try again!'), 'error');
        return
      }
    } else if (destination.droppableId === 'done') {
      onMoveToDone(item.trackingModelId, item.departmentId);
    }
    
    const moveResult = move(
      state[source.droppableId],
      state[destination.droppableId],
      source,
      destination
    );

  
    setState({
      ...state,
      [source.droppableId]: moveResult[source.droppableId],
      [destination.droppableId]: moveResult[destination.droppableId],
    });
  };

  const trans = {
    todo: 'للعمل',
    progress: 'قيد التنفيذ',
		done: 'تم',
    modelName: 'اسم النموذج',
		templateName: 'اسم القالب',
		color: 'اللون',
		size: 'الحجم',
		quantity: 'الكمية',
		notes: 'ملاحظات',
		modelImage: 'صورة النموذج',
    clickHere: 'اضغط هنا'
  }


  return (

    isLoading ?     
  <div style={{ 
    width: '100%',
    height: '100%',
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center' }}>
    <CircularProgress st />  
  </div> :
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid container spacing={3} flexWrap="nowrap" justifyContent="space-evenly" alignItems="flex-start">
          {Object.keys(state).map((list) => (
            <Grid item key={list}>
              <Droppable droppableId={list}>
                {(provided, snapshot) => (
                  <div style={{ width: '260px' }}>
                    <Typography variant={lang === 'ar' ? `h5` : 'h6'} component="h2">{lang === 'ar' ? trans[`${list}`] : list.charAt(0).toUpperCase() + list.slice(1).toLowerCase()}</Typography>
                    <Paper
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {state[list].map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id.toString()}
                          index={index}
                          isDragDisabled={item.status === 'AWAITING'}
                          >
                            {
                            (provided, snapshot) => (
                              <Paper
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style,
                                  item.status
                                )}
                              >
                                   <div>
                                    <strong>{lang === 'ar' ? trans.modelName : 'Model Name'}:</strong> {item.modelName}
                                  </div>
                                  <div>
                                    <strong>{lang === 'ar' ? trans.templateName : 'Template Name'}:</strong> {item.templateName}
                                  </div>
                                  <div>
                                    <strong>{lang === 'ar' ? trans.color : 'Color'}:</strong> {item.color}
                                  </div>
                                  <div>
                                    <strong>{lang === 'ar' ? trans.size : 'Size'}:</strong> {item.size}
                                  </div>
                                  <div>
                                    <strong>{lang === 'ar' ? trans.quantity : 'Quantity'}:</strong> {item.quantity}
                                  </div>
                                  <div>
                                    <strong>{lang === 'ar' ? trans.notes : 'Notes'}:</strong> {item.notes}
                                  </div>
                                  <div>
                                    <strong>{lang === 'ar' ? trans.modelImage : 'Model Image'}:</strong> 
                                    <a href={`http://localhost:3002${item.modelImage}`} target="_blank" rel="noopener noreferrer" style={{cursor: 'pointer'}}>
                                      {lang === 'ar' ? trans.clickHere : 'Click here'}
                                    </a>
                                  </div>
                              </Paper>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Paper>
                    </div>
                  )}
                </Droppable>
              </Grid>
            ))}
          </Grid>
        </DragDropContext>
      );
};
  

// Move function
const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

// Styling functions for draggable items and lists
const getItemStyle = (isDragging, draggableStyle, status) => ({
  userSelect: 'none',
  padding: 16,
  margin: `0 0 8px 0`,
  background: isDragging ? 'lightgreen' : status === 'AWAITING' ? 'grey' : 'white',
  lineHeight: '1.8',
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : '#D3D3D3',
  padding: 8,
  width: 250,
  minHeight: 500,
});

export default TaskTracking;

