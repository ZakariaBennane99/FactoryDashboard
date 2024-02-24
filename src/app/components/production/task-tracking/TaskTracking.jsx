import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Paper, Grid, Typography } from '@mui/material';

// A little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// Moves an item from one list to another list.
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

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  borderRadius: '7px',
  padding: 16,
  margin: `0 0 8px 0`,
  background: isDragging ? 'lightgreen' : '#FFFFFF',
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : '#EEEEEE',
  padding: 8,
  borderRadius: '7px',
  width: "100%",
  minHeight: "250px",
});

const TaskTracking = () => {
  const [state, setState] = useState({
    todo: ['Model1', 'Model2'],
    progress: ['Model7', 'Model8'],
    readiness: ['Model4'],
    done: ['Model3', 'Model5'],
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const items = reorder(
        state[source.droppableId],
        source.index,
        destination.index
      );

      setState({ ...state, [source.droppableId]: items });
    } else {
      const result = move(
        state[source.droppableId],
        state[destination.droppableId],
        source,
        destination
      );

      setState({
        ...state,
        [source.droppableId]: result[source.droppableId],
        [destination.droppableId]: result[destination.droppableId],
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid container spacing={3} flexWrap="nowrap" justifyContent="space-between" alignItems="flex-start" style={{ marginTop: '.6rem' }}>
        {Object.keys(state).map((list, index) => (
          <Grid item key={list}> 
            <Droppable key={list} droppableId={list}>
              {(provided, snapshot) => (
                <div style={{ width: '220px' }}>
                  <Typography variant="h6" component="h2">{list.charAt(0).toUpperCase() + list.slice(1)}</Typography>
                  <Paper
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {state[list].map((item, index) => (
                      <Draggable
                        key={item}
                        draggableId={item}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Paper
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            {item}
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

export default TaskTracking;
